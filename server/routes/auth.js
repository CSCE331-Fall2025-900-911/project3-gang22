require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

/* ---------------------- Role Mappings ---------------------- */
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

/* ---------------------- Passport Setup ---------------------- */
passport.serializeUser((user, done) => {
  done(null, { id: user.id, name: user.name, email: user.email, role: user.role });
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const email = (profile.emails?.[0]?.value || '').toLowerCase();
        const name = profile.displayName || email;
        const role = roleFor(email);
        const user = { id: profile.id, name, email, role };
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/* ---------------------- Middleware ---------------------- */
function requireLogin(req, res, next) {
  if (req.user) return next();
  res.sendStatus(401);
}

/* ---------------------- Auth Initializer ---------------------- */
function initAuth(app) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: 'lax' },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
}

/* ---------------------- Routes ---------------------- */

// Start Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    // Successful login — redirect to frontend
    res.redirect('/');
  }
);

router.get('/check', requireLogin, (req, res) => {
  res.json({
    authenticated: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  });
});

router.get('/logout', (req, res, next) => {
  if (typeof req.logout === 'function') {
    req.logout(err => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    });
  } else {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }
});

module.exports = {
  router,
  initAuth,
  passport,
};
