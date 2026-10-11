const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Asset, Category, Branch, Transaction } = require('../models');

// Only these fields may come from forms; status is managed by issue/return/scrap flows.
function pickAssetFields(body) {
  const { assetCode, serialNo, make, model, purchaseValue, purchaseDate, categoryId, branchId } = body;
  return { assetCode, serialNo, make, model, purchaseValue, purchaseDate, categoryId, branchId };
}

// List with filters: category, search by make/model/serial. Scrapped hidden by default.
router.get('/', async (req, res, next) => {
  try {
    const { categoryId, q, showScrapped } = req.query;
    const where = {};
    if (!showScrapped) where.status = { [Op.ne]: 'SCRAPPED' };
    if (categoryId) where.categoryId = categoryId;
    if (q) {
      where[Op.or] = [
        { make: { [Op.iLike]: `%${q}%` } },
        { model: { [Op.iLike]: `%${q}%` } },
        { serialNo: { [Op.iLike]: `%${q}%` } },
        { assetCode: { [Op.iLike]: `%${q}%` } },
      ];
    }
    const [assets, categories] = await Promise.all([
      Asset.findAll({ where, include: [Category, Branch], order: [['assetCode', 'ASC']] }),
      Category.findAll({ order: [['name', 'ASC']] }),
    ]);
    res.render('assets/list', { title: 'Assets', assets, categories, categoryId: categoryId || '', q: q || '', showScrapped: !!showScrapped });
  } catch (err) { next(err); }
});

router.get('/new', async (req, res, next) => {
  try {
    const [categories, branches] = await Promise.all([
      Category.findAll({ order: [['name', 'ASC']] }),
      Branch.findAll({ order: [['name', 'ASC']] }),
    ]);
    res.render('assets/form', { title: 'Add Asset', asset: {}, categories, branches, action: '/assets' });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const asset = await Asset.create(pickAssetFields(req.body));
    await Transaction.create({ type: 'PURCHASE', notes: 'Asset added', assetId: asset.id, txnDate: asset.purchaseDate || new Date() });
    res.redirect('/assets');
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id, { include: [Category, Branch] });
    if (!asset) return res.status(404).render('error', { title: 'Not Found', message: 'Asset not found.' });
    res.render('assets/view', { title: 'Asset Details', asset });
  } catch (err) { next(err); }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const [asset, categories, branches] = await Promise.all([
      Asset.findByPk(req.params.id),
      Category.findAll({ order: [['name', 'ASC']] }),
      Branch.findAll({ order: [['name', 'ASC']] }),
    ]);
    if (!asset) return res.status(404).render('error', { title: 'Not Found', message: 'Asset not found.' });
    if (asset.status === 'SCRAPPED') return res.status(400).render('error', { title: 'Not Allowed', message: 'Scrapped assets cannot be edited.' });
    res.render('assets/form', { title: 'Edit Asset', asset, categories, branches, action: `/assets/${asset.id}?_method=PUT` });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).render('error', { title: 'Not Found', message: 'Asset not found.' });
    if (asset.status === 'SCRAPPED') return res.status(400).render('error', { title: 'Not Allowed', message: 'Scrapped assets cannot be edited.' });
    await asset.update(pickAssetFields(req.body));
    res.redirect('/assets');
  } catch (err) { next(err); }
});

module.exports = router;
