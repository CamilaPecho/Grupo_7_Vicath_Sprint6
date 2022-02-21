const {body, param} = require('express-validator');
const { patch } = require('../routers/users');
const path = require('path');

const errors = [
    body('email').notEmpty().withMessage("No debe estar vacio").bail().isEmail().withMessage("Debe ser un e-mail válido"),
    body('contrasenia').notEmpty().withMessage("La contraseña no puede quedar vacia"),
    body('contrasenia2').notEmpty().withMessage("Debe confirmar contraseña")
]

module.exports = errors;