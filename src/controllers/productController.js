const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const db = require("../database/models")
const productController = {

    all:(req,res)=>{
        db.rol.findAll().then(roles => {
            console.log(roles)
        })
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
