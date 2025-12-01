
// Controller for public/customer-facing routes, providng endpoints to fetch the menu and submit customer orders.
const { query } = require('../db');
const menuModel = require('../models/menuModel');
const orderModel = require('../models/orderModel');
const orderItemModel = require('../models/orderItemModel');
const transactionModel = require('../models/transactionModel');

require("dotenv").config({path:'../.env'});
const { TranslationServiceClient } = require("@google-cloud/translate").v3;

const client = new TranslationServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_PROJECT_ID
});


const projectId = process.env.GOOGLE_PROJECT_ID;

module.exports = {

  async translate(text, target) {
    const request = {
      parent: `projects/${projectId}/locations/global`,
      contents: [text],
      mimeType: "text/plain",
      targetLanguageCode: target,
    };

    const [response] = await client.translateText(request);
    return response.translations[0].translatedText;
  },

  async translateText(req, res) {
    try {
      const { text, target } = req.query;

      if (!text || !target) {
        return res.status(400).json({ error: "Missing 'text' or 'target'" });
      }

      const translated = await module.exports.translate(text, target);
      res.json({ translated });

    } catch (err) {
      console.error("Error translating text:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getMenu(req, res) {
    try {
      res.json(await menuModel.getAll());
    } catch (err) {
      console.error('Error fetching menu:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createOrder(req, res) {
    const {
      order_time,
      menu_ids,
      quantities,
      totals,
      card_number,
      card_expr_m,
      card_expr_y,
      card_holder,
    } = req.body;

    // Validate
    if (
      !order_time ||
      !Array.isArray(menu_ids) ||
      !Array.isArray(quantities) ||
      !Array.isArray(totals) ||
      !card_number ||
      !card_expr_m ||
      !card_expr_y ||
      !card_holder
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    if (menu_ids.length !== quantities.length || menu_ids.length !== totals.length) {
      return res.status(400).json({ error: 'menu_ids, quantities, totals must have same length' });
    }

    try {
      await query('BEGIN');

      const employee_id = 999; // customer order
      const subtotal = totals.reduce((acc, x) => acc + x, 0);
      const tax = subtotal * 0.0625;
      const total = subtotal + tax;

      const order_id = await orderModel.createOrder({
        subtotal,
        tax,
        total,
        order_time,
        employee_id,
      });

      for (let i = 0; i < menu_ids.length; i++) {
        await orderItemModel.addOrderItem(order_id, {
          menu_id: menu_ids[i],
          quantity: quantities[i],
          total: totals[i],
        });
      }

      await transactionModel.addTransaction(order_id, {
        card_number,
        card_expr_m,
        card_expr_y,
        card_holder,
      });

      await query('COMMIT');
      res.status(201).json({ message: 'Order created', order_id, subtotal, tax, total });
    } catch (err) {
      await query('ROLLBACK');
      console.error('Error creating order:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
