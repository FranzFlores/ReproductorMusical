module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('info', 'Se necesita primeramente iniciar sesión.', false);
        return res.redirect('/signin');
    }
};