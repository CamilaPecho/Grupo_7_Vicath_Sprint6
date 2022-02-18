const db = require('../../src/database/models');
const { Op } = require("sequelize");
const moment = require("moment")
const productController = {

    all:(req,res)=>{
        db.product.findAll({
            include: [{association: "images"}]
        })
        .then(productos => {
            //return res.send(productos[0].images)
            res.render("./products/results",{productos})
        })
        .catch(function(error)
        {
            console.log(error)
        })
    },

    search:(req,res)=>{
        db.product.findAll({
            where: {
                name: {[Op.like]: req.query.busqueda + "%"}
            },
            include: [{association: "images"}]
        })
        .then(function(productos)
        {
          
            return res.render("./products/results", {productos})
        })
        .catch(error => {
            console.log(error)
        })
    },

    novedades: (req, res)=>{
        db.product.findAll({
            where: {
                //Por si te preguntas, lo que hace es a la fecha actual le resta 15
                //dias y compara con la fecha que esta en el registro, si esa
                //fecha que esta en el registro es mayor a la diferencia que 
                //hicimos al principio significa que aún es una novedad.
                //Si fuese menor significa que ya pasó de moda y ya no estaria en 
                //novedades.

                //Obviamente si creas productos en el mismo instante o dia, todas te van
                //a aparecer como novedades
                createdAt: {[Op.gte]: moment().subtract(15, 'days').toDate()} 
            },
            include: [
                {association: "images"}
            ]
        })
        .then(function(productos)
        {
            return res.render("./products/results", {productos})
        })
        .catch(err => {
            console.log(err)
        })
    },

    category:(req,res)=>{
        
        db.product.findAll({
            include: [{association: "images"},{association: "category"}]
        })

        .then(function(respuesta)
        {
            let productos = respuesta.filter(function(one)
            {
                
                return one.category.name == req.params.categoria
            }
            )
           
            return res.render("./products/results",{productos})
        })
        .catch(err => {
            console.log(err)
        })
    },

    cart: (req,res) =>{
        res.render("./products/cart");
    },

    productDetail:(req, res)=>{
       db.product.findByPk(req.params.id,
        {
            include: [{association: "images"}]
        })
       .then(function(detailProd)
       {
        return res.render("./products/productDetail", {detailProd})
       })
       .catch(function(error)
       {
           console.log(error)
       })
        
    },

    viewProducts:(req,res) =>{
       
        res.render("./products/listProducts",{products})
    },

    viewProductAdd: (req,res) =>{
        res.render("./products/productAdd")
    },

    productAdd: (req,res) =>{
        res.redirect("/products/viewProducts")
    },

    viewProductEdit:(req,res)=>{
        
        res.render("./products/productEdit",{product})
    },
    
    productEdit:(req,res)=>{
        res.redirect("/products/viewProducts")
    },

    productDelete:(req,res)=>{
        res.redirect("/products/viewProducts")
    }

}

module.exports = productController;
