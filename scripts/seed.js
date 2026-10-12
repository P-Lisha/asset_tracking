require('dotenv').config();
const { sequelize, Branch, Category, Employee, Asset, Transaction } = require('../models');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tables recreated.');

    const branches = await Branch.bulkCreate([
      { name: 'Head Office', location: 'Chennai' },
      { name: 'North Branch', location: 'Delhi' },
      { name: 'West Branch', location: 'Mumbai' },
    ]);

    const categories = await Category.bulkCreate([
      { name: 'Laptop', description: 'Portable computers' },
      { name: 'Mobile Phone', description: 'Smartphones' },
      { name: 'Drill Machine', description: 'Power tools' },
      { name: 'Screw Driver', description: 'Hand tools' },
    ]);

    const employees = await Employee.bulkCreate([
      { name: 'Arun Kumar', email: 'arun@company.com', phone: '9000000001', designation: 'Engineer', isActive: true, branchId: branches[0].id },
      { name: 'Priya Sharma', email: 'priya@company.com', phone: '9000000002', designation: 'Manager', isActive: true, branchId: branches[1].id },
      { name: 'Ravi Teja', email: 'ravi@company.com', phone: '9000000003', designation: 'Technician', isActive: false, branchId: branches[2].id },
    ]);

    const assets = await Asset.bulkCreate([
      { assetCode: 'AST-0001', serialNo: 'SN-LAP-001', make: 'Dell', model: 'Latitude 5420', purchaseValue: 75000, purchaseDate: '2024-01-15', status: 'IN_STOCK', categoryId: categories[0].id, branchId: branches[0].id },
      { assetCode: 'AST-0002', serialNo: 'SN-LAP-002', make: 'HP', model: 'EliteBook 840', purchaseValue: 82000, purchaseDate: '2024-02-10', status: 'IN_STOCK', categoryId: categories[0].id, branchId: branches[1].id },
      { assetCode: 'AST-0003', serialNo: 'SN-MOB-001', make: 'Samsung', model: 'Galaxy S23', purchaseValue: 65000, purchaseDate: '2024-03-05', status: 'IN_STOCK', categoryId: categories[1].id, branchId: branches[0].id },
      { assetCode: 'AST-0004', serialNo: 'SN-DRL-001', make: 'Bosch', model: 'GSB 600', purchaseValue: 5500, purchaseDate: '2024-01-20', status: 'IN_STOCK', categoryId: categories[2].id, branchId: branches[2].id },
    ]);

    for (const a of assets) {
      await Transaction.create({ type: 'PURCHASE', notes: 'Initial purchase', assetId: a.id, txnDate: a.purchaseDate });
    }

    console.log('Seed data inserted successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
