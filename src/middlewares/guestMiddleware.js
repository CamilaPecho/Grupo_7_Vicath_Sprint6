function guestMiddleware(req, res, next){
    if (req.session.usuarioLogeado){
        return res.redirect('/profile')
    }
    next();
}

module.exports = guestMiddleware;