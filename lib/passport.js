'use strict'

const helpers = require('./helpers');
const {User,Role} = require('../database');

module.exports = function (passport, user, role) {
    var LocalStrategy = require('passport-local').Strategy;
    // var User = user;
    // var Role = role;

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id: id }, include: [{ model: Role }] })
            .then((user) => {
                if (user) {
                    var userInfo = {
                        id: user.id,
                        external_id: user.external_id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName,
                        email: user.email,
                        image: user.image,
                        name: user.firstName + " " + user.lastName,
                        role: user.role.name
                    };
                    done(null, userInfo);
                } else {
                    done(null, false);
                }
            });
    });

   
    //Inicio Sesion
    passport.use('local-singin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {        
        User.findOne({ where: { email: email } })
            .then((user) => {
                
                if (user==null) {
                    return done(null, false);
                }else if (helpers.matchPassword(password, user.password)) {
                    return done(null, user)
                }
                else {
                    return done(null, false);
                }
            }).catch(function (err) {
                console.log("Error:", err);
                return done(null, false);
            });
    }));
};
