require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { sequelize } = require('./models');

const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/branches', require('./routes/branches'));
app.use('/categories', require('./routes/categories'));
app.use('/employees', require('./routes/employees'));
app.use('/assets', require('./routes/assets'));
app.use('/stock', require('./routes/stock'));
app.use('/issue', require('./routes/issue'));
app.use('/return', require('./routes/return'));
app.use('/scrap', require('./routes/scrap'));
app.use('/history', require('./routes/history'));

// 404
app.use((req, res) => res.status(404).render('error', { message: 'Page not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { message: err.message });
});

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => console.log(`Asset Tracker running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err.message);
    process.exit(1);
  });
