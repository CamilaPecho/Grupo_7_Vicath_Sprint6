const mainController = {
    home: (req,res) =>{
        res.render("home", {destacados, ofertas, novedades})
    },
}

module.exports = mainController;