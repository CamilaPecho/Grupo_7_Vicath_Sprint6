const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const db = require("../database/models");
const { Op } = require("sequelize");

const productController = {

    all:(req,res)=>{
        let productos=db.product.findAll({
            include: [{association: "images"}]
        })

        let categories =  db.category.findAll();

        Promise.all([productos,categories])
        .then(function([productos,categories]){
            res.render("./products/results",{productos, categories})
        })
        .catch(function(error)
        {
            console.log(error)
        })
    },

    search:(req,res)=>{
        let productos;

        if(req.query.category == "")
        {productos = db.product.findAll({
            where: {
                
                [Op.and]: [
                    {
                        name: {[Op.like]: req.query.busqueda + "%"}
                    },
                    {
                        deleted: 0
                    }
                ]
            },
            include: [{association: "images"}],
            limit: 6,
            offset: (req.query.pagina ? (req.query.pagina-1)*6 : 0)
        })}
        else{
            productos = db.product.findAll({
                where: {
                    
                    [Op.and]: [
                        {
                            name: {[Op.like]: req.query.busqueda + "%"}
                        },
                        {
                            deleted: 0
                        },
                        {
                            category_id: req.query.category
                        }
                    ]
                },
                include: [{association: "images"}],
                limit: 6,
                offset: (req.query.pagina ? (req.query.pagina-1)*6 : 0)
            })
        }
        let cantidadTotal = db.product.findAll({
            where: {
                [Op.and]: [
                    {
                        name: {[Op.like]: req.query.busqueda + "%"}
                    },
                    {
                        deleted: 0
                    }
                ]
            },
            include: [{association: "images"}],
        })
        let categories =  db.category.findAll();

        Promise.all([productos, cantidadTotal, categories])
        .then(function([productos, cantidadTotal, categories])
        {
            return res.render("./products/results", {productos, cantidadTotal, categories})
        })
        .catch(error => {
            console.log(error)
        })
    },

    filter:(req,res)=>{
        let productos = db.product.findAll({
            include: [{association: "images"},
            {
                association: "brand", 
                where: {
                    [Op.and]: [
                        {
                            name: {[Op.like]: req.query.marcas}
                        }
                    ]
                    },
                required: false
            }, 
            {
                association: "color",
                where: {
                    [Op.and]: [
                        {
                            name: {[Op.like]: req.query.colores}
                        }
                    ]
                },
                required: false
            }
                    ],
            where: {
                [Op.and]: [
                    {
                        price: {[Op.gte]: req.query.precio}
                    }
                ]
            },
            where:{
                deleted: 0
            }
        })

        let categories =  db.category.findAll();

        Promise.all([productos,categories])

        .then(function([productos,categories])
        {
            //Creo que no se puede redireccionar al home. Si queremos hacer ese efecto
            //dinamica hace falta ver React, no se :V
            return res.render("./products/results", {productos,categories})
        })
        .catch(error => {
            console.log(error)
        })
    },

    news: (req, res)=>{
        let productos = db.product.findAll({
            where: {
                //Lo que hace es a la fecha actual le resta 15
                //dias y compara con la fecha que esta en el registro, significa que aún es una novedad.
                createdAt: {[Op.gte]: moment().subtract(15, 'days').toDate()} 
            },
            include: [
                {association: "images"}
            ]
        })

        let categories =  db.category.findAll();

        Promise.all([productos,categories])
        .then(function([productos,categories])
        {
            return res.render("./products/results", {productos,categories})
        })
        .catch(err => {
            console.log(err)
        })
    },

    category:(req,res)=>{
        
        let productos = db.product.findAll({
            include: [{association: "images"},{association: "category"}]
        })

        let categories =  db.category.findAll();

        Promise.all([productos,categories])
        .then(function([respuesta, categories])
        {
            let productos = respuesta.filter(function(one)
            {
                return one.category.name == req.params.categoria
            }
            )
           
            return res.render("./products/results",{productos, categories})
        })
        .catch(err => {
            console.log(err)
        })
    },

    cart: (req,res) =>{
        res.render("./products/cart");
    },

    productDetail:(req, res)=>{
        let detailProd = db.product.findByPk(req.params.id,
         {
             include: [{association: "images"}]
         })
        
        let categories =  db.category.findAll();

        Promise.all([detailProd,categories])
        .then(function([detailProd, categories])
        {
         return res.render("./products/productDetail", {detailProd, categories})
        })
        .catch(function(error)
        {
            console.log(error)
        })
         
     },

     viewProducts:(req,res) =>{
        db.product.findAll({
            include: [
                {association: "category"}
            ],
            where:{
                deleted:0
            }
        })
        .then( products => 
            res.render("./products/listProducts",{products})
        )
    },

    viewProductAdd: (req,res) =>{
        let categories =  db.category.findAll();
        let brands = db.brand.findAll();
        let colors = db.color.findAll();

        Promise.all([categories,brands,colors])
        .then(function([categories,brands,colors])
        {
            res.render('./products/productAdd', {brands,categories,colors})           
        })
        .catch(err => {
             res.send(error)
        })

    },

    productAdd: (req,res) =>{
        let images= []
        if(req.files.length>4)
        {
            let categories =  db.category.findAll();
        let brands = db.brand.findAll();
        let colors = db.color.findAll();

        Promise.all([categories,brands,colors])
        .then(function([categories,brands,colors])
            {
                return res.render('./products/productAdd',{errors: {
                    avatar: { msg:"Amigo, te dije que eran 4 imágenes D:" }}
                , idUsuario: req.params.id, categories,brands,colors})
            })
            
        }
        else
        {
            if(req.files != undefined){
                for(let i = 0 ; i<req.files.length;i++){
                    images.push(req.files[i].filename)
                }
            }
    
            db.product.create({
                name:req.body.name,
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
                
                if ( images.length != 0){
                    for(let i = 0 ; i<images.length;i++){
                        db.image.create({
                            name: images[i],
                            product_id: product.id
                        })
                    }
                }else{
                db.image.create({
                        name: "default.jpg",
                        product_id: product.id
                    })
                }
    
                res.redirect('/products/viewProducts')
            })
            .catch(error => res.send(error))
        }
       
    },

    viewProductEdit:(req,res)=>{
        let product = db.product.findByPk(req.params.id);
        let categories =  db.category.findAll();
        let brands = db.brand.findAll();
        let colors = db.color.findAll();

        Promise.all([product,categories,brands,colors])
        .then(function([producto,categories,brands,colors])
        {
            res.render('./products/productEdit', {producto,brands,categories,colors})
        })
        .catch(err => {
             res.send(error)
        })
                        
    },
    
    productEdit:(req,res)=>{
        let images= []

        if(req.files != undefined){
            for(let i = 0 ; i<req.files.length;i++){
                images.push(req.files[i].filename)
            }
        }

        db.product.update({
            name:req.body.name,
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
            if ( images.length != 0){

                db.image.destroy(
                    {
                        where: { product_id: req.params.id },
                        force: true
                    })

                for(let i = 0 ; i<images.length;i++){
                    db.image.create(
                    {
                        name: images[i],
                        product_id: req.params.id
                    })
                }
            }
            res.redirect('/products/viewProducts')
        })
        .catch(error => res.send(error))
    },

    productDetailAdmin:(req, res)=>{
        db.product.findByPk(req.params.id,
         {
             include: [{association: "images"},{association: "brand"},{association: "category"},{association: "color"}]
         })
        .then(function(producto)
            {
                return res.render("./products/productDetailAdmin", {producto})
            })
        .catch(function(error)
        {
            console.log(error)
        })
         
     },
    
    productDelete:(req,res)=>{
        db.product.update({
            deleted: 1,
        },
        {
            where: {id:req.params.id}
        })
        .then( () => {
            res.redirect('/products/viewProducts')
        })
    }

}

module.exports = productController;