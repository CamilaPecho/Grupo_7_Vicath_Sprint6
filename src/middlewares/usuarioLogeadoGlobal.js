//traemos el modelo para extraer datos a partir de la cookie :p
const usuarios = require('../model/jsonDatabase.js')
const UserBD = usuarios('users')
function usuarioLogeadoGlobal(req, res, next)
{
    let usuarioCookie = req.cookies.mailCookie;
    let usuarioEncontrado = UserBD.buscardorPorCategoriaIndividual('mail', usuarioCookie)
    res.locals.usuarioHeader = false; //para eliminar el desplegable de registrarse y logearse si ya esta en sesión

    if(usuarioEncontrado)
    {
        delete usuarioEncontrado.contrasenia;
        req.session.usuarioLogeado = usuarioEncontrado;
    }

    if(req.session && req.session.usuarioLogeado)
    {
        res.locals.usuarioHeader = true;
        res.locals.datosUsuarioGlobal = req.session.usuarioLogeado;
    }

    next(); //va por fuera de todo porque imaginate la primera vez..., no entra en ningún if 
}

module.exports = usuarioLogeadoGlobal; //si no lo exportamos no podremos activarlo como middleware global desde el entrypoint