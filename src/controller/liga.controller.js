const Liga = require("../models/liga.model");
const Equipo = require("../models/equipo.model")
const Tabla = require("../models/tabla.model");
const pdfGenerador = require('../controller/pdf.generator')
const Usuario = require("../models/usuario.model")



function setTorneo(req, res) {
    var userId = req.params.id;
    var params = req.body;
    var torneo = new Liga();


    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos para realizar esta acción' })
    } else {
        User.findById(userId, (err, userFind) => {
            if (err) {
                return res.status(500).send({ message: 'Error general' })
            } else if (userFind) {
                torneo.nombreL = params.nombreL;
                torneo.save((err, contactSaved) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general al guardar' })
                    } else if (contactSaved) {
                        Usuario.findByIdAndUpdate(userId, {$push: { liga: params.nombreL} }, { new: true }, (err, contactPush) => {
                            if (err) {
                                return res.status(500).send({ message: 'Error general al agergar contacto' })
                            } else if (contactPush) {
                                return res.send({ message: 'Torneo agregado', contactPush });
                            } else {
                                return res.status(500).send({ message: 'Error al agregar contacto' })
                            }
                        })
                    } else {
                        return res.status(404).send({ message: 'No se guardó el contacto' })
                    }
                })
            } else {
                return res.status(404).send({ message: 'El usuario al que deseas agregar el contacto no existe.' })
            }
        })
    }
}

// Create Liga
function createTorneo(req, res) {
    var userId = req.params.id;
    var liga = new Liga();
    var params = req.body;

    if (params.nombreL) {
        Liga.findOne({ nombreL: params.nombreL }, (err, torneoFind) => {
            if (err) {
                return res.status(500).send({ message: 'Error general en el servidor' });
            } else if (torneoFind) {
                return res.send({ message: 'Nombre de usuario ya en uso' });
            } else {
                Usuario.findById(userId, (err, userFind) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general aqui' })
                    } else if (userFind) {
                        liga.nombreL = params.nombreL;
                        liga.save((err, torneoSaved) => {
                            if (err) {
                                return res.status(500).send({ message: 'Error general al guardar' })
                            } else if (torneoSaved) {
                                Usuario.findByIdAndUpdate(userId, { $push: { liga: params.nombreL } }, { new: true }, (err, torneoPush) => {
                                    if (err) {
                                        return res.status(500).send({ message: 'Error general aqui2 ' });
                                    } else if (torneoPush) {
                                        return res.send({ message: 'Torneo Creada Exitosamente', torneoPush });
                                    } else {
                                        return res.status(500).send({ message: 'Error al crear una Liga' });
                                    }
                                })
                            } else {
                                return res.status(404).send({ message: 'No se creo el torneo' })
                            }
                        })
                    } else {
                        return res.status(404).send({ message: 'El usuario al que deseas agregar la Liga no existe.' })
                    }
                })
            }
        })
    } else {
        return res.send({ message: 'Por favor ingresa los datos obligatorios' });
    }
}



function updateTorneo(req, res) {
    let userId = req.params.idU;
    let torneoId = req.params.idT;
    let update = req.body;

    if (update.nombreL) {
        Liga.findById(torneoId, (err, ligaFind) => {
            if (err) {
                return res.status(500).send({ message: 'Error general al buscar' });
            } else if (ligaFind) {
                Usuario.findOne({ _id: userId}, (err, userFind) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general en la busqueda de usuario' });
                    } else if (userFind) {
                        Liga.findByIdAndUpdate(torneoId, update, { new: true }, (err, ligaUpdated) => {
                            if (err) {
                                return res.status(500).send({ message: 'Error general en la actualización' });
                            } else if (ligaUpdated) {
                                return res.send({ message: 'Contacto actualizado', ligaUpdated });
                                
                            } else {
                                return res.status(404).send({ message: 'Contacto no actualizado' });
                            }
                            
                        }).populate('equipo')
                        
                    } else {
                        return res.status(404).send({ message: 'Usuario no encontrado' })
                    }
                })
            } else {
                return res.status(404).send({ message: 'Contacto a actualizar inexistente' });
            }
        })
    } else {
        return res.status(404).send({ message: 'Por favor ingresa los datos mínimos para actualizar' });
    }


}

function removeTorneo(req, res) {
    let userId = req.params.idU;
    let torneoId = req.params.idT;
    let nombreL = req.body; 

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos para realizar esta acción' });
    } else {
        
        Liga.findByIdAndRemove(torneoId, (err, contactRemoved) => {
            if (err) {
                return res.status(500).send({ message: 'Error general al eliminar contacto' });
            } else if (contactRemoved) {
                return res.send({ message: 'Torneo eliminado', });
            } else {
                return res.status(500).send({ message: 'Contacto no encontrado, o ya eliminado' });
            }
        })

    }
    }



function getTorneo(req, res) {
    Liga.find({}).populate('team').exec((err, torneo) => {
        if (err) {
            return res.status(500).send({ message: 'Error general en el servidor' })
        } else if (torneo) {
            return res.send({ message: 'Torneos Disponibles: ', torneo })
        } else {
            return res.status(404).send({ message: 'No hay registros' })
        }
    })
}


//Generar reporte de equipos por liga
async function generarPDF(req, res) {
    const idLiga = req.params.idLiga;
    const equipos = Equipo.find({ liga: idLiga }, (err, datos) => {
        console.log(datos)
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (datos && datos.length >= 1) {
            console.log("Equipos Encontrados");
        } else {
            return res.status(500).send({ mensaje: "La liga no contiene equipos" })
        }
    }).populate("liga")
    pdfGenerador.generarPDF(equipos).then(datos => res.download(datos.filename))
}


module.exports = {
    createTorneo,
    updateTorneo,
    removeTorneo,
    getTorneo,
    setTorneo,
    generarPDF
}
