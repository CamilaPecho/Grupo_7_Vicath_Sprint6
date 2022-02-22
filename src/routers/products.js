const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const imagesProduct = require('../middlewares/imagesProduct.js');
const guestMiddleware = require('../middlewares/guestMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')

router.get('/all', productController.all);

router.get('/cart', productController.cart);

router.get('/productDetail/:id', productController.productDetail)

router.get('/categorias/:categoria',productController.category)

router.get('/novedades',productController.news)

router.get('/busqueda',productController.search)

router.get('/filtrado',productController.filter)

//Para agregar un producto
router.get('/create', authMiddleware, adminMiddleware, productController.viewProductAdd); //para devolver la vista formulario
router.post('/create', imagesProduct.array('image'), productController.productAdd);

router.get("/edit/:id", authMiddleware, adminMiddleware, productController.viewProductEdit);
router.put("/edit/:id",imagesProduct.array('image'), productController.productEdit);
//Para listar productos tabla admin 📖
router.get('/viewProducts', authMiddleware, adminMiddleware, productController.viewProducts);

router.get("/viewproductDetail/:id", authMiddleware, adminMiddleware, productController.productDetailAdmin);

router.delete('/delete/:id', productController.productDelete)

module.exports = router;