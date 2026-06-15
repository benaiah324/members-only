const express = require('express');
const passport = require('../config/passport');
const {
  ensureAuthenticated,
  ensureAdmin,
} = require('../middleware/auth');
const {
  signUpValidators,
  loginValidators,
  membershipValidators,
  messageValidators,
} = require('../middleware/validators');
const mainController = require('../controllers/mainController');

const router = express.Router();

function validate(validators, viewName) {
  return async (req, res, next) => {
    await Promise.all(validators.map((v) => v.run(req)));
    const { validationResult, matchedData } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render(viewName, {
        errors: errors.array(),
        oldInput: matchedData(req, { includeOptionals: true }),
      });
    }
    next();
  };
}

router.get('/', mainController.getHome);

router.get('/sign-up', mainController.getSignUp);
router.post(
  '/sign-up',
  validate(signUpValidators, 'sign-up'),
  mainController.postSignUp
);

router.get('/login', mainController.getLogin);
router.post(
  '/login',
  validate(loginValidators, 'login'),
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).render('login', {
          errors: [{ msg: info?.message || 'Incorrect email or password.' }],
          oldInput: req.body,
        });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return mainController.postLogin(req, res, next);
      });
    })(req, res, next);
  }
);

router.post('/logout', ensureAuthenticated, mainController.postLogout);

router.get('/join-club', ensureAuthenticated, mainController.getJoinClub);
router.post(
  '/join-club',
  ensureAuthenticated,
  validate(membershipValidators, 'join-club'),
  mainController.postJoinClub
);

router.get('/messages/new', ensureAuthenticated, mainController.getNewMessage);
router.post(
  '/messages/new',
  ensureAuthenticated,
  validate(messageValidators, 'new-message'),
  mainController.postNewMessage
);

router.post(
  '/messages/:id/delete',
  ensureAuthenticated,
  ensureAdmin,
  mainController.deleteMessage
);

module.exports = router;
