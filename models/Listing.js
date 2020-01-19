'use strict';

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
        provinceId: {
            type: DataTypes.INTEGER(11),
            field: 'province_id',
        },
        typeId: {
            type: DataTypes.INTEGER(11),
            field: 'type_id',
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
        board_id: {
            type: DataTypes.BOOLEAN,
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

    return Listing;
}
