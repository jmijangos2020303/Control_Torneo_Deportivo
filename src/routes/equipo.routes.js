const express = require("express");
const equipoController = require('../controller/equipo.controller')

var api = express.Router();

api.post('/crearEquipo/:id', equipoController.createEquipo);
api.put('/:idG/updateTeam/:idt', equipoController.editarEquipo);
api.delete('/:idG/removeTeam/:idt', equipoController.eliminarEquipo);
api.get('/getTeams', equipoController.getTeams);

api.post('/createPartido/:id', equipoController.createPartido);
api.put('/:idT/finalizacionPartido/:idP', equipoController.finalizacionPartido);
api.get('/getPartidos', equipoController.getPartidos);
api.put('/:idT/SetGoals/:idP', equipoController.SetGoals);

module.exports = api;