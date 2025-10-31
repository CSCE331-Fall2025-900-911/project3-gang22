const { Client } = require('pg');
const { scheduler } = require('timers/promises');
require('dotenv').config();

const PASS = '\u{1F7E9}';
const FAIL = '\u{1F7E5}';
const WARN = '\u{1F7E8}';
const TERMINATED = '\u{2B1B}';

const client = new Client({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    console.log('- - - Testing Connection - - -')
    await client.connect();
    console.log(`${PASS} Successfully connected to database.`);

    const db_schema = {
      p2_employees: ['id', 'name', 'role', 'schedule'],
      p2_inventory: ['id', 'name', 'unit', 'quantity', 'reorder_threshold', 'unit_cost'],
      p2_menu: ['id', 'drink_name', 'price', 'category', 'picture_url', 'tea_type', 'milk_type'],
      p2_menu_inventory: ['menu_id', 'inventory_id', 'quantity'],
      p2_order_items: ['order_id', 'menu_id', 'quantity', 'total'],
      p2_orders: ['id', 'subtotal', 'tax', 'total', 'order_time', 'employee_id'],
      p2_transactions: ['order_id', 'card_expr_m', 'card_expr_y', 'card_holder'],
      p2_zreport: ['id', 'report_date', 'total_sales', 'total_returns', 'total_voids', 'total_discards', 'total_cash', 'total_card', 'total_other']
    };

    // Query for all db tables
    const res = await client.query(`
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
    `);

    dbTables = res.rows.map(r => r.tablename);
    const expectedTables = Object.keys(db_schema);

    // Check for missing tables
    const missingTables = expectedTables.filter(t => !dbTables.includes(t));
    if (missingTables.length > 0) {
        missingTables.forEach((tbl) => {console.log(`${FAIL} Missing table ${tbl}`);});
    } else {
      console.log(PASS + ' All tables found.');
    }
    // filter for tables we can check
    dbTables = dbTables.filter(t => expectedTables.includes(t));


    // Check for missing columns
    for (const tbl of dbTables) {
        const expColumns = db_schema[tbl];
        const res = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = $1
            ORDER BY ordinal_position;
        `, [tbl]);

        const columns = res.rows.map((r) => r.column_name);

        const missingCols = expColumns.filter(t => !columns.includes(t));
        if (missingCols.length > 0) {
            console.log(`${FAIL} ${tbl} Missing Columns`)
            missingCols.forEach((col) => {console.log(` - ${col}`);});
        } else {
            console.log(`${PASS} All columns found for ${tbl}.`);
        }

    }
    

  } catch (err) {
    console.error('Database connection or query failed:', err);
  } finally {
    await client.end();
    console.log(`${TERMINATED} Connection closed.`);
  }
})();
