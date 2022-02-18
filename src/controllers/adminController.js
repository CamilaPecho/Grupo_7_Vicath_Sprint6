const db = require('../../src/database/models');
const { Op } = require("sequelize");

const adminController = {
    eliminarUsuario: (req,res) =>{
    db.user.destroy({
        where: {
            id: req.params.id
        },
        force: true
    })
    .then(function(usuario)
    {
        return res.redirect("/admin/users")
    })
    .catch(function(error)
    {
        console.log(error)
    })
    },

    listarUsuarios: (req,res) =>
    {
        db.user.findAll(
            {
                include: [{association: "rol"}]
            }
        )
        .then(function(usuarios)
        {
            
            return res.render("./users/listUsers", {usuarios})
        })
        .catch(function()
        {
            console.log("no sirve pa")
        })

    }
}

module.exports = adminController;