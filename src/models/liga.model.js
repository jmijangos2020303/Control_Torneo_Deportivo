const mongoose = require("mongoose"); 
var Schema = mongoose.Schema;

var LigaSchema = Schema({
    nombreL: String,
    image: String,
    team: [{type: mongoose.ObjectId, ref: 'team'}],
    partido: [{type: mongoose.ObjectId, ref: 'partido'}],
    creador: {type:Schema.Types.String, ref: 'usuario'}
});
 
module.exports = mongoose.model('liga', LigaSchema);