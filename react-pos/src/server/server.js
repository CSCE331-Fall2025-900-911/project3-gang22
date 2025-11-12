// react-pos/src/server/server.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');

const userRoutes = require('./routes/user');       // public (customer)
const employeeRoutes = require('./routes/employee'); // cashier + manager
const managerRoutes = require('./routes/manager');   // manager only

// If your auth module exposes middlewares + router via a factory:
const buildAuth = require('./routes/auth'); // must return { router, requireRole, requireAnyRole, requireAuth }
const { router: authRouter, requireRole, requireAnyRole, requireAuth } = buildAuth();

const app = express();

/* -------------------- CORS with credentials -------------------- */
// Frontend origins allowed to send cookies. Add your deployed URL in FRONTEND_ORIGIN.
const ALLOWED_ORIGINS = [
    process.env.FRONTEND_ORIGIN,     // e.g., https://your-frontend.example
    'http://localhost:4000',
    'http://127.0.0.1:4000',
].filter(Boolean);

const corsOptions = {
    origin(origin, cb) {
        // Allow curl/Postman/no-origin
        if (!origin) return cb(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS: origin not allowed -> ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// handle preflight

/* -------------------- Body parsing -------------------- */
app.use(express.json());

/* -------------------- Sessions & Passport -------------------- */
const isProd = process.env.NODE_ENV === 'production';
if (isProd) app.set('trust proxy', 1); // needed behind proxies for secure cookies

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // localhost: same-site works across ports, prod cross-domain needs 'none' + secure
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd, // true only on HTTPS
    },
}));

app.use(passport.initialize());
app.use(passport.session());

/* -------------------- Auth routes -------------------- */
app.use('/auth', authRouter);

/* -------------------- App routes -------------------- */
// PUBLIC: customer-facing endpoints (kiosk etc.)
app.use('/customer', userRoutes);

// CASHIER: employee or manager
app.use('/cashier', requireAnyRole(['cashier', 'manager']), employeeRoutes);

// MANAGER: manager only
app.use('/manager', requireRole('manager'), managerRoutes);

/* -------------------- Health checks -------------------- */
app.get('/healthz', (_, res) => res.send('ok'));
app.get('/dbz', async (_, res) => {
    try {
        const { query } = require('./db');
        const r = await query('SELECT NOW()');
        res.json(r.rows[0]);
    } catch (e) {
        res.status(500).json({ error: String(e.message || e) });
    }
});

/* -------------------- Error handler (helps surface CORS issues) -------------------- */
app.use((err, req, res, _next) => {
    console.error('[SERVER ERROR]', err);
    if (err.message && err.message.startsWith('CORS:')) {
        return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
});

/* -------------------- Start -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Allowed origins:', ALLOWED_ORIGINS.join(', ') || '(none)');
});
