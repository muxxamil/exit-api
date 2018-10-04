'use strict';

const moment        = require('moment');
const sequelize     = require('sequelize');
const _             = require('lodash');
const Op            = sequelize.Op;
const defaults      = require('../config/defaults');

module.exports = function (sequelize, DataTypes) {

    const RentalLocation = sequelize.define('RentalLocation', {


        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          key: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          title: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          officeLocationId: {
              type: DataTypes.INTEGER(11),
              field: 'office_location_id',
              allowNull: false,
          },
          staffedHours: {
              type: DataTypes.BOOLEAN,
              field: 'staffed_hours_booking',
              allowNull: false,
          },
          unStaffedHours: {
              type: DataTypes.BOOLEAN,
              field: 'un_staffed_hours_booking',
              allowNull: false,
          },
          boardroomHours: {
              type: DataTypes.BOOLEAN,
              field: 'boardroom_hours',
              allowNull: false,
          },
          quotaImpact: {
              type: DataTypes.BOOLEAN,
              defaultValue: true,
              field: 'quota_impact',
              allowNull: false,
          },
          active: {
              type: DataTypes.BOOLEAN,
              defaultValue: true,
              allowNull: false,
          },
          deleted: {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
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
    }, 
    {
        tableName: 'rental_locations'
    });

    RentalLocation.associate = function (models) {
        RentalLocation.belongsTo(models.OfficeLocation, {foreignKey: 'officeLocationId'});
        RentalLocation.hasMany(models.StaffedHour, {foreignKey: 'objectId', scope: { object_type: ['rental_location'] }});
    };

    RentalLocation.getDetailedRentalLocation = (id) => {
        return RentalLocation.findOne({
            include: [
                {
                    model: sequelize.models.OfficeLocation,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            required: true,
                            model: sequelize.models.StaffedHour
                        }
                    ]
                },
                {
                    model: sequelize.models.StaffedHour
                }
            ],
            where: {
                id: id
            }
        });
    }
    RentalLocation.getRentalLocations = (params) => {
        let options             = {};
        options.attributes      = ['id', 'title'];
        options.where           = RentalLocation.getRawParams(params);
        options.where.deleted   = defaults.FLAG.NO;
        return RentalLocation.findAndCountAll(options);
    }
    
    RentalLocation.getBookings = async (params) => {
        let options     = {};
        options.where   = {};
        if(!_.isEmpty(params.from) && !_.isEmpty(params.to)) {
            options.where = {
                [Op.and]: [
                    {
                        from: { [Op.gte]: params.from }
                    },
                    {
                        from: { [Op.lte]: params.to }
                    }
                ]
            };
        } else {
            options.where = (params.futureBookings) ? {
                from: { [Op.gte]: params.from }
            } : {
                from: { [Op.lte]: params.from }
            };
        }

        options.where.deleted = defaults.FLAG.NO;

        if(params.rentalLocationId) {
            options.where.rentalLocationId = params.rentalLocationId;
        }
        
        return sequelize.models.LocationBooking.findAll(options);
    }

    return RentalLocation;
}