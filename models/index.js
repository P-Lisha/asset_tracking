const sequelize = require('../config/database');
const Branch = require('./branch');
const Category = require('./category');
const Employee = require('./employee');
const Asset = require('./asset');
const Transaction = require('./transaction');

Branch.hasMany(Employee, { foreignKey: 'branchId' });
Employee.belongsTo(Branch, { foreignKey: 'branchId' });

Branch.hasMany(Asset, { foreignKey: 'branchId' });
Asset.belongsTo(Branch, { foreignKey: 'branchId' });

Category.hasMany(Asset, { foreignKey: 'categoryId' });
Asset.belongsTo(Category, { foreignKey: 'categoryId' });

Asset.hasMany(Transaction, { foreignKey: 'assetId' });
Transaction.belongsTo(Asset, { foreignKey: 'assetId' });

Employee.hasMany(Transaction, { foreignKey: 'employeeId' });
Transaction.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = { sequelize, Branch, Category, Employee, Asset, Transaction };
