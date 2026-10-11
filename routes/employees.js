const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Employee, Branch } = require('../models');

// List with filters: active/inactive + search
router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const where = {};
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (q) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } },
        { designation: { [Op.iLike]: `%${q}%` } },
      ];
    }
    const employees = await Employee.findAll({ where, include: Branch, order: [['name', 'ASC']] });
    res.render('employees/list', { title: 'Employees', employees, status: status || '', q: q || '' });
  } catch (err) { next(err); }
});

router.get('/new', async (req, res, next) => {
  try {
    const branches = await Branch.findAll({ order: [['name', 'ASC']] });
    res.render('employees/form', { title: 'Add Employee', employee: {}, branches, action: '/employees' });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const body = { ...req.body, isActive: req.body.isActive === 'on' || req.body.isActive === 'true' };
    await Employee.create(body);
    res.redirect('/employees');
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id, { include: Branch });
    if (!employee) return res.status(404).render('error', { title: 'Not Found', message: 'Employee not found.' });
    res.render('employees/view', { title: 'Employee Details', employee });
  } catch (err) { next(err); }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const [employee, branches] = await Promise.all([
      Employee.findByPk(req.params.id),
      Branch.findAll({ order: [['name', 'ASC']] }),
    ]);
    if (!employee) return res.status(404).render('error', { title: 'Not Found', message: 'Employee not found.' });
    res.render('employees/form', { title: 'Edit Employee', employee, branches, action: `/employees/${employee.id}?_method=PUT` });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const body = { ...req.body, isActive: req.body.isActive === 'on' || req.body.isActive === 'true' };
    await Employee.update(body, { where: { id: req.params.id } });
    res.redirect('/employees');
  } catch (err) { next(err); }
});

module.exports = router;
