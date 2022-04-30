const mongoose = require("mongoose"); 
var Schema = mongoose.Schema;

var LigaSchema = Schema({
    nombreL: String,
    image: String,
    creador: {type:Schema.Types.String, ref: 'usuario'}
});
 
module.exports = mongoose.model('liga', LigaSchema);