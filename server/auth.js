// server/auth.js
// Google OAuth + session auth for Manager/Cashier/Customer

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

/* ---------------------- role mapping ---------------------- */

// ---------------------- role allowlists ----------------------
const MANAGER_SET = new Set(
    (process.env.MANAGER_EMAILS || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
);

const CASHIER_SET = new Set(
    (process.env.CASHIER_EMAILS || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
);

function roleFor(email) {
    if (MANAGER_SET.has(email)) return 'manager';
    if (CASHIER_SET.has(email)) return 'cashier';
    return 'customer';
}

/* ---------------------- passport setup ---------------------- */
passport.serializeUser((user, done) => {
    // keep it minimal in session
    done(null, { id: user.id, name: user.name, email: user.email, role: user.role });
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        try {
            const email = (profile.emails?.[0]?.value || '').toLowerCase();
            const name  = profile.displayName || email || 'User';
            const user  = { id: profile.id, name, email, role: roleFor(email) };
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
));


/* ---------------------- middleware helpers ---------------------- */
function requireLogin(req, res, next) {
    if (req.user) return next();
    return res.sendStatus(401);
}

function requireRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) return next();
        return res.sendStatus(403);
    };
}

function requireAnyRole(roles = []) {
    return (req, res, next) => {
        const role = req.user?.role;
        if (role && roles.includes(role)) return next();
        return res.sendStatus(403);
    };
}

module.exports = {
    router,
    initAuth,
    requireLogin,
    requireRole,
    requireAnyRole,
    passport
};


/* ---------------------- initializer ---------------------- */
function initAuth(app) {
    app.use(
        require('express-session')({
            secret: process.env.SESSION_SECRET || 'dev-session-secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                sameSite: 'lax',
            },
        })
    );

    //initialize passport
    app.use(passport.initialize());
    app.use(passport.session());
}

/* ---------------------- routes ---------------------- */

// Kick off Google OAuth
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

// Google redirect URI
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    (req, res) => {
        // Success: send users to the app shell (or route them by role if you want)
        res.redirect('/');
    }
);

// Current user info
router.get('/me', (req, res) => {
    res.json({ authenticated: !!req.user, user: req.user || null });
});

router.get('/whoami', (req, res) => {
    res.json({
        user: req.user ?? null,
        loggedIn: !!req.user
    });
});

// LOGOUT
router.get('/logout', (req, res, next) => {
    // No session? Just bounce home.
    if (!req.session) {
        res.clearCookie('connect.sid');
        return res.redirect('/');
    }

    // Passport 0.6 requires a callback
    if (typeof req.logout === 'function') {
        req.logout(err => {
            if (err) return next(err);
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('/');
            });
        });
    } else {
        // In case logout isn't present for some reason
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    }
});


// module.exports = {
//     router,
//     initAuth,
//     requireLogin,
//     requireRole,
//     passport
// };
