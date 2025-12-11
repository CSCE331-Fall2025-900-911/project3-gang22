const { query } = require('../db');

module.exports = {
    async getCustomizations(menuItemID) {
        console.log("Query Menu ID: " + menuItemID);
        const { rows } = await query('SELECT name, adjustment, price FROM customizations WHERE menu_id = $1', [menuItemID]);
        return rows;
    },

    async getGroups() {
        const { rows } = await query(`
            SELECT DISTINCT name 
            FROM customizations 
            ORDER BY name
        `);
        return rows.map(r => r.name);
    },

    // Remove all rows for a given group
    async removeGroup(menuId, groupName) {
        await query(
            `DELETE FROM customizations WHERE menu_id = $1 AND name = $2`,
            [menuId, groupName]
        );
    },

    // Add all rows for a group by copying adjustments/prices from existing template rows
    async addGroup(menuId, groupName) {
        // Get distinct adjustments/prices for this group from any existing menu item
        const { rows } = await query(
            `SELECT DISTINCT adjustment, price
            FROM customizations
            WHERE name = $1`,
            [groupName]
        );

        if (rows.length === 0) {
            console.warn(`No template customizations found for group ${groupName}`);
            return;
        }

        // Insert each adjustment/price for the new menuId
        for (const row of rows) {
            await query(
            `INSERT INTO customizations (menu_id, name, adjustment, price)
            VALUES ($1, $2, $3, $4)`,
            [menuId, groupName, row.adjustment, row.price]
            );
        }
    },

    async removeAllForMenu(menuId) {
        await query(`DELETE FROM customizations WHERE menu_id = $1`, [menuId]);
    },

};