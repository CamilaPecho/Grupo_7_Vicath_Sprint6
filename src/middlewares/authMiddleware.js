function authMiddleware(req, res, next){
    
    if (!req.session.usuarioLogeado){
        return res.redirect('/login')
    }
    next();
}

module.exports = authMiddleware;