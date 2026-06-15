require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const methodOverride = require('method-override');
const path = require('path');
const pool = require('./db/pool');
require('./config/passport');
const passport = require('passport');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(
  session({
    store: new pgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

app.use((req, res, next) => {
  req.flash = (type, message) => {
    req.session[type] = message;
  };
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  delete req.session.success;
  delete req.session.error;
  res.locals.user = req.user || null;
  next();
});

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.',
  });
});

app.listen(PORT, () => {
  console.log(`Members Only clubhouse running at http://localhost:${PORT}`);
});
