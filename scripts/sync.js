// Creates/updates all tables based on the models. Run: npm run db:sync
require('dotenv').config();
const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All tables synced successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
})();
