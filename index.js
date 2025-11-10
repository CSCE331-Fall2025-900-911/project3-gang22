// index.js  — minimal, correct ordering for auth + guards
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

const {
    router: authRouter,
    initAuth,
    requireLogin,
    requireAnyRole
} = require('./server/auth');

app.use(express.json());

// 1) AUTH/SESSION FIRST (before any routes or static)
initAuth(app);
app.use('/api/auth', authRouter);

// 2) API routes
app.use('/api/menu',      require('./server/routes/menu'));
app.use('/api/inventory', require('./server/routes/inventory'));
app.use('/api/orders',    require('./server/routes/orders'));

// 3) GUARD THE HTML PAGES VIA EXPRESS ROUTES (before static)
app.get(
    '/employee.html',
    requireLogin,
    requireAnyRole(['cashier', 'manager']),
    (req, res) => res.sendFile(path.join(__dirname, 'frontend/html/employee.html'))
);

app.get(
    '/manager.html',
    requireLogin,
    requireAnyRole(['manager']),
    (req, res) => res.sendFile(path.join(__dirname, 'frontend/html/manager.html'))
);

// Customer kiosk is public
app.get('/user.html', (req, res) =>
    res.sendFile(path.join(__dirname, 'frontend/html/user.html'))
);

// 4) STATIC FILES LAST
app.use('/js',      express.static(path.join(__dirname, 'frontend/js')));
app.use('/images',  express.static(path.join(__dirname, 'frontend/html/images')));
app.use('/styles.css', express.static(path.join(__dirname, 'frontend/styles.css')));
app.use(express.static(path.join(__dirname, 'frontend/html')));

// Root
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'frontend/html/index.html'))
);

// Boot
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
