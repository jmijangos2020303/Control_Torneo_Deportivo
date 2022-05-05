const mongoose = require("mongoose"); 
var Schema = mongoose.Schema;

var LigaSchema = Schema({
    nombreL: String,
    image: String,
    equipos: [
        {type: Schema.Types.String, ref: 'equipo'}
    ],
    partido: [{type: mongoose.ObjectId, ref: 'partido'}],
    creador: {type:Schema.Types.String, ref: 'usuario'}
});
 
module.exports = mongoose.model('liga', LigaSchema);