const express = require("express");
const equipoController = require('../controller/equipo.controller')
var  mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/crearEquipo/:id', mdAuth.ensureAuth, equipoController.createEquipo);
api.put('/:idG/updateTeam/:idt', mdAuth.ensureAuth, equipoController.editarEquipo);
api.delete('/:idG/removeTeam/:idt', mdAuth.ensureAuth, equipoController.eliminarEquipo);
api.get('/getTeams', mdAuth.ensureAuth, equipoController.getTeams);

api.post('/createPartido/:id', mdAuth.ensureAuth, equipoController.createPartido);
api.put('/:idT/finalizacionPartido/:idP', mdAuth.ensureAuth, equipoController.finalizacionPartido);
api.get('/getPartidos', mdAuth.ensureAuth, equipoController.getPartidos);
api.put('/:idT/SetGoals/:idP', mdAuth.ensureAuth, equipoController.SetGoals);

module.exports = api;