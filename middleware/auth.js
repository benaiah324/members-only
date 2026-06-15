function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in to access that page.');
  res.redirect('/login');
}

function ensureMember(req, res, next) {
  if (req.isAuthenticated() && req.user.membershipStatus) {
    return next();
  }
  req.flash('error', 'Only club members can access that page.');
  res.redirect('/');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error', 'Admin access required.');
  res.redirect('/');
}

module.exports = {
  ensureAuthenticated,
  ensureMember,
  ensureAdmin,
};
