const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    rol: String,
    liga: [
        {type: mongoose.ObjectId, ref: 'liga'},
    ],
}, {collection: 'usuario'})

module.exports = mongoose.model('usuario', UsuarioSchema);