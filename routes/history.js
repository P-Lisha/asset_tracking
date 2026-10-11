const express = require('express');
const router = express.Router();
const { Asset, Category, Branch, Transaction, Employee } = require('../models');

// Pick an asset (includes scrapped, since history is a report)
router.get('/', async (req, res, next) => {
  try {
    const { assetId } = req.query;
    const assets = await Asset.findAll({ order: [['assetCode', 'ASC']] });
    let asset = null;
    let transactions = [];
    if (assetId) {
      asset = await Asset.findByPk(assetId, { include: [Category, Branch] });
      transactions = await Transaction.findAll({
        where: { assetId }, include: Employee, order: [['txnDate', 'ASC'], ['createdAt', 'ASC']],
      });
    }
    res.render('history/view', { title: 'Asset History', assets, asset, transactions, assetId: assetId || '' });
  } catch (err) { next(err); }
});

module.exports = router;
