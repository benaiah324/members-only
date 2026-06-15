const { body, validationResult, matchedData } = require('express-validator');

const passwordRules = body('password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters.')
  .matches(/[a-z]/)
  .withMessage('Password must contain a lowercase letter.')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter.')
  .matches(/[0-9]/)
  .withMessage('Password must contain a number.');

const signUpValidators = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required.')
    .isLength({ max: 100 })
    .withMessage('First name must be 100 characters or fewer.')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required.')
    .isLength({ max: 100 })
    .withMessage('Last name must be 100 characters or fewer.')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  passwordRules,
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

const loginValidators = [
  body('email').trim().notEmpty().withMessage('Email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const membershipValidators = [
  body('passcode').trim().notEmpty().withMessage('Passcode is required.'),
];

const messageValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 255 })
    .withMessage('Title must be 255 characters or fewer.')
    .escape(),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Message text is required.')
    .isLength({ max: 5000 })
    .withMessage('Message must be 5000 characters or fewer.')
    .escape(),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render(req.renderView, {
      errors: errors.array(),
      oldInput: matchedData(req, { includeOptionals: true }),
    });
  }
  next();
}

module.exports = {
  signUpValidators,
  loginValidators,
  membershipValidators,
  messageValidators,
  handleValidationErrors,
};
