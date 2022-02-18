const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.get("/users", adminController.listarUsuarios);
router.delete("/users/delete/:id", adminController.eliminarUsuario);

module.exports = router;