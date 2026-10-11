const express = require('express');
const router = express.Router();
const { sequelize, Asset, Employee, Transaction, Category } = require('../models');

// Show form: pick an in-stock asset + an active employee
router.get('/', async (req, res, next) => {
  try {
    const [assets, employees] = await Promise.all([
      Asset.findAll({ where: { status: 'IN_STOCK' }, include: Category, order: [['assetCode', 'ASC']] }),
      Employee.findAll({ where: { isActive: true }, order: [['name', 'ASC']] }),
    ]);
    res.render('issue/form', { title: 'Issue Asset', assets, employees });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { assetId, employeeId, notes } = req.body;
    const asset = await Asset.findByPk(assetId, { transaction: t });
    if (!asset || asset.status !== 'IN_STOCK') {
      await t.rollback();
      return res.status(400).render('error', { message: 'Asset is not available in stock.' });
    }
    await asset.update({ status: 'ISSUED' }, { transaction: t });
    await Transaction.create({ type: 'ISSUE', employeeId, assetId, notes }, { transaction: t });
    await t.commit();
    res.redirect('/assets');
  } catch (err) { await t.rollback(); next(err); }
});

module.exports = router;
