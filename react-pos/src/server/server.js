const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employee');
const managerRoutes = require('./routes/manager');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json()); // parse JSON bodies

// Mount route files
app.use('/api/employees', employeeRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/user', userRoutes);

const buildAuthApp = require('./routes/auth');
const authApp = buildAuthApp();
app.use('/auth', authApp);

const { requireAuth, requireRole } = authApp;
// PUBLIC: customer kiosk endpoints (menus, create order, etc.)
const userRouter = require('./routes/user');
app.use('/customer', userRouter);

// CASHIER: allow cashier or manager
const employeeRouter = require('./routes/employee'); // your cashier APIs
app.use(
    '/employee',
    (req, res, next) => authApp.requireAnyRole(['employee', 'manager'])(req, res, next),
    employeeRouter
);

// MANAGER: manager only
const managerRouter = require('./routes/manager');
app.use(
    '/manager',
    (req, res, next) => authApp.requireRole('manager')(req, res, next),
    managerRouter
);

// health
app.get('/healthz', (_, res) => res.send('ok'));
app.get('/dbz', async (_, res) => {
    const { query } = require('./db');
    const r = await query('SELECT NOW()');
    res.json(r.rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
