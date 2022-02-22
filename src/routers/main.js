const express = require("express");
const mainController = require("../controllers/mainController");
const router = express.Router();
const guestMiddleware = require('../middlewares/guestMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')

router.get("/", mainController.home);

module.exports = router;