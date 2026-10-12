const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { sequelize, Asset, Employee, Transaction, Category } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'ISSUED' },
      include: [
        Category,
        { model: Transaction, where: { type: 'ISSUE' }, required: false, include: Employee, separate: true, order: [['txnDate', 'DESC']], limit: 1 },
      ],
      order: [['assetCode', 'ASC']],
    });
    res.render('return/form', { title: 'Return Asset', assets });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { assetId, reason, notes } = req.body;
    const asset = await Asset.findByPk(assetId, { transaction: t });
    if (!asset || asset.status !== 'ISSUED') {
      await t.rollback();
      return res.status(400).render('error', { message: 'Asset is not currently issued.' });
    }
    const lastIssue = await Transaction.findOne({
      where: { assetId, type: 'ISSUE' }, order: [['txnDate', 'DESC']], transaction: t,
    });
    await asset.update({ status: 'IN_STOCK' }, { transaction: t });
    await Transaction.create({
      type: 'RETURN', reason, notes, assetId,
      employeeId: lastIssue ? lastIssue.employeeId : null,
    }, { transaction: t });
    await t.commit();
    res.redirect('/assets');
  } catch (err) { await t.rollback(); next(err); }
});

module.exports = router;
