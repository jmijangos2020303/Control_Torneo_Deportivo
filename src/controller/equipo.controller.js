const Equipo = require('../models/equipo.model');
const Tabla = require('../models/tabla.model');
const LigaE = require("../models/liga.model");


//crear equipo
function createEquipo(req, res) {
    var torneoId = req.params.id;
    var equipo = new Equipo();
    var params = req.body;

    if(params.nombre){
        Equipo.findOne({nombre: params.nombre},(err, equipoFind) => {
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'});
                }else if(equipoFind){
                    return res.status(500).send({message: 'Nombre ya en uso!'});
            }else{
                LigaE.findById(torneoId, (err, ligaFind) => {
                    console.log(ligaFind)
                    if(err){
                        return res.status(500).send({message: 'Error generall'})
                    }else if(ligaFind){
                        equipo.nombre = params.nombre;
                        equipo.save((err, teamSaved)=>{

                            if(err){
                                return res.status(500).send({message: 'Error general al guardar'})
                            }else if(teamSaved){
                                LigaE.findByIdAndUpdate(torneoId, {$push:{equipos: params.nombre}}, {new: true}, (err, teamPush)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general'})
                                    }else if(teamPush){
                                        return res.send({message: 'Creada Exitosamente', teamPush});
                                    }else{
                                        return res.status(500).send({message: 'Error al crear el grupo'});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: 'No se creo el grupo'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'la liga al que deseas agregar el grupo no existe.'})
                     }
                 })   
            }
        })
    }else{
        return res.send({message: 'Por favor ingresa los datos obligatorios'});
    }

}

//mostrar equipos
async function mostrarEquipos(req, res) {
    await Equipo.find().populate('liga', 'nombre').exec((err, equipos) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!equipos) {
            return res.status(500).send({ mensaje: "No se han podido obtener los equipos" })
        } else {
            return res.status(200).send({ equipos })
        }
    })
}

//Función para obtener equipos por id
async function equipoId(req, res) {
    var idEquipo = req.params.idEquipo;

    await Equipo.findById(idEquipo).populate('liga', 'nombre').exec((err, equipo) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!equipo) {
            return res.status(500).send({ mensaje: "No se ha podido obtener el equipo" })
        } else {
            return res.status(200).send({ equipo })
        }
    })
}

async function equiposPorLiga(req, res) {
    await Equipo.find({ liga: req.params.idLiga })
        .then(doc => res.json(doc))
        .catch(err => console.error(err))
}

//Función para editar el equipo
async function editarEquipo(req, res) {
    var idEquipo = req.params.idEquipo;
    var params = req.body;

    await Equipo.findByIdAndUpdate(idEquipo, params, { new: true }, (err, equipoEditado) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!equipoEditado) {
            return res.status(500).send({ mensaje: "No se ha podido editar el equipo" })
        } else {
            return res.status(200).send({ equipoEditado })
        }
    })
}

//Función para eliminar un equipo
async function eliminarEquipo(req, res) {
    var idEquipo = req.params.idEquipo;

    await Equipo.findByIdAndDelete(idEquipo, (err, equipoEliminado) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!equipoEliminado) {
            return res.status(500).send({ mensaje: "No se ha podido eliminar el equipo" })
        } else {
            Tabla.findOneAndDelete({ equipo: idEquipo }, (err, deleteTabla) => {
                if (err) {
                    console.log(err);
                } else if (!deleteTabla) {
                    console.log(deleteTabla);
                } else {
                    console.log(deleteTabla);
                }
            })
            return res.status(200).send({ equipoEliminado })
        }
    })
}

module.exports = {
    createEquipo,
    mostrarEquipos,
    equiposPorLiga,
    equipoId,
    editarEquipo,
    eliminarEquipo
}