const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
const guestMiddleware = require('../middlewares/guestMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')

router.get("/users", authMiddleware, adminMiddleware, adminController.listarUsuarios);
router.delete("/users/delete/:id", adminController.eliminarUsuario);

module.exports = router;