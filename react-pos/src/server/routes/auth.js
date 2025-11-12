// react-pos/src/server/routes/auth.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const { query } = require('../db');

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL, // e.g. http://localhost:3000/auth/google/callback
    SESSION_SECRET,
    FRONTEND_ORIGIN,      // e.g. http://localhost:4000 or deployed URL
    NODE_ENV,
} = process.env;

const isProd = NODE_ENV === 'production';

/* -------------------- Passport serialize/deserialize -------------------- */
passport.serializeUser((user, done) =>
    done(null, { id: user.id, role: user.role, email: user.email })
);
passport.deserializeUser(async (obj, done) => {
    // Trust the session payload. If you prefer, re-query by obj.id.
    done(null, obj);
});

/* -------------------- Google OAuth strategy -------------------- */
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase() || null;
                const display = profile.displayName || null;
                const providerId = profile.id;

                if (!email) return done(null, false, { message: 'No email from Google' });

                // Upsert user; default role manager for the special email, else customer
                const upsert = await query(
                    `
            INSERT INTO users (email, display_name, provider, provider_id, role)
            VALUES ($1, $2, 'google', $3,
                    COALESCE(
                      (SELECT role FROM users WHERE email = $1),
                      CASE WHEN $1 = 'reveille.bubbletea@gmail.com' THEN 'manager' ELSE 'customer' END
                    )
            )
            ON CONFLICT (email)
            DO UPDATE SET display_name = EXCLUDED.display_name,
                          provider_id = EXCLUDED.provider_id
            RETURNING id, email, role, display_name;
          `,
                    [email, display, providerId]
                );

                return done(null, upsert.rows[0]);
            } catch (e) {
                return done(e);
            }
        }
    )
);

/* -------------------- Factory: returns router + guards -------------------- */
function buildAuth() {
    const router = express.Router();

    // CORS (must echo exact origin when credentials are used)
    const ALLOWED_ORIGINS = [
        FRONTEND_ORIGIN,            // deployed or local UI
        'http://localhost:4000',
        'http://127.0.0.1:4000',
    ].filter(Boolean);

    const corsOptions = {
        origin(origin, cb) {
            if (!origin) return cb(null, true); // curl/postman/no-origin
            if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
            return cb(new Error(`CORS (auth): origin not allowed -> ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };

    router.use(cors(corsOptions));

    // Sessions: make cookies work both locally and in prod
    if (isProd) router.set('trust proxy', 1);

    router.use(
        session({
            secret: SESSION_SECRET || 'dev-secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                sameSite: isProd ? 'none' : 'lax',
                secure: isProd, // true only over HTTPS
            },
        })
    );

    router.use(passport.initialize());
    router.use(passport.session());

    /* ------------- Routes ------------- */

    // Kick off Google login
    router.get(
        '/google',
        passport.authenticate('google', {
            scope: ['email', 'profile'],
            prompt: 'select_account',
            accessType: 'offline',
        })
    );

    // OAuth callback
    router.get(
        '/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/fail' }),
        (req, res) => {
            // Redirect back to UI root after successful login
            res.redirect(`${FRONTEND_ORIGIN || 'http://localhost:4000'}/`);
        }
    );

    router.get('/fail', (_req, res) => res.status(401).json({ error: 'Login failed' }));

    // Who am I?
    router.get('/me', (req, res) => {
        if (!req.user) return res.json({ authenticated: false });
        res.json({ authenticated: true, user: req.user });
    });

    // Logout
    router.post('/logout', (req, res) => {
        req.logout(() => {
            req.session.destroy(() => res.json({ ok: true }));
        });
    });

    /* ------------- Guards (exported) ------------- */
    const roleRank = { customer: 0, cashier: 1, manager: 2 };

    const requireAuth = (req, res, next) =>
        req.user ? next() : res.status(401).json({ error: 'Not authenticated' });

    const requireRole = (role) => (req, res, next) =>
        req.user && req.user.role === role
            ? next()
            : res.status(403).json({ error: 'Forbidden' });

    const requireAnyRole = (roles) => (req, res, next) =>
        !req.user
            ? res.status(401).json({ error: 'Not authenticated' })
            : roles.includes(req.user.role)
                ? next()
                : res.status(403).json({ error: 'Forbidden' });

    const requireAtLeast = (minRole) => (req, res, next) =>
        !req.user
            ? res.status(401).json({ error: 'Not authenticated' })
            : (roleRank[req.user.role] ?? -1) >= roleRank[minRole]
                ? next()
                : res.status(403).json({ error: 'Forbidden' });

    return { router, requireAuth, requireRole, requireAnyRole, requireAtLeast };
}

module.exports = buildAuth;
