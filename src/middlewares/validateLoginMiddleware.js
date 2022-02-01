const {body} = require('express-validator');

const errors = [
    body('usuario').notEmpty().withMessage("El usuario no puede quedar vacio").bail().isEmail().withMessage("Debe ser un e-mail válido"),
    body('contrasenia').notEmpty().withMessage("La contraseña no puede quedar vacia")
]

module.exports = errors;