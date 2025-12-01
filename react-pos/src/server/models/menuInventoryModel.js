
// Maps menu items to inventory ingredients
const { query } = require('../db');

module.exports = {
  async getAll() {
    const { rows } = await query('SELECT * FROM p2_menu_inventory');
    return rows;
  }
};
