'use strict';

const bbPromise = require('bluebird');
const _ = require('lodash');
const sequelize = require('sequelize');
const op = sequelize.Op;
const defaults = require('../config/defaults');
const helpers = require('../helpers/Helper');

module.exports = function (sequelize, DataTypes) {

    const Listing = sequelize.define('Listing', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        externalId: {
            type: DataTypes.INTEGER(11),
            field: 'external_id',
            allowNull: false,
        },
        mlsNumber: {
            type: DataTypes.STRING(15),
            field: 'mls_number',
            allowNull: false,
        },
        streetName: {
            type: DataTypes.STRING(200),
            field: 'street_name',
        },
        cityId: {
            type: DataTypes.INTEGER(11),
            field: 'city_id',
        },
        cityName: {
            type: DataTypes.STRING(100),
            field: 'city_name',
        },
        provinceId: {
            type: DataTypes.INTEGER(11),
            field: 'province_id',
        },
        typeId: {
            type: DataTypes.INTEGER(11),
            field: 'type_id',
        },
        price: {
            type: DataTypes.FLOAT,
        },
        beds: {
            type: DataTypes.INTEGER(11),
        },
        baths: {
            type: DataTypes.INTEGER(11),
        },
        area: {
            type: DataTypes.INTEGER(11),
        },
        areaType: {
            type: DataTypes.ENUM('sqft'),
            field: 'area_type',
        },
        companyId: {
            type: DataTypes.INTEGER(11),
            field: 'company_id',
        },
        purposeId: {
            type: DataTypes.INTEGER(11),
            field: 'purpose_id',
            allowNull: false,
        },
        boardId: {
            type: DataTypes.INTEGER(11),
            field: 'board_id',
        },
        featured: {
            type: DataTypes.BOOLEAN,
            defaulValue: false,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        addedBy: {
            type: DataTypes.INTEGER(11),
            field: 'added_by',
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.INTEGER(11),
            field: 'updated_by',
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at'
        }
    }, {

        tableName: 'listings'
    });

    Listing.associate = function (models) {

        Listing.belongsTo(models.User, {foreignKey: 'addedBy', as: 'AddedBy'});
        Listing.belongsTo(models.User, {foreignKey: 'updatedBy', as: 'UpeatedBy'});
        
        Listing.belongsTo(models.City, {foreignKey: 'cityId'});
        Listing.belongsTo(models.Province, {foreignKey: 'provinceId'});
        Listing.belongsTo(models.ListingType, {foreignKey: 'typeId'});
        Listing.belongsTo(models.ListingPurpose, {foreignKey: 'purposeId'});
        Listing.belongsTo(models.Company, {foreignKey: 'companyId'});

        Listing.hasMany(models.Attachment, {foreignKey: 'againstId', scope: { against_type: ['listing'] }});

    };

    Listing.getListings = async (params) => {
        let options = {};
        options.subQuery = false;
        options.where = {purposeId: {[op.ne]: sequelize.models.ListingPurpose.CONSTANTS.PURPOSES.VACANT_LAND}};

        if(!_.isEmpty(params.beds)) {
            options.where.beds = params.beds == '4+' ? {[op.gt]: 4} : params.beds;
        }
        if(!_.isEmpty(params.baths)) {
            options.where.baths = params.baths == '4+' ? {[op.gt]: 4} : params.baths;
        }
        if(!_.isEmpty(params.featured)) {
            options.where.featured = params.featured;
        }
        
        if(!_.isEmpty(params.boardId)) {
            options.where.boardId = params.boardId;
        }

        if(!_.isEmpty(params.companyId)) {
            options.where.companyId = params.companyId;
        }

        if(!_.isEmpty(params.streetName)) {
            options.where = {
                ...options.where,
                [op.or]: [
                    {
                        streetName: {[op.like]: `%${params.streetName}%`}
                    },
                    {
                        cityName: {[op.like]: `%${params.streetName}%`}
                    },
                    {
                        mlsNumber: params.streetName
                    }
                ]
            }
        }

        if(!_.isEmpty(params.cityId)) {
            options.where.cityId = params.cityId;
        }

        if(!_.isEmpty(params.provinceId)) {
            options.where.provinceId = params.provinceId;
        }

        if(!_.isEmpty(params.typeId)) {
            options.where.typeId = params.typeId;
        }
        
        if(!_.isEmpty(params.purposeId)) {
            options.where.purposeId = params.purposeId;
        }

        if(params.minArea || params.maxArea) {
            options.where.area = params.minArea || params.maxArea;
        }

        if(params.minPrice || params.maxPrice) {
            options.where.price = params.minPrice || params.maxPrice;
        }

        if(params.minArea && params.maxArea) {
            options.where.area = {
                [op.between]: [params.minArea, params.maxArea]
            };
        }

        if(params.minPrice && params.maxPrice) {
            options.where.price = {
                [op.between]: [params.minPrice, params.maxPrice]
            };
        }

        const countPromise = Listing.find({
            attributes: [ [ sequelize.literal('count(*)'), 'count' ] ],
            subQuery: false,
            raw: true,
            where: _.clone(options.where)
        });

        let limitOptions = Listing.setPagination(params);
        if(limitOptions.limit) {
            options.limit = limitOptions.limit
        }
        if(limitOptions.offset || limitOptions.offset == 0) {
            options.offset = limitOptions.offset
        }

        options.attributes = { exclude: ['boardId', 'active', 'addedBy', 'updatedBy', 'createdAt', 'updatedAt'] };

        options.include = [
            {
                model : sequelize.models.ListingPurpose,
                required: true,
                attributes: ['id', 'title']
            },
            {
                model : sequelize.models.Province,
                attributes: ['id', 'title']
            },
            {
                model : sequelize.models.ListingType,
                attributes: ['id', 'title']
            },
            {
                model : sequelize.models.Company,
                attributes: ['id', 'title']
            },
            {
                model : sequelize.models.City,
                attributes: ['id', 'title']
            }
        ];

        options.order = [['external_id', defaults.sortOrder.DESC]];

        const result = await bbPromise.props({
            count: countPromise,
            rows: Listing.findAll(options)
        });
        result.count = result.count.count;

        result.rows = helpers.cleanArray(result.rows);
        if(params.loadImages) {
            result.rows = await Listing.appendAttachments(result.rows);
        }
        return result;
    }

    Listing.appendAttachments = async (data) => {
        const listingIds = _.map(data, 'id');

        let attachments = await sequelize.models.Attachment.findAll({
            attributes: ['id', 'key', 'path', 'againstId'],
            where: {
                againstId: listingIds,
                againstType: sequelize.models.Attachment.CONSTANTS.AGAINST_TYPE.LISTING
            }
        });

        attachments = _.groupBy(attachments, 'againstId');

        return _.map(data, (obj) => {
            return {
                ...obj,
                Attachments: _.get(attachments, obj.id, [])
            }
        });
    }

    return Listing;
}
