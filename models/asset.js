const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
  assetCode: { type: DataTypes.STRING, allowNull: false, unique: true },
  serialNo: { type: DataTypes.STRING, allowNull: false, unique: true },
  make: { type: DataTypes.STRING },
  model: { type: DataTypes.STRING },
  purchaseValue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  purchaseDate: { type: DataTypes.DATEONLY },
  status: {
    type: DataTypes.ENUM('IN_STOCK', 'ISSUED', 'SCRAPPED'),
    defaultValue: 'IN_STOCK',
  },
}, { tableName: 'assets', timestamps: true });

module.exports = Asset;
