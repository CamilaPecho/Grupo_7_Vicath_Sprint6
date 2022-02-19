const db = require('../../src/database/models');
const { Op } = require("sequelize");

const {validationResult} = require('express-validator');
const bcript = require('bcryptjs');

const userController = {
    viewLogin: (req,res) =>{
        res.render('./users/login')
    },

    login: (req,res) =>{
    
    const resultadosValidaciones = validationResult(req);
    
    if(!resultadosValidaciones.isEmpty())
    {
        return res.render('./users/login', {errors: resultadosValidaciones.mapped()})
    }
    
    //Ahora voy a validar si existe en la BD y tirar su respectivo error a la vista en caso de acierto
    db.user.findOne({
        where: {
            email: {[Op.like]: req.body.usuario}
        }
    })
    .then(function(usuarioEncontrado)
    {
//Ahora valido contraseñas, en caso de exito lo guardo en session
    
    //let contraseniaOk = bcript.compareSync(req.body.contrasenia, usuarioEncontrado.contraseña);
        if(req.body.contrasenia == usuarioEncontrado.password)
        {
            console.log("entre pa");
            delete usuarioEncontrado.password;
            req.session.usuarioLogeado = usuarioEncontrado;
            
            //aca vemos si esta activo el checkbox de recordame, y si lo esta despierto mi cookie
            if(req.body.recordarme)
            {
                res.cookie("mailCookie", req.body.usuario, { maxAge: (1000 * 60) * 60 }) 
                //guardamos sólo el mail porque con eso es suficiente pa buscar en la BD, 
                //además la cookie de este estilo tiene un limite de 4kb y hay q ser los más optimos posibles
            }
            console.log("entrando a perfil")
            
            return res.redirect('/profile')
        }
        else
        {
            return res.render('./users/login', {errors: {
                usuario: {
                    msg: "Credenciales invalidas!"
                }
            }, oldData: req.body})
        }
    })
    .catch(function(error)
    {
        return res.render('./users/login', {errors: {
            usuario: {
                msg: "No se encontró este usuario en nuestro sistema!"
            }
        }})
    })

    
    },
    
    logout: (req, res) =>{
        res.clearCookie('mailCookie');
        req.session.destroy();
        return res.redirect('/')
    },

    viewRegister:(req,res)=>{
        res.render('./users/register')
    },

    register:(req,res)=>{

        const resultadosValidaciones = validationResult(req);
                
            if(!resultadosValidaciones.isEmpty())
            {
                return res.render('./users/register', {errors: resultadosValidaciones.mapped(), datosViejos: req.body})
            }


        let usuarioEncontrado = users.buscardorPorCategoriaIndividual('mail', req.body.email)

        if(usuarioEncontrado){
            return res.render('./users/register',{errors: {
                email: {
                    msg:"Este mail ya esta registrado"
                }, datosViejos: req.body
            }})
        }

       
        let contraseñaEncriptada;

        if(req.body.contrasenia == req.body.contrasenia2 ){
            contraseñaEncriptada = bcript.hashSync(req.body.contrasenia,12) 
        }else{
            return res.render('./users/register',{errors: {
                contrasenia: {
                    msg:"Las contraseñas no coinciden"
                }, datosViejos: req.body
            }})
        }
        
        res.redirect("/login")
    },

    verPerfil:(req,res)=>{
    
       
    },

    verPerfilAdmin:(req,res)=>{
        
        res.render('./users/perfilAdmin', {usuarioDatos: req.session.usuarioLogeado});  
    },

    homeAdmin: (req, res) => {
        res.render('./users/homeAdmin', {usuarioDatos: req.session.usuarioLogeado})
    },

    modoCliente: (req, res) => {
        const destacados = productModel.buscardorPorCategoria("category", "destacados");
        const ofertas = productModel.buscardorPorCategoria("category", "ofertas");
        const novedades = productModel.buscardorPorCategoria("category", "novedades");
        
        
            res.render("home", {destacados, ofertas, novedades})
        
    }
}

module.exports = userController;