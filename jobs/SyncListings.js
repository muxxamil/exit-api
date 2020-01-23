'use strict';
const { RetsClient, RetsVersion, RetsFormat, DdfCulture } = require('rets-ddf-client');
const _ = require('lodash');
var dotenv            = require('dotenv').config();
const bbPromise = require('bluebird');
const defaults = require('../config/defaults');
const {
    City,
    Province,
    ListingType,
    Company,
    ListingPurpose,
    Listing,
    Attachment
} = require('../models');

const SyncListings = {};

SyncListings.run = async () => {
    const client = new RetsClient({
        url: process.env.CREA_URL,
        username: process.env.CREA_USERNAME,
        password: process.env.CREA_PASSWORD,
        version: RetsVersion.CREA_DDF
    });

    await client.login();

    let limit = 100, offset = 1;

    try {

        let externalListings;

        do {

            externalListings = await client.search({
                format: RetsFormat.StandardXml,
                query: '(LastUpdated=2016-09-26)',
                limit: limit,
                offset: offset,
                searchType: 'Property',
                class: 'Property',
                culture: DdfCulture.EN_CA
            });
            offset = offset + limit;
            externalListings = _.get(externalListings, "records", []);

            if(!_.isEmpty(externalListings)) {
                externalListings = parseExternalListings(externalListings);
                const definitionValues = await getDefinitionValues();
                formatDefinitionValues(definitionValues);
                const definitionValuesToInsert = getNonExistingDefinitionValues(externalListings, definitionValues);
                const promisesArr = insertMissingDefinitionValues(definitionValuesToInsert);

                if(!_.isEmpty(promisesArr)) {
                    const insertedMissingDefinitionValues = await bbPromise.props(promisesArr);
                    formatDefinitionValues(insertedMissingDefinitionValues);
                    getNonExistingDefinitionValues(externalListings, insertedMissingDefinitionValues);
                }

                await bbPromise.all(upsertIntoListing(externalListings));
                await bbPromise.all(refreshImagesOfListings(externalListings));
            }
        } while (externalListings);
        res.send(externalListings);
    } catch (error) {
    } finally {
        client.logout();
    }
};

async function refreshImagesOfListings(data) {
    let listingsResult = await getExitingsListingsOnExternalIds(data);

    const listingIds = _.map(listingsResult, "id");
    listingsResult = _.keyBy(listingsResult, "externalId");

    await Attachment.destroy({
        where: {
            againstType: Attachment.CONSTANTS.AGAINST_TYPE.LISTING,
            againstId: listingIds
        }
    });

    const promisesArr = [];
    for (let index = 0; index < data.length; index++) {
        const listingObj = data[index];
        const attachmentsArr = _.map(listingObj.photo, (photoObj) => {
            return {
                ...photoObj,
                againstId: _.get(listingsResult, `${listingObj.externalId}.id`, null)
            }
        });

        promisesArr.push(Attachment.bulkCreate(_.cloneDeep(attachmentsArr)));
    }
    return promisesArr;
    
}

function getExitingsListingsOnExternalIds(data) {
    const externalIds = _.map(data, "externalId");

    return Listing.findAll({
        attributes: ['id', 'externalId'],
        where: {
            externalId: externalIds
        }
    });
}

async function upsertIntoListing(data) {

    const listingsResult = _.keyBy(await getExitingsListingsOnExternalIds(data), "externalId");

    const promisesArr = [];
    for (let index = 0; index < data.length; index++) {
        const listingObj = data[index];
        if(_.get(listingsResult, listingObj.externalId, null)) {
            _.unset(listingObj, 'featured');
            promisesArr.push(Listing.update(_.cloneDeep(listingObj), {
                where: {
                    externalId: listingObj.externalId
                },
                returning: true,
                plain: true
            }));
        } else {
            promisesArr.push(Listing.create(_.cloneDeep(listingObj)));
        }
    }
    return promisesArr;
}

function insertMissingDefinitionValues(missingDefinitionValues) {
    
    let propsObj = {
        cities: {},
        provinces: {},
        listingTypes: {},
        companies: {},
        listingPurposes: {}
    };

    if(!_.isEmpty(missingDefinitionValues.cities)) {
        propsObj.cities = City.bulkCreate(missingDefinitionValues.cities);
    }

    if(!_.isEmpty(missingDefinitionValues.provinces)) {
        propsObj.provinces = Province.bulkCreate(missingDefinitionValues.provinces);
    }

    if(!_.isEmpty(missingDefinitionValues.listingTypes)) {
        propsObj.listingTypes = ListingType.bulkCreate(missingDefinitionValues.listingTypes);
    }

    if(!_.isEmpty(missingDefinitionValues.companies)) {
        propsObj.companies = Company.bulkCreate(missingDefinitionValues.companies);
    }

    if(!_.isEmpty(missingDefinitionValues.listingPurposes)) {
        propsObj.listingPurposes = ListingPurpose.bulkCreate(missingDefinitionValues.listingPurposes);
    }

    return propsObj;
}

function formatDefinitionValues(definitionValues) {
    definitionValues.cities = _.keyBy(definitionValues.cities, 'key');
    definitionValues.provinces = _.keyBy(definitionValues.provinces, 'key');
    definitionValues.listingTypes = _.keyBy(definitionValues.listingTypes, 'key');
    definitionValues.companies = _.keyBy(definitionValues.companies, 'key');
    definitionValues.listingPurposes = _.keyBy(definitionValues.listingPurposes, 'key');
}

function getDefinitionValues() {
    return bbPromise.props({
        cities: City.findAll({
            attributes: ['id', 'key']
        }),
        provinces: Province.findAll({
            attributes: ['id', 'key']
        }),
        listingTypes: ListingType.findAll({
            attributes: ['id', 'key']
        }),
        companies: Company.findAll({
            attributes: ['id', 'key']
        }),
        listingPurposes: ListingPurpose.findAll({
            attributes: ['id', 'key']
        })
    });
}

function setIdInformattedListingOrMissingDefinitionObj(existingDefinitionValues,  propertyType, propertyTitle, listingObj, listingProperty, missingDefObj) {
    const key = _.camelCase(propertyTitle);
    const existingDefinitionId = _.get(existingDefinitionValues, `${propertyType}.${key}.id`, null);
    if(propertyTitle) {
        if(existingDefinitionId) {
            listingObj[listingProperty] = existingDefinitionId;
        } else {
            missingDefObj[propertyTitle] = {
                key: _.camelCase(propertyTitle),
                title: propertyTitle
            };
        }
    }
}

function getNonExistingDefinitionValues(data = [], definitionValues) {
    const missingDefinition = {
        cities: {},
        provinces: {},
        listingTypes: {},
        companies: {},
        listingPurposes: {}
    };
        
    for (let index = 0; index < data.length; index++) {
        setIdInformattedListingOrMissingDefinitionObj(definitionValues, 'cities', data[index].cityName, data[index], 'cityId', missingDefinition.cities);
        setIdInformattedListingOrMissingDefinitionObj(definitionValues, 'provinces', data[index].provinceName, data[index], 'provinceId', missingDefinition.provinces);
        setIdInformattedListingOrMissingDefinitionObj(definitionValues, 'listingTypes', data[index].type, data[index], 'typeId', missingDefinition.listingTypes);
        setIdInformattedListingOrMissingDefinitionObj(definitionValues, 'companies', data[index].companyName, data[index], 'companyId', missingDefinition.companies);
        setIdInformattedListingOrMissingDefinitionObj(definitionValues, 'listingPurposes', data[index].purpose, data[index], 'purposeId', missingDefinition.listingPurposes);
    }

    return _.transform(missingDefinition, (res, value, key) => {
        res[key] = Object.values(value);
    });
}

function parseExternalListings(externalListings) {
    return _.map(externalListings, (obj) => {
        const area = _.split(_.get(obj, "Building.TotalFinishedArea", ""), ' ');
        const typeName = _.get(obj, "TransactionType", null);
        return {
            externalId: _.get(obj, "_XmlAttributes.ID", null),
            mlsNumber: _.get(obj, "ListingID", null),
            streetName: _.get(obj, "Address.StreetAddress", null),
            cityName: _.get(obj, "Address.City", null),
            provinceName: _.get(obj, "Address.Province", null),
            type: typeName,
            price: _.camelCase(typeName) == ListingType.CONSTANTS.KEYS.LEASE ? _.get(obj, "Lease", 0) : _.get(obj, "Price", 0),
            beds: _.get(obj, "Building.BedroomsTotal", null),
            baths: _.get(obj, "Building.BathroomTotal", null),
            area: _.get(area, '0', null),
            areaType: _.get(area, '1', null),
            companyName: _.get(obj, "AgentDetails.Office.Name", null) || _.get(obj, "AgentDetails.0.Office.Name", null),
            purpose: _.get(obj, "PropertyType", null),
            boardId: _.get(obj, "Board", null),
            featured: defaults.FLAG.NO,
            active: defaults.FLAG.YES,
            addedBy: 1,
            updatedBy: 1,
            photo: _.map(_.filter(_.get(obj, "Photo.PropertyPhoto", []), (singlePhoto) => !_.isEmpty(singlePhoto.PhotoURL)), (photoObj) => {
                const key = `sequence_${_.get(photoObj, "SequenceId", '')}`;
                return {
                    key: key,
                    title: key,
                    path: _.get(photoObj, "PhotoURL", ''),
                    type: Attachment.CONSTANTS.TYPE.IMAGE,
                    againstType: Attachment.CONSTANTS.AGAINST_TYPE.LISTING,
                    againstId: null,
                    active: defaults.FLAG.YES,
                    addedBy: 1,
                    updatedBy: 1
                }
            })
        }
    });
}
module.exports = SyncListings;