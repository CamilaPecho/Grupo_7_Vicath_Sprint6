const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const db = require("../database/models");
const brand = require("../database/models/brand");
const productController = {

    all:(req,res)=>{
        db.Product.findAll()
            .then(productos => {
                res.render('./products/results' ,{products})
            })
            .catch(error => res.send(error))
    },

    search:(req,res)=>{
        res.render("./products/results",{products})
    },

    category:(req,res)=>{
        
        res.render("./products/results",{products})
    },

    cart: (req,res) =>{
        res.render("./products/cart");
    },

    productDetail:(req, res)=>{
       
        res.render("./products/productDetail", {detailProd: product})
    },

    viewProducts:(req,res) =>{
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
