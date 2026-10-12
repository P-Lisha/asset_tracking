const express = require('express');
const router = express.Router();
const { sequelize, Asset, Transaction, Category } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'IN_STOCK' },
      include: Category,
      order: [['assetCode', 'ASC']],
    });
    res.render('scrap/form', { title: 'Scrap Asset', assets });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { assetId, reason, notes } = req.body;
    const asset = await Asset.findByPk(assetId, { transaction: t });
    if (!asset || asset.status === 'SCRAPPED') {
      await t.rollback();
      return res.status(400).render('error', { title: 'Not Allowed', message: 'Asset already scrapped or not found.' });
    }
    if (asset.status === 'ISSUED') {
      await t.rollback();
      return res.status(400).render('error', { title: 'Not Allowed', message: 'Asset is currently issued to an employee. Return it before scrapping.' });
    }
    await asset.update({ status: 'SCRAPPED' }, { transaction: t });
    await Transaction.create({ type: 'SCRAP', reason, notes, assetId }, { transaction: t });
    await t.commit();
    res.redirect('/assets');
  } catch (err) { await t.rollback(); next(err); }
});

module.exports = router;
