'use strict'
var express = require('express');
var router = express.Router();
var passport = require('passport');

const { isLoggedIn } = require('../lib/auth');

//Pagina de Inicio
router.get('/',(req,res)=>{
    res.render('index',{title:"Magic Music"});
});

//Registro de Usuario
router.get('/signup', (req, res) => {
    res.render('auth/signup',{title:"Registro de Usuario"});
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//Inicio de Sesión de Usuario
router.get('/signin', (req, res) => {
    res.render('auth/signin',{title:"Inicio de Sesión"});
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local-singin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

//Cerrar Sesión de Usuario
router.get('/logout',isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});


module.exports = router;