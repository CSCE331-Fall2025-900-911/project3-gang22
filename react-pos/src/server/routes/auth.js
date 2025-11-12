const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const { query } = require('../db');

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    SESSION_SECRET,
    FRONTEND_ORIGIN
} = process.env;

// Passport user serialization
passport.serializeUser((user, done) => done(null, { id: user.id, role: user.role }));
passport.deserializeUser(async (obj, done) => {
    // minimal: trust cookie content; if you prefer, re-fetch from DB by obj.id
    done(null, obj);
});

console.log('Using Google callback URL:', process.env.GOOGLE_CALLBACK_URL);


// Google strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value?.toLowerCase() || null;
        const display = profile.displayName || null;
        const providerId = profile.id;

        if (!email) return done(null, false, { message: 'No email from Google' });

        // Upsert user
        const upsert = await query(`
      INSERT INTO users (email, display_name, provider, provider_id, role)
      VALUES ($1,$2,'google',$3, COALESCE(
        (SELECT role FROM users WHERE email=$1),
        CASE WHEN $1='reveille.bubbletea@gmail.com' THEN 'manager' ELSE 'customer' END
      ))
      ON CONFLICT (email)
      DO UPDATE SET display_name = EXCLUDED.display_name, provider_id = EXCLUDED.provider_id
      RETURNING id, email, role, display_name;
    `, [email, display, providerId]);

        return done(null, upsert.rows[0]);
    } catch (e) {
        return done(e);
    }
}));

// Build a tiny auth app (mounted by server.js)
function buildAuthApp() {
    const app = express();

    app.use(cors({
        origin: FRONTEND_ORIGIN,
        credentials: true
    }));

    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Kick off Google login
    app.get(
        '/google',
        (req, res, next) =>
            passport.authenticate('google', {
                scope: ['email', 'profile'],
                prompt: 'select_account',
                accessType: 'offline'
            })(req, res, next)
    );

    // Callback
    app.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/fail' }),
        (req, res) => {
            // after login, send user back to the frontend
            res.redirect(`${FRONTEND_ORIGIN}/`);
        }
    );

    app.get('/fail', (req, res) => res.status(401).json({ error: 'Login failed' }));

    // Who am I?
    app.get('/me', (req, res) => {
        if (!req.user) return res.json({ authenticated: false });
        res.json({ authenticated: true, user: req.user });
    });

    // Logout
    app.post('/logout', (req, res) => {
        req.logout(() => {
            req.session.destroy(() => res.json({ ok: true }));
        });
    });

    // Auth guard helpers you can import elsewhere
    app.requireAuth = (req, res, next) => {
        if (req.user) return next();
        return res.status(401).json({ error: 'Not authenticated' });
    };

    app.requireRole = role => (req, res, next) => {
        if (req.user && req.user.role === role) return next();
        return res.status(403).json({ error: 'Forbidden' });
    };

    const roleRank = { customer: 0, cashier: 1, manager: 2 };

    app.requireAnyRole = roles => (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (roles.includes(req.user.role)) return next();
        return res.status(403).json({ error: 'Forbidden' });
    };

    app.requireAtLeast = minRole => (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if ((roleRank[req.user.role] ?? -1) >= roleRank[minRole]) return next();
        return res.status(403).json({ error: 'Forbidden' });
    };

    return app;
}

module.exports = buildAuthApp;
