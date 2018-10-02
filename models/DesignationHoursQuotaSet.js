'use strict';

module.exports = function (sequelize, DataTypes) {

    const DesignationHoursQuotaSet = sequelize.define('DesignationHoursQuotaSet', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          designationId: {
            type: DataTypes.INTEGER(11),
            field: 'designation_id',
            allowNull: false,
          },
          normalHours: {
            type: DataTypes.FLOAT,
            field: 'normal_hours',
            defaultValue: 0,
            allowNull: false,
          },
          boardroomHours: {
            type: DataTypes.FLOAT,
            field: 'boardroom_hours',
            defaultValue: 0,
            allowNull: false,
          },
          unStaffedHours: {
            type: DataTypes.FLOAT,
            field: 'un_staffed_hours',
            defaultValue: 0,
            allowNull: false,
          },
          expiryMonths: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'expiry_months'
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

        tableName: 'designation_hours_quota_set'
    });

    DesignationHoursQuotaSet.getDefaultHoursQuotaSet = (params = []) => {
        return DesignationHoursQuotaSet.findAll({
          where: DesignationHoursQuotaSet.getRawParams(params)
        });
    }


    return DesignationHoursQuotaSet;
}
