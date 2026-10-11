const express = require('express');
const router = express.Router();
const { Asset, Category, Branch } = require('../models');

// Bird's eye view of IN_STOCK assets, grouped by branch with value totals in footer.
router.get('/', async (req, res, next) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'IN_STOCK' },
      include: [Category, Branch],
      order: [['branchId', 'ASC'], ['assetCode', 'ASC']],
    });

    // Totals by branch
    const byBranch = {};
    let grandCount = 0;
    let grandValue = 0;
    for (const a of assets) {
      const bName = a.Branch ? a.Branch.name : 'Unassigned';
      if (!byBranch[bName]) byBranch[bName] = { count: 0, value: 0 };
      byBranch[bName].count += 1;
      byBranch[bName].value += parseFloat(a.purchaseValue || 0);
      grandCount += 1;
      grandValue += parseFloat(a.purchaseValue || 0);
    }

    res.render('stock/list', { title: 'Stock View', assets, byBranch, grandCount, grandValue });
  } catch (err) { next(err); }
});

module.exports = router;
