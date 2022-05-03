const Liga = require("../models/liga.model");
const Equipo = require("../models/equipo.model")
const Tabla = require("../models/tabla.model");
const pdfGenerador = require('../utils/pdf/pdf.generator')
const pdfTablaLiga = require('../utils/pdf/reporteTablaLiga.generator')
const Usuario = require("../models/usuario.model")


// Create Liga
function createLiga(req, res) {
    var modeloliga = new Liga();
    var params = req.body;

    if (params.nombreL) {
        modeloliga.nombreL = params.nombreL;
        modeloliga.image = params.image;
        modeloliga.creador = req.user.nombre;

        Liga.find({nombreL: params.nombreL}, (err, catEncontrado)=> {
            if (err) {
                return res.status(500).send({ mensaje: "Error en la petición" })
            }else if (catEncontrado.length == 0) {
                modeloliga.save((err, ligaSave) => {
                    if (err) {
                        return res.status(500).send({ mensaje: "Error en la petición" })
                    } else if (!ligaSave) {
                        return res.status(500).send({ mensaje: "No se ha podido guardar la liga" })
                    } else {
                        return res.status(200).send({ ligaSave })
                    }
                })
            } else {
                return res.status(500)
                        .send({ mensaje: 'Esta Liga ya existe en la Base de Datos ' });
            }
        })
    }else{
        return res.status(500).send({ mensaje: "No ha completado todos los parámetros" })
    }
}



//mostrar ligas
function mostrarLigas(req, res) {
    Liga.find().populate('', 'nombreL email').exec((err, ligas) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!ligas) {
            return res.status(500).send({ mensaje: "No se han podido obtener las ligas" })
        } else {
            return res.status(200).send({ ligas })
        }
    })
}

//Mostrar ligas por el id de usuario
function ligasForUser(req, res) {
    // if (req.user.rol === "Admin_App") {
    var nombre = req.params.nombre;

    Liga.find({ creador: nombre }, (err, ligasUser) => {
            if (err) {
                return res.status(500).send({ mensaje: "Error en la petición" })
            } else if (!ligasUser) {
                return res.status(500).send({ mensaje: "No se han podido obtener las ligas" })
            } else {
                return res.status(200).send(ligasUser)
            }
        })
        //} else {
        //return res.status(500).send({ mensaje: "No tiene el rol de autorización" })
        //}
}

//Mostrar mis ligas (del usuario que este logeado)
function misLigas(req, res) {
    Liga.find({creador: req.user.nombre}, (err, catEncontrado)=> {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!catEncontrado) {
            return res.status(500).send({ mensaje: "No se han podido obtener las ligas" })
        } else {
            return res.status(200).send({ catEncontrado })
        }
    })
}

//mostrar liga por Id
function mostrarLigaID(req, res) {
    var idLiga = req.params.idLiga;

    Liga.findById(idLiga, (err, liga) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!liga) {
            return res.status(500).send({ mensaje: "No se ha podido obtener la liga" })
        } else {
            return res.status(200).send({ liga })
        }
    })
}

//Mostrar equipos por liga
function equiposLiga(req, res) {
    var idLiga = req.params.idLiga;

    Equipo.find({ liga: idLiga }).populate('liga', 'nombreL').exec((err, equipos) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!equipos) {
            return res.status(500).send({ mensaje: "No se han podido obtener los equipos" })
        } else {
            return res.status(200).send({ equipos })
        }
    })
}

//Mostrar tabla por liga
function tablaLiga(req, res) {
    var idLiga = req.params.idLiga;
    var Equipos = Equipo.find({ liga: idLiga })
    Tabla.find({ equipo: Equipos }).populate('equipo', 'nombreL').exec((err, tabla) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!tabla) {
            return res.status(500).send({ mensaje: "No se ha podido obtener la tabla" })
        } else {
            return res.status(200).send({ tabla })
        }
    })
}

//editar liga
function editarLiga(req, res) {
    var idLiga = req.params.idLiga;
    var params = req.body;

    Liga.findByIdAndUpdate(idLiga, params, { new: true }, (err, ligaEditada) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!ligaEditada) {
            return res.status(500).send({ mensaje: "No se ha podido editar la liga" })
        } else {
            return res.status(200).send({ ligaEditada })
        }
    })
}

//Función para eliminar Liga
function eliminarLiga(req, res) {
    var idLiga = req.params.idLiga;
    var Equipos = Equipo.find({ liga: idLiga })
    
    Liga.findByIdAndDelete(idLiga, (err, deleteLiga) => {
        if (err) {
            console.log("Error en la petición");
        } else if (!deleteLiga) {
            console.log("No se han podido eliminar los equipos en la tabla");
        }else{
            return res.status(200).send({ deleteLiga })
        }{
            Equipo.deleteMany({ liga: idLiga }, (err, equiposLiga) => {
                if (err) {
                    console.log("Error en la petición:" + err);
                } else if (!equiposLiga) {
                    console.log("No se pudieron eliminar los equipos de la liga: " + equiposLiga);
                } else {
                    Tabla.deleteMany({ equipo: Equipos }, (err, equiposTabla) => {
                        if (err) {
                            return res.status(500).send({ mensaje: "Error en la petición" })
                        } else if (!equiposTabla) {
                            return res.status(500).send({ mensaje: "No se ha podido eliminar la liga" })
                        }
                    })
                    console.log("Éxito por eliminar los equipos en la liga");
                }
            })
            console.log("Éxito por eliminar los equipos de la tabla");
        }
    })
}

/*-------------------------------------------------- PARTE DE LOS REPORTES -----------------------------------------------------------------*/

//Generar reporte de equipos por liga
function generarPDF(req, res) {
    const idLiga = req.params.idLiga;
    const equipos = Equipo.find({ liga: idLiga }, (err, datos) => {
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

//Generar reporte de la tabla liga
function generadorTablaLiga(req, res) {
    var idLiga = req.params.idLiga;
    var Equipos = Equipo.find({ liga: idLiga })
    var obj = [];
    const tabla = Tabla.find({ equipo: Equipos }, (err, datos) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (datos && datos.length >= 1) {
            console.log("Equipos Encontrados");
        } else {
            return res.status(500).send({ mensaje: "La liga no contiene equipos" })
        }
    }).populate("equipo").sort({ puntaje: -1 })
    obj = tabla;
    pdfTablaLiga.generadorTablaLiga(obj).then(datos => res.download(datos.filename))
}


module.exports = {
    createLiga,
    mostrarLigas,
    misLigas,
    ligasForUser,
    mostrarLigaID,
    equiposLiga,
    tablaLiga,
    editarLiga,
    eliminarLiga,
    //Reportes
    generarPDF,
    generadorTablaLiga
}