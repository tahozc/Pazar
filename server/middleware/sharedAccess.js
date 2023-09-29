const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwt.secret;

const sharedAccess = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    // If a user is authenticated, attach it to req.user, otherwise keep it undefined
    if (user) {
      req.user = user;
    } else {
      req.user = undefined;
    }

    next();
  })(req, res, next);
};

module.exports = sharedAccess;
