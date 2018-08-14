/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './src/models';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    if (user) {
      done(null, user.id);
    } else {
      done(null, false);
    }
  });
});

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      const isValidPassword = (userpass, passwrd) =>
        bcrypt.compareSync(passwrd, userpass);

      User.findOne({
        where: {
          email,
        },
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Email does not exist.' });
        }

        if (!isValidPassword(user.password, password)) {
          return done(null, false, { message: 'Incorrect Password' });
        }

        return done(null, user);
      });
    },
  ),
);

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      const generateHash = passwrd =>
        bcrypt.hashSync(passwrd, bcrypt.genSaltSync(8), null);

      User.findOne({
        where: {
          email,
        },
      }).then((user, err) => {
        if (err) return done(null, false);

        if (!user) {
          const userPassword = generateHash(password);
          User.create({
            email,
            password: userPassword,
          })
            .then(usr => done(null, usr))
            .catch(error => done(null, error));
        } else {
          return done(null, false);
        }
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
