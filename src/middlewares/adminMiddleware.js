function adminMiddleware(req, res, next){
    
    if (req.session.usuarioLogeado){
        
       if(req.session.usuarioLogeado.rol != "admin")
       {
           return res.redirect('/');
       } 
}
    next(); //si tiene admin va por aca
}
module.exports = adminMiddleware;