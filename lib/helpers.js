'use strict'
var bcrypt = require('bcrypt-nodejs');

const helpers = {};

helpers.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

helpers.matchPassword = function(userPassword,password){
    return bcrypt.compareSync(userPassword,password);
};

module.exports = helpers;