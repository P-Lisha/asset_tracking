const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Immutable event log that powers Issue / Return / Scrap and Asset History.
// type: PURCHASE | ISSUE | RETURN | SCRAP
const Transaction = sequelize.define('Transaction', {
  type: {
    type: DataTypes.ENUM('PURCHASE', 'ISSUE', 'RETURN', 'SCRAP'),
    allowNull: false,
  },
  reason: { type: DataTypes.STRING },   // return reason: upgrade / repair / resignation etc.
  notes: { type: DataTypes.STRING },
  txnDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'transactions', timestamps: true });

module.exports = Transaction;
