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
          hourQuotaId: {
              type: DataTypes.INTEGER(11),
              field: 'hour_quota_id',
              allowNull: true,
          },
          from: {
              type: DataTypes.INTEGER(11),
              field: 'booking_from',
              allowNull: false,
          },
          to: {
              type: DataTypes.INTEGER(11),
              field: 'booking_to',
              allowNull: false,
          },
          duration: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          quotaType: {
            type: DataTypes.INTEGER(11),
            field: 'quota_type',
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
            type: DataTypes.INTEGER(11),
            defaultValue: moment.utc().valueOf(),
            allowNull: false,
            field: 'created_at'
          },
          updatedAt: {
            type: DataTypes.INTEGER(11),
            defaultValue: moment.utc().valueOf(),
            allowNull: false,
            field: 'updated_at'
          }
    }, {

            tableName: 'location_bookings'
        });

    LocationBooking.associate = function (models) {
        LocationBooking.belongsTo(models.RentalLocation, {foreignKey: 'rentalLocationId'});
        LocationBooking.belongsTo(models.User, {foreignKey: 'bookedBy'});
        LocationBooking.belongsTo(models.UserHoursQuota, {foreignKey: 'hourQuotaId'});
    };

    LocationBooking.deleteBooking = async (params) => {
        let deleteLocationBookingPromise = LocationBooking.update({deleted: defaults.FLAG.YES}, {where: {id: params.id}});
        let getLocationBookingPromise = LocationBooking.findOne(
            {
                include: [
                    {
                        model: sequelize.models.RentalLocation,
                        attributes: ['quotaImpact']
                    }
                ],
                where: {
                    id: params.id
                }
            }
        );

        let [deleteLocationBooking, locationBooking] = await bbPromise.all([deleteLocationBookingPromise, getLocationBookingPromise]);

        if(!locationBooking.hourQuotaId) {
            return true;
        }

        if(!_.isEmpty(deleteLocationBooking)) {

            if(params.updateQuota) {
                let options = {
                    where: {
                        id: locationBooking.hourQuotaId
                    }
                };

                let userQuota = await sequelize.models.UserHoursQuota.findOne(options);
                options[sequelize.models.HoursQuotaType.CONSTANTS[locationBooking.quotaType]] = userQuota[sequelize.models.HoursQuotaType.CONSTANTS[locationBooking.quotaType]] + params.bookingHours;
                await userQuota.update(options);
            }
    
            return true;
        }
        return false;
    }
    LocationBooking.formatAccordingToEvents = (data) => {
        let formattedResult = [];
        if(!_.isEmpty(data)) {
            for (let index = 0; index < data.length; index++) {
                let tempObj     = {};
                tempObj.id      = data[index].id;
                tempObj.title   = data[index].RentalLocation.title;
                tempObj.from    = data[index].from;
                tempObj.to      = data[index].to;
                let userCell = (!_.isEmpty(data[index].User.cell)) ? data[index].User.cell : "-"
                tempObj.by      = data[index].User.firstName + " (" + userCell + ")";
                formattedResult.push(tempObj);
            }
        }
        return formattedResult;
    }
    LocationBooking.getLocationBookings = (params) => {
        let whereClause = LocationBooking.getRawParams(params);
        if(params.fromGte && params.fromLte) {
            whereClause[Op.and] = [
                {
                    from: { [Op.gte]: params.fromGte }
                },
                {
                    from: { [Op.lte]: params.fromLte }
                }
            ]
        }
        whereClause.deleted = defaults.FLAG.NO;
        return LocationBooking.findAndCountAll({
            where: whereClause,
            attributes: ['from', 'to', 'id'],
            include: [
                {
                    model: sequelize.models.RentalLocation,
                    attributes: ['title'],
                    required: true
                },
                {
                    model: sequelize.models.User,
                    attributes: ['firstName', 'lastName', 'cell', 'email'],
                    required: true
                }
            ]
        });
    }

    LocationBooking.bookRentalLocation = async (params) => {
        try {
            let locationBookingResult = await LocationBooking.create(LocationBooking.getRawParams(params));
            if(!_.isEmpty(locationBookingResult) && params.quotaImpact) {
                
                /* if(params.peakHoursDeduction && params.peakHoursDeduction > 0) {
                    quotaDeductionPromises.push(sequelize.models.UserHoursQuota.deductQuota({quotaType: defaults.HOURS_QUOTA.PEAK_HOURS, userId: params.bookedBy, quotaAfterDeduction: params.peakHoursAfterDeduction}));
                } */
                await bbPromise.all(_.map(params.quotaDeductionArr, (singleObj) => {
                    sequelize.models.UserHoursQuota.update(singleObj, {where: {id: singleObj.where.id}});
                }));
            }
            return true;
        } catch (err) {
            throw err;
        }
    }
    
    LocationBooking.getLocationBookingBetweenDateRanges = (params) => {

        params.endDate = moment.utc(params.endDate).subtract(1, 'seconds');
        
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

        whereClause.deleted = defaults.FLAG.NO;
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