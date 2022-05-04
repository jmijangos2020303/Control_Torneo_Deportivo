const mongoose = require("mongoose");
const app = require("./app")
const usuarioController = require("./src/controller/usuario.controller")


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TorneoDeportivo', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    usuarioController.mainStart();    
console.log("Se encuentra conectado a la base de datos.");


    app.listen(3000, function () {
        console.log("Hola PROFE, esta corriendo en el puerto 3000!")
    })
}).catch(err => console.log(err));

