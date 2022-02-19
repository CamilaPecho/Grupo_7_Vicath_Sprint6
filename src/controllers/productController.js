const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const db = require("../database/models");
const { Op } = require("sequelize");
const brand = require("../database/models/brand");
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
        let productos = db.product.findAll({
            where: {
                name: {[Op.like]: req.query.busqueda + "%"}
            },
            include: [{association: "images"}],
            limit: 6,
            offset: (req.query.pagina ? (req.query.pagina-1)*6 : 0)
        })
        let cantidadTotal = db.product.findAll({
            where: {
                name: {[Op.like]: req.query.busqueda + "%"}
            },
            include: [{association: "images"}],
        })

        Promise.all([productos, cantidadTotal])
        .then(function([productos, cantidadTotal])
        {
          
            return res.render("./products/results", {productos, cantidadTotal})
        })
        .catch(error => {
            console.log(error)
        })
    },

    filter:(req,res)=>{
        console.log("-----------------------------------------------")
        db.product.findAll({
            include: [{association: "images"},
            {
                association: "brand", 
                where: {
                    name: {[Op.like]: req.query.marcas}
                    },
                required: false
            }, 
            {
                association: "color",
                where: {
                    name: {[Op.like]: req.query.colores}
                },
                required: false
            }
                    ],
            where: {
                price: {[Op.gte]: req.query.precio}
            }
        })
        .then(function(productos)
        {
            //Creo que no se puede redireccionar al home. Si queremos hacer ese efecto
            //dinamica hace falta ver React, no se :V
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
        db.Category.findAll()
            .then( categories => {
                db.Brand.findAll()
                .then( brands => {
                    db.Color.findAll()
                    .then( colors => {
                        res.render('./products/productAdd', {brands,categories,colors})
                    })
                    .catch(error => res.send(error))
                })
                .catch(error => res.send(error))
            })
            .catch(error => res.send(error))
    },

    productAdd: (req,res) =>{
        let imagenes= []

        if(req.files != undefined){
            for(let i = 0 ; i<req.files.length;i++){
                imagenes.push(req.files[i].filename)
            }
        }

        db.Product.create({
            title:req.body.title.toUpperCase(),
            price:req.body.price,
            description: req.body.description,
            stock:req.body.stock,
            stock_min: req.body.stock_min,
            stock_max: req.body.stock_max,
            extended_description: req.body.extended_description,
            price: Number(req.body.price),
            discount:Number(req.body.discount),
            category_id: req.body.category,
            brand_id: req.body.brand,
            color_id: req.body.color,
            deleted: 0,
        })
        .then( product =>{
            for(let i = 0 ; i<imagenes.length;i++){
                db.Image.Create({
                    name: imagenes[i],
                    product_id: product.Id
                })
                .then( () => {
                    res.redirect('/products/viewProducts')
                })
                .catch(error => res.send(error))
            }
        })
        .catch(error => res.send(error))
    },

    viewProductEdit:(req,res)=>{
        db.Product.findByPk(req.params.id)
        .then( product => {
            db.Category.findAll()
                .then( categories => {
                    db.Brand.findAll()
                    .then( brands => {
                        db.Color.findAll()
                        .then( colors => {
                            res.render('./products/productEdit', {product,brands,categories,colors})
                        })
                        .catch(error => res.send(error))
                    })
                    .catch(error => res.send(error))
                })
                .catch(error => res.send(error))
        })
        .catch(error => res.send(error))
    },
    
    productEdit:(req,res)=>{
        let imagenes= []

        if(req.files != undefined){
            for(let i = 0 ; i<req.files.length;i++){
                imagenes.push(req.files[i].filename)
            }
        }

        db.Product.update({
            title:req.body.title.toUpperCase(),
            price:req.body.price,
            description: req.body.description,
            stock:req.body.stock,
            stock_min: req.body.stock_min,
            stock_max: req.body.stock_max,
            extended_description: req.body.extended_description,
            price: Number(req.body.price),
            discount:Number(req.body.discount),
            category_id: req.body.category,
            brand_id: req.body.brand,
            color_id: req.body.color,
            deleted: 0,
        },
        {
            where: {id:req.params.id}
        })
        .then( product =>{
            for(let i = 0 ; i<imagenes.length;i++){
                db.Image.Create({
                    name: imagenes[i],
                    product_id: product.Id
                })
                .then( () => {
                    res.redirect('/products/viewProducts')
                })
                .catch(error => res.send(error))
            }
        })
        .catch(error => res.send(error))
    },

    productDelete:(req,res)=>{
        res.redirect("/products/viewProducts")
    }

}

module.exports = productController;