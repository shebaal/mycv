const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


// Load User model
const user = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
     user.findOne({
        email: email
      }).then(users => {
        if (!users) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, users.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, users);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(users, done) {
    done(null, users.id);
  });

  passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, users) {
      done(err, users);
    });
  });
};
