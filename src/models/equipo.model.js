const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EquipoSchema = Schema({
    nombre: String,
    image: String,
});

module.exports = mongoose.model('equipo', EquipoSchema); 
