const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  type: {
    type: DataTypes.ENUM('PURCHASE', 'ISSUE', 'RETURN', 'SCRAP'),
    allowNull: false,
  },
  reason: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
  txnDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'transactions', timestamps: true });

module.exports = Transaction;
