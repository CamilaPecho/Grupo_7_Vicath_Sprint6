function adminMiddleware(req, res, next){
    
    if (req.session.usuarioLogeado.rol_id){
        
       if(req.session.usuarioLogeado.rol_id != 2)
       {
           return res.redirect('/');
       } 
}
    next(); //si tiene admin va por aca
}
module.exports = adminMiddleware;