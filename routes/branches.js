const express = require('express');
const router = express.Router();
const { Branch } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const branches = await Branch.findAll({ order: [['name', 'ASC']] });
    res.render('branches/list', { title: 'Branches', branches });
  } catch (err) { next(err); }
});

router.get('/new', (req, res) => {
  res.render('branches/form', { title: 'Add Branch', branch: {}, action: '/branches' });
});

router.post('/', async (req, res, next) => {
  try {
    await Branch.create(req.body);
    res.redirect('/branches');
  } catch (err) { next(err); }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    res.render('branches/form', { title: 'Edit Branch', branch, action: `/branches/${branch.id}?_method=PUT` });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    await Branch.update(req.body, { where: { id: req.params.id } });
    res.redirect('/branches');
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Branch.destroy({ where: { id: req.params.id } });
    res.redirect('/branches');
  } catch (err) { next(err); }
});

module.exports = router;
