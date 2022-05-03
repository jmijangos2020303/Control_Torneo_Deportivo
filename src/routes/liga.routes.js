var express = require('express');
var ligaController = require('../controller/liga.controller');
var autentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/crearLiga', autentication.ensureAuth, ligaController.createLiga);
api.get('/mostrarLigas', ligaController.mostrarLigas);
api.get('/ligasUser/:nombre', autentication.ensureAuth, ligaController.ligasForUser)
api.get('/misLigas', autentication.ensureAuth, ligaController.misLigas)
api.get('/mostrarLigaID/:idLiga', ligaController.mostrarLigaID);
api.get('/equiposLiga/:idLiga', ligaController.equiposLiga)
api.get('/tablaLiga/:idLiga', ligaController.tablaLiga)
api.put('/editarLiga/:idLiga', ligaController.editarLiga);
api.delete('/eliminarLiga/:idLiga', ligaController.eliminarLiga);
//Reportes
api.get('/reporteEquiposLiga/:idLiga', ligaController.generarPDF)
api.get('/reporteTablaLiga/:idLiga', ligaController.generadorTablaLiga)


module.exports = api;