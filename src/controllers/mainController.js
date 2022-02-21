const db = require('../../src/database/models');
const { Op } = require("sequelize");
const moment = require("moment")

//console.log(moment().subtract(7, 'days').toDate())
const mainController = {
    home:(req,res)=>{
        
        //Capturando catagorias

        //Destacandos funciona o captura a aquellos productos que
        //tienen un stock mayor a 30 y descuento mayor a 40
        let destacados = db.product.findAll({
            where: {
                [Op.and]: [
                    {
                        stock: {
                            [Op.gte]: 30
                        }
                    },
                    {
                        discount: {
                            [Op.gte]: 40
                        }
                    },
                    {
                        deleted:0
                    }
                ]
            },
            include: [
                {association: "images"}
            ]
        })
        
        let ofertas = db.product.findAll({
            where: {
                [Op.and]: [
                {
                    discount: {[Op.gte] : 30}
                },
                {
                    deleted: 0
                }
                ]
            },
            include: [
                {association: "images"}
            ]
        })

        let novedades = db.product.findAll({
            where: {
                //Por si te preguntas, lo que hace es a la fecha actual le resta 15
                //dias y compara con la fecha que esta en el registro, si esa
                //fecha que esta en el registro es mayor a la diferencia que 
                //hicimos al principio significa que aún es una novedad.
                //Si fuese menor significa que ya pasó de moda y ya no estaria en 
                //novedades.

                //Obviamente si creas productos en el mismo instante o dia, todas te van
                //a aparecer como novedades
                createdAt: {[Op.gte]: moment().subtract(15, 'days').toDate()},
                deleted: 0
            },
            include: [
                {association: "images"}
            ]
        })

        let marcas = db.brand.findAll()

        let colores = db.color.findAll()
        //////

        Promise.all([destacados,ofertas,novedades,marcas,colores])
        .then(function([destacados,ofertas,novedades,marcas,colores])
        {
           
            return res.render("home", {destacados, ofertas, novedades, marcas, colores})
        })
        .catch(err => {
            console.log(err)
        })
    },
}

module.exports = mainController;