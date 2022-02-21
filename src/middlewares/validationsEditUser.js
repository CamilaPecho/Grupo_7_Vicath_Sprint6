const {body, param} = require('express-validator');
const { patch } = require('../routers/users');
const path = require('path');

const errors = [
    body('nombre').notEmpty().withMessage("Debe ingresar un nombre"),
    body('apellido').notEmpty().withMessage("Debe ingresar un apellido"),
    body('avatar').custom((value,{req}) => {if(req.file){
        let extensions = ['.jpg' , '.png']
        let fileExtension = path.extname(req.file.originalname)
        if(!extensions.includes(fileExtension)){
            throw new Error("Debe ingresar una imagen (.png o .jpg)")
        }else{
            return true
        }
    }
    else{
        return true
}}),
    body('telefono').custom(value => {if(isNaN(value)){
        throw new Error("Debe ser un numero de telefono válido ")
    }else{
        return true;
    }})
    
]

module.exports = errors;