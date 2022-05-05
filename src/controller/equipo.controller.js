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

function editarEquipo(req, res) {
    let torneoId = req.params.idG;
    let teamId = req.params.idt;
    let update = req.body;

    if(update.nombre){
        Equipo.findById(teamId,(err, teamFind) => {
            console.log(teamFind)
            if(err){
                return res.status(500).send({message: 'Error general al buscar'});
            }else if(teamFind){
                LigaE.findOne({_id: torneoId}, (err, grupoFind) => {
                    console.log(grupoFind)
                    if(err){
                        return res.status(500).send({message: 'Error general en la actualización'});
                    }else if(grupoFind){
                        Equipo.findByIdAndUpdate(teamId, update,{new:true}, (err, teamUpdate) => {
                            if(err){
                                return res.status(500).send({message: 'Error general en la actualización'});
                            }else if(teamUpdate){
                                return res.send({message: 'Grupo actualizado', teamUpdate});
                            }else{
                                return res.status(404).send({message: 'Contacto no actualizado'});
                            }
                        }).populate('liga')
                    }else{
                        return res.status(404).send({message: 'Liga no Existente'})
                    }
                })
            }else{
                return res.status(404).send({message: 'Grupo a actualizar inexistente'});
            }
        })

    }else{
        return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar'});
    }

}

function eliminarEquipo(req, res) {
    let torneoId = req.params.idG;
    let teamId = req.params.idt;
 
 
        LigaE.findOneAndUpdate({_id: torneoId}, {new:true}, (err, groupPull)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(groupPull){
                Equipo.findByIdAndRemove(teamId, (err, Removed)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al eliminar contacto'});
                    }else if(Removed){
                        return res.send({message: 'Equipo eliminado',Removed});
                    }else{
                        return res.status(500).send({message: 'Liga no encontrado, o ya eliminado'});
                    }
                })
            }else{
                return res.status(500).send({message: 'No se pudo eliminarla equipo del grupo'});
      }
})

}

function getTeams(req, res) {
    Equipo.find({}).populate('team').exec((err, teams) => {
        if(err){
                return res.status(500).send({message: 'Error general en el servidor'})
        }else if(teams){
                return res.send({message: 'Equipos: ', teams})
        }else{
                return res.status(404).send({message: 'No hay registros'})
        }
    })
}

var Partido = require('../models/partidos.model');

//Funciones de partidos 

function createPartido(req, res) {
    var torneoId = req.params.id;
    var partido = new Partido();
    var params = req.body;

    if( params.nombre && params.teamOne && params.teamTwo){
        Partido.findOne({nombre: params.nombre},(err,partidosFind) => {
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'});
            }else if(partidosFind){
                    return res.status(500).send({message:'Estos equipos ya estan dentro de un partido '});
                }else{
                LigaE.findById(torneoId, (err, ligaFind) => {
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(ligaFind){
                        partido.nombre = params.nombre;
                        partido.teamOne = params.teamOne;
                        partido.teamTwo = params.teamTwo;
                        partido.goalsTeamOne = 0
                        partido.goalsTeamTwo = 0
                        partido.save((err, partidosSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar'})
                            }else if(partidosSaved){
                                LigaE.findByIdAndUpdate(torneoId , {$push:{partido: partidosSaved._id}}, {new: true}, (err, Push)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general'})
                                    }else if(Push){
                                        return res.send({message: 'Creado Exitosamente', Push});
                                    }else{
                                        return res.status(500).send({message: 'Error al crear el partido'});
                                    }
                                }).populate('partido');
                            }else{
                                return res.status(404).send({message: 'No se creo el partido'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'El grupo al que desea agregar el partido ya no existe'})
                     }
                 })   
            }
        })
    }else{
        return res.send({message: 'Por favor ingresa los datos obligatorios'});
    }



}


function SetGoals(req, res) {
    let torneoId = req.params.idT;
    let partidoId = req.params.idP;
    let update = req.body;

    if(update.goalsTeamOne && update.goalsTeamTwo){
        Partido.findById(partidoId,(err, teamFind) => {
            if(err){
                return res.status(500).send({message: 'Error general al buscar'});
            }else if(teamFind){
                LigaE.findOne({_id: torneoId, partido: partidoId}, (err, grupoFind) => {
                    if(err){
                        return res.status(500).send({message: 'Error general en la actualización'});
                    }else if(grupoFind){
                        Partido.findByIdAndUpdate(partidoId, update,{new:true}, (err, matchUpdate) => {
                            if(err){
                                return res.status(500).send({message: 'Error general en la actualización'});
                            }else if(matchUpdate){
                                return res.send({message: 'Actualizado ', matchUpdate});
                            }else{
                                return res.status(404).send({message: 'Contacto no actualizado'});
                            }
                        }) .populate('partido')
                    }else{
                        return res.status(404).send({message: 'torneo no Existente'})
                    }
                })
            }else{
                return res.status(404).send({message: 'torneo a actualizar inexistente'});
            }
        })

    }else{
        return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar'});
    }
}


function finalizacionPartido(req, res) {
    
    var torneoId = req.params.idT;
    var partidoId = req.params.idP;

            LigaE.findOneAndUpdate({_id:torneoId, partido: partidoId} , {$pull:{partido: partidoId}}, {new:true}, (err, groupPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(groupPull){
                    Partido.findByIdAndRemove(partidoId, (err, Removed)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar contacto'});
                        }else if(Removed){
                            return res.send({message: 'Grupo eliminado',Removed});
                        }else{
                            return res.status(500).send({message: 'Liga no encontrado, o ya eliminado'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminarla equipo del grupo'});
          }
    })
    
}

function getPartidos(req, res){
    Partido.find({}).populate('partido').exec((err, match) => {
            if(err){
                    return res.status(500).send({message: 'Error general en el servidor'})
            }else if(match){
                    return res.send({message: 'Usuarios: ', match})
            }else{
                    return res.status(404).send({message: 'No hay registros'})
            }
        })    

}

module.exports = {
    createEquipo,
    editarEquipo,
    eliminarEquipo,
    getTeams,
    createPartido,
    finalizacionPartido ,
    getPartidos ,
    SetGoals
}