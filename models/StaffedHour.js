'use strict';

module.exports = function (sequelize, DataTypes) {

    const StaffedHour = sequelize.define('StaffedHour', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          objectType: {
              type: DataTypes.ENUM("office", "rental_location"),
              field: 'object_type',
              allowNull: false,
          },
          objectId: {
              type: DataTypes.INTEGER(11),
              field: 'object_id',
              allowNull: false,
          },
          dayNumber: {
              type: DataTypes.INTEGER(1),
              field: 'day_number',
              allowNull: false,
          },
          from: {
              type: DataTypes.TIME,
              field: 'from',
              allowNull: false,
          },
          to: {
              type: DataTypes.TIME,
              field: 'to',
              allowNull: false,
          },
          peakHours: {
              type: DataTypes.TEXT,
              field: 'peak_hours',
              allowNull: true,
          },
          timeZone: {
              type: DataTypes.STRING(50),
              field: 'timezone',
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

            tableName: 'staffed_hours'
        });

    return StaffedHour;
}