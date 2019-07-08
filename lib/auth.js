module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('BAD', 'Se necesita primeramente iniciar sesión.', '/signin');
    }
};