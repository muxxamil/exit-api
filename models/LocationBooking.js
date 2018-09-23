'use strict';
const _             = require('lodash');
const bbPromise     = require('bluebird');
const moment        = require('moment');
const sequelize     = require('sequelize');
const Op            = sequelize.Op;
const defaults      = require('../config/defaults');

module.exports = function (sequelize, DataTypes) {

    const LocationBooking = sequelize.define('LocationBooking', {


        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          rentalLocationId: {
              type: DataTypes.INTEGER(11),
              field: 'rental_location_id',
              allowNull: false,
          },
          from: {
              type: DataTypes.DATE,
              field: 'booking_from',
              allowNull: false,
          },
          to: {
              type: DataTypes.DATE,
              field: 'booking_to',
              allowNull: false,
          },
          bookedBy: {
            type: DataTypes.INTEGER(11),
            field: 'booked_by',
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
    }, {

            tableName: 'location_bookings'
        });

    LocationBooking.associate = function (models) {
        LocationBooking.belongsTo(models.RentalLocation, {foreignKey: 'rentalLocationId'});
        LocationBooking.belongsTo(models.User, {foreignKey: 'bookedBy'});
    };

    LocationBooking.formatAccordingToEvents = (data) => {
        let formattedResult = [];
        if(!_.isEmpty(data)) {
            for (let index = 0; index < data.length; index++) {
                let tempObj     = {};
                tempObj.id      = data[index].id;
                tempObj.title   = data[index].RentalLocation.title;
                tempObj.start   = moment(data[index].from).format(defaults.dateFormat);
                tempObj.from    = moment(data[index].from).format(defaults.amPmTimeFormat);
                tempObj.to      = moment(data[index].to).format(defaults.amPmTimeFormat);
                formattedResult.push(tempObj);
            }
        }
        return formattedResult;
    }
    LocationBooking.getLocationBookings = (params) => {
        let whereClause = LocationBooking.getRawParams(params);
        whereClause.deleted = defaults.FLAG.NO;
        return LocationBooking.findAndCountAll({
            where: whereClause,
            attributes: ['from', 'to', 'id'],
            include: [
                {
                    model: sequelize.models.RentalLocation,
                    attributes: ['title']
                },
                {
                    model: sequelize.models.User,
                    attributes: ['name']
                }
            ]
        });
    }

    LocationBooking.bookRentalLocation = async (params) => {
        let locationBookingResult = await LocationBooking.create(LocationBooking.getRawParams(params));
        if(!_.isEmpty(locationBookingResult) && params.quotaImpact) {
            let quotaDeductionPromises = [];
            quotaDeductionPromises.push(sequelize.models.UserHoursQuota.deductQuota({quotaType: params.quotaKey, userId: params.bookedBy, quotaAfterDeduction: params.quotaAfterDeduction}));
            
            if(params.peakHoursDeduction && params.peakHoursDeduction > 0) {
                quotaDeductionPromises.push(sequelize.models.UserHoursQuota.deductQuota({quotaType: defaults.HOURS_QUOTA.PEAK_HOURS, userId: params.bookedBy, quotaAfterDeduction: params.peakHoursAfterDeduction}));
            }

            await bbPromise.all(quotaDeductionPromises);
        }
        return true;
    }
    
    LocationBooking.getLocationBookingBetweenDateRanges = (params) => {
        
        let whereClause = {
            [Op.or]: [
                {
                    [Op.and]: [
                        {
                            from: {
                                [Op.lte]: params.startDate
                            },
                            to: {
                                [Op.gte]: params.startDate
                            },
                        }
                    ]
                },
                {
                    [Op.and]: [
                        {
                            from: {
                                [Op.gte]: params.startDate
                            }
                        },
                        {
                            from: {
                                [Op.lte]: params.endDate
                            }
                        }
                    ]
                }
            ]
        };

        if(params.rentalLocationId) {
            whereClause.rentalLocationId = params.rentalLocationId;
        }

        return LocationBooking.findOne({
            where: whereClause,
            attributes: [
                'id'
            ],
            limit: 1
        });

    }

    return LocationBooking;
}