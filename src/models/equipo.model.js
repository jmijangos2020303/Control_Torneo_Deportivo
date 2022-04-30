const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EquipoSchema = Schema({
    nombre: String,
    imagen: String,
    liga: {type: Schema.Types.String, ref: 'liga'}
});

module.exports = mongoose.model('equipo', EquipoSchema); 