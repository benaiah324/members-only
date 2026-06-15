const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');

async function getHome(req, res) {
  const messages = await Message.findAll();
  const isMember = req.isAuthenticated() && req.user.membershipStatus;
  const isAdmin = req.isAuthenticated() && req.user.isAdmin;

  res.render('index', {
    messages,
    isMember,
    isAdmin,
  });
}

function getSignUp(req, res) {
  res.render('sign-up', { errors: [], oldInput: {} });
}

async function postSignUp(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const adminPasscode = (req.body.adminPasscode || '').trim();

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).render('sign-up', {
        errors: [{ msg: 'An account with this email already exists.' }],
        oldInput: req.body,
      });
    }

    const isAdmin =
      adminPasscode.length > 0 && adminPasscode === process.env.ADMIN_PASSCODE;

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin,
    });

    req.flash('success', 'Account created! Log in, then join the club with the secret passcode.');
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
}

function getLogin(req, res) {
  res.render('login', { errors: [], oldInput: {} });
}

function postLogin(req, res, next) {
  req.flash('success', `Welcome back, ${req.user.firstName}!`);
  res.redirect('/');
}

function postLogout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
  });
}

function getJoinClub(req, res) {
  res.render('join-club', { errors: [], oldInput: {} });
}

async function postJoinClub(req, res) {
  const { passcode } = req.body;

  if (passcode !== process.env.MEMBERSHIP_PASSCODE) {
    return res.status(400).render('join-club', {
      errors: [{ msg: 'Incorrect passcode. The bouncer shakes his head.' }],
      oldInput: req.body,
    });
  }

  await User.updateMembership(req.user.id, true);
  req.user.membershipStatus = true;

  req.flash('success', 'Welcome to the club! You can now see who wrote each message.');
  res.redirect('/');
}

function getNewMessage(req, res) {
  res.render('new-message', { errors: [], oldInput: {} });
}

async function postNewMessage(req, res, next) {
  try {
    await Message.create({
      title: req.body.title,
      text: req.body.text,
      userId: req.user.id,
    });

    req.flash('success', 'Your message has been posted.');
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      req.flash('error', 'Message not found.');
      return res.redirect('/');
    }

    await Message.delete(req.params.id);
    req.flash('success', 'Message deleted.');
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHome,
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  postLogout,
  getJoinClub,
  postJoinClub,
  getNewMessage,
  postNewMessage,
  deleteMessage,
};
