const express = require("express");
const userController = require("../controllers/usersController");
const router = express.Router();
const validacionesLogin = require('../middlewares/validateLoginMiddleware.js');
const validacionesRegister = require('../middlewares/validationsRegister.js');
const validacionesEdit = require('../middlewares/validationsEditUser.js');
const validacionesEmailAndPass = require('../middlewares/validationsEmailAndPass.js')
const avatarProfile = require('../middlewares/imageRegister.js');
const guestMiddleware = require('../middlewares/guestMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')

router.get('/login', guestMiddleware, userController.viewLogin);
router.post('/login', validacionesLogin, userController.login)

router.get('/register', guestMiddleware, userController.viewRegister);
router.post('/register',avatarProfile.single('avatar'),validacionesRegister, userController.register);

router.get('/profile', authMiddleware, userController.verPerfil)
router.get('/profileAdmin', authMiddleware, adminMiddleware, userController.verPerfilAdmin)

router.get("/edit/:id", authMiddleware, userController.editVista)
router.put("/edit/:id", avatarProfile.single('avatar'), validacionesEdit, userController.edit)

router.get("/changeEmailAndPass/:id", authMiddleware, userController.editEmailAndPass)
router.put("/changeEmailAndPass/:id", validacionesEmailAndPass, userController.editEmailAndPassPUT)

router.get('/homeAdmin', authMiddleware, adminMiddleware, userController.homeAdmin)
router.get('/modocliente', authMiddleware, adminMiddleware, userController.modoCliente)
router.get('/logout', userController.logout)


module.exports = router;