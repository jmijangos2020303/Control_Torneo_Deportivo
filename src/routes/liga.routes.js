var express = require('express');
var ligaController = require('../controller/liga.controller');
var autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/crearLiga/:id', autentication.ensureAuth, ligaController.createTorneo);
api.put('/setTorneo/:id', autentication.ensureAuth, ligaController.setTorneo);
api.put('/:idU/updateTorneo/:idT', autentication.ensureAuth, ligaController.updateTorneo);
api.delete('/:idU/removeTorneo/:idT', autentication.ensureAuth, ligaController.removeTorneo);
api.get('/getTorneo', autentication.ensureAuth, ligaController.getTorneo);
api.get('/reporteEquiposLiga/:idLiga', ligaController.generarPDF)



module.exports = api;