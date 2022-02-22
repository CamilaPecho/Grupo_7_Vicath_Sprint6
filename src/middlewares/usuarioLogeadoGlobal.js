//traemos el modelo para extraer datos a partir de la cookie :p
const db = require('../database/models')
const { Op } = require("sequelize");

function usuarioLogeadoGlobal(req, res, next)
{
    
    let usuarioCookie = req.cookies.mailCookie;
    res.locals.usuarioHeader = false; 
    res.locals.usuarioHeaderAdmin = false; 

    console.log("esto si?")
    db.user.findOne({
        where: {
            email: {[Op.like]: usuarioCookie}
        }
    })
    .then(function(usuarioEncontrado)
    {
        delete usuarioEncontrado.contrasenia;
        req.session.usuarioLogeado = usuarioEncontrado;
    })
    .catch(err =>{
        console.log("se rompio pa")
    })

    console.log("codigo procedural")
    if(req.session && req.session.usuarioLogeado)
    {
        
        res.locals.usuarioHeader = true;
        res.locals.datosUsuarioGlobal = req.session.usuarioLogeado;
    }
    if(req.session && req.session.usuarioLogeado.rol_id == 2)
    {
        res.locals.usuarioHeaderAdmin = true; 
    }

    next(); //va por fuera de todo porque imaginate la primera vez..., no entra en ningún if 
}

module.exports = usuarioLogeadoGlobal; //si no lo exportamos no podremos activarlo como middleware global desde el entrypoint