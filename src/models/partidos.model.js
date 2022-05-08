const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PartidosSchema = Schema({
    nombre: {
        type: String,
      },
      teamOne:{
        type: String,
    },
    goalsTeamOne:Number,
      teamTwo:{
        type: String,
    },
    goalsTeamTwo:Number,
    });

module.exports = mongoose.model('partido', PartidosSchema)