const db = require('../../src/database/models');
const { Op } = require("sequelize");
const moment = require("moment")
const {validationResult} = require('express-validator');
const bcript = require('bcryptjs');

const userController = {
    viewLogin: (req,res) =>{
        db.category.findAll()
        .then(categories => {
            res.render('./users/login', {categories})
        })
        .catch(err =>
            {
                console.log("-----------------------------")
                console.log(err)
            })
        
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
            let contraseniaOk = bcript.compareSync(req.body.contrasenia, usuarioEncontrado.password);
            if(contraseniaOk)
            {
                delete usuarioEncontrado.password;
                req.session.usuarioLogeado = usuarioEncontrado;
                
                //aca vemos si esta activo el checkbox de recordame, y si lo esta despierto mi cookie
                if(req.body.recordarme)
                {
                    res.cookie("mailCookie", req.body.usuario, { maxAge: (1000 * 60) * 60 }) 
                    //guardamos sólo el mail porque con eso es suficiente pa buscar en la BD, 
                    //además la cookie de este estilo tiene un limite de 4kb y hay q ser los más optimos posibles
                }
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
        db.category.findAll()
        .then(categories => {
            res.render('./users/register', {categories})
        })
        .catch(err =>
            {
                console.log("-----------------------------")
                console.log(err)
            })
        
    },

    register:(req,res)=>{

        const resultadosValidaciones = validationResult(req);
        let contraseñaEncriptada;        
        if(!resultadosValidaciones.isEmpty())
        {
            return res.render('./users/register', {errors: resultadosValidaciones.mapped(), usuarioDatos: req.body})
        }

        db.user.findOne({
            where: {
                email: {[Op.like]: req.body.email}
            }
        })
        .then(user =>{
            if(user != null){
                return res.render('./users/register',{errors: {
                    email: { msg:"Este mail ya esta registrado" }}, usuarioDatos: req.body})
                }
            else{
                if(req.body.contrasenia == req.body.contrasenia2 ){
                    contraseñaEncriptada = bcript.hashSync(req.body.contrasenia,12) 
                }else{
                    return res.render('./users/register',{errors: {
                        contrasenia: {
                            msg:"Las contraseñas no coinciden"
                        }
                    },usuarioDatos: req.body})
                }
            
                db.user.create({
                    avatar: req.file? req.file.filename: "default.jpg",
                    first_name: req.body.nombre,
                    last_name: req.body.apellido,
                    phone_number: req.body.telefono,
                    email: req.body.email,
                    password: contraseñaEncriptada,
                    rol_id:1
                })
                .then(res.redirect("/login"))
                .catch(error => res.send (error))
                }
            })
        },

    verPerfil:(req,res)=>{
        let categories = db.category.findAll()
        
        if(req.session.usuarioLogeado.rol_id == 2)
        {
            return res.redirect('/homeAdmin');
        }else{
            Promise.all([categories])
            .then(function(categories)
            {
                res.render('./users/perfil', {usuarioDatos: req.session.usuarioLogeado, categories}); 
            })
            
        }
    },

    editVista: (req,res)=>{
        db.category.findAll()
        .then(function(categories)
        {
            return res.render('./users/editPerfil', {usuarioDatos: req.session.usuarioLogeado, categories})
        })
        
    },

    editEmailAndPass: (req,res)=>{
        db.category.findAll()
        .then(function(categories)
        {
            let idUsuario = req.params.id
            return res.render('./users/editMailAndPass', {idUsuario, categories})
        })
        
    },

    editEmailAndPassPUT: (req,res)=>
    {
        const resultadosValidaciones = validationResult(req);
                
        if(!resultadosValidaciones.isEmpty())
        {
            return res.render('./users/editMailAndPass', {errors: resultadosValidaciones.mapped(), idUsuario: req.params.id})
        }
        
        
        db.user.findOne({
            where: {
                email: {[Op.like]: req.body.email}
            }
        })
        .then(function(resultado)
        {
            if(resultado)
            {
                //return res.send("lo encontre")
                return res.render('./users/editMailAndPass',{errors: {
                    email: { msg:"Este mail ya esta registrado o fue su anterior mail" }}
                , idUsuario: req.params.id})
            }
            else{
                //return res.send("no lo encontre")
                if(req.body.contrasenia == req.body.contrasenia2 ){
                    //contraseniaEncriptada = bcript.hashSync(req.body.contrasenia,12) 
                }else{
                    return res.render('./users/editMailAndPass',{errors: {
                        contrasenia: {
                            msg:"Las contraseñas no coinciden"
                        }
                    }, idUsuario: req.params.id})
                }
    
                //Acá viene el update
                db.user.update({
                    email: req.body.email,
                    password: req.body.contrasenia
                }, {
                    where: {id: req.params.id}
                })
                .then(function(respuestaUpdate)
                {
                    db.user.findOne({
                        where: {
                            email: {[Op.like]: req.body.email}
                        }
                    })
                    .then(function(usuarioEncontrado)
                    {
                        delete usuarioEncontrado.contrasenia;
                        req.session.usuarioLogeado = usuarioEncontrado;
                       
                        return res.redirect("/profile")
                    })
                    .catch(error =>{
                        res.send (error)
                    })
                })
                .catch(error => res.send (error))
            }
        })
    },

    edit: (req,res)=>{
        const resultadosValidaciones = validationResult(req);
                
        if(!resultadosValidaciones.isEmpty())
        {
            return res.render('./users/editPerfil', {errors: resultadosValidaciones.mapped(), usuarioDatos: req.session.usuarioLogeado})
        }
        else{
            db.user.update({
                first_name: req.body.nombre,
                last_name: req.body.apellido,
                avatar: (req.file)?req.file.filename:req.session.usuarioLogeado.avatar,
                phone_number: req.body.telefono,
                rol_id:1
            }, {
                where: {id: req.params.id}
            })
            .then(function(respuestaUpdate)
            {
                
                //Forzamos a actualizar el session para ver los datos en tiempo real
                //req.session.usuarioLogeado.first_name = req.body.nombre
                //req.session.usuarioLogeado.last_name = req.body.apellido
                //req.session.usuarioLogeado.phone_number = req.body.telefono
                //req.session.usuarioLogeado.avatar = req.file.filename

                //
                db.user.findOne({
                    where: {
                        email: {[Op.like]: req.session.usuarioLogeado.email}
                    }
                })
                .then(function(usuarioEncontrado)
                {
                    delete usuarioEncontrado.contrasenia;
                    req.session.usuarioLogeado = usuarioEncontrado;
                    return res.redirect("/profile")
                })
                .catch(err =>{
                    console.log("se rompio pa")
                })
            })
            .catch(error => res.send (error))
        }
    },

    verPerfilAdmin: (req,res)=>{
        res.render('./users/perfilAdmin', {usuarioDatos: req.session.usuarioLogeado});  
    },

    homeAdmin: (req, res) => {
        res.render('./users/homeAdmin', {usuarioDatos: req.session.usuarioLogeado})
    },

    modoCliente: (req, res) => {
        let destacados = db.product.findAll({
            where: {
                [Op.and]: [
                    {
                        stock: {
                            [Op.gte]: 30
                        }
                    },
                    {
                        discount: {
                            [Op.gte]: 40
                        }
                    },
                    {
                        deleted:0
                    }
                ]
            },
            include: [
                {association: "images"}
            ]
        })
        
        let ofertas = db.product.findAll({
            where: {
                [Op.and]: [
                {
                    discount: {[Op.gte] : 30}
                },
                {
                    deleted: 0
                }
                ]
            },
            include: [
                {association: "images"}
            ]
        })

        let novedades = db.product.findAll({
            where: {
                createdAt: {[Op.gte]: moment().subtract(15, 'days').toDate()},
                deleted: 0
            },
            include: [
                {association: "images"}
            ]
        })

        let marcas = db.brand.findAll()

        let colores = db.color.findAll()

        let categories =  db.category.findAll();

        Promise.all([destacados,ofertas,novedades,marcas,colores, categories])
        .then(function([destacados,ofertas,novedades,marcas,colores, categories])
        {
            return res.render("home", {destacados, ofertas, novedades, marcas, colores, categories})
        })
        .catch(err => {
            console.log(err)
        })
    }
}

module.exports = userController;