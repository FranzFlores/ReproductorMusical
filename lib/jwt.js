'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'reproductor';

exports.createToken = function(user){
    var payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.roleId,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }

    return jwt.encode(payload,secret);
} 