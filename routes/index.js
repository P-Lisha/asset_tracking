const express = require('express');
const router = express.Router();
const { Asset, Employee, Category, Branch } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const [inStock, issued, scrapped, employees, categories, branches] = await Promise.all([
      Asset.count({ where: { status: 'IN_STOCK' } }),
      Asset.count({ where: { status: 'ISSUED' } }),
      Asset.count({ where: { status: 'SCRAPPED' } }),
      Employee.count(),
      Category.count(),
      Branch.count(),
    ]);
    res.render('dashboard', { title: 'Dashboard', inStock, issued, scrapped, employees, categories, branches });
  } catch (err) { next(err); }
});

module.exports = router;
