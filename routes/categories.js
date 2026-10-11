const express = require('express');
const router = express.Router();
const { Category } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.render('categories/list', { title: 'Asset Categories', categories });
  } catch (err) { next(err); }
});

router.get('/new', (req, res) => {
  res.render('categories/form', { title: 'Add Category', category: {}, action: '/categories' });
});

router.post('/', async (req, res, next) => {
  try {
    await Category.create(req.body);
    res.redirect('/categories');
  } catch (err) { next(err); }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    res.render('categories/form', { title: 'Edit Category', category, action: `/categories/${category.id}?_method=PUT` });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    await Category.update(req.body, { where: { id: req.params.id } });
    res.redirect('/categories');
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.redirect('/categories');
  } catch (err) { next(err); }
});

module.exports = router;
