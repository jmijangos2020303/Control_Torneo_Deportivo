const Usuario = require("../models/usuario.model")
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jwt-simple");
const jwt2 = require('../services/jwt');

function mainStart(req, res) {

    let usuarioModelo = new Usuario();

    usuarioModelo.usuario = 'ADMIN'
    usuarioModelo.password = '123456',
    usuarioModelo.email = 'ADMIN',
    usuarioModelo.rol = 'ADMIN'

    Usuario.find({$or:[
        {usuario: usuarioModelo.usuario}
    ]}).exec((err, buscarUsuario)=>{
        if(err) return console.log("ERROR en la peticion")
        
        if(buscarUsuario && buscarUsuario.length>=1){
            console.log("Usuario Admin creado con anterioridad")
        }else{
            bcrypt.hash(usuarioModelo.password,null,null, (err, passCrypt)=>{
                usuarioModelo.password = passCrypt;
            })

            usuarioModelo.save((err,usuarioGuardado)=>{
                if(err) return console.log( "ERROR al crear el usuario Admin" )

                if(usuarioGuardado){
                    console.log( "Usuario Admin Creado" )
                }
            })
        }
    })
}


//Función de registro
function registro(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;
    if (params.nombre && params.usuario && params.email && params.password) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol = "Rol_Cliente",
        usuarioModel.password = params.password;

         Usuario.find({
            $or: [
                { usuario: usuarioModel.usuario },
                { email: usuarioModel.email }
            ]
        }).exec((err, usuarioEncontrado) => {
            if (err) {
                return res.status(500).send({ mensaje: "Error en la petición" })
            } else if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
                return res.status(500).send({ mensaje: "El usuario es existente" })
            } else {
                bcrypt.hash(params.password, null, null, (err, passEncrypt) => {
                    usuarioModel.password = passEncrypt;
                    usuarioModel.save((err, userSave) => {
                        if (err) {
                            return res.status(500).send({ mensaje: "Error en la petición 2" })
                        } else if (!userSave) {
                            return res.status(500).send({ mensaje: "Error al guardar el registro" })
                        } else {
                            return res.status(200).send({ userSave })
                        }
                    })
                })
            }
        })
    } else {
        console.log("No ha ingresado todos los parámetros");
        return res.status(500).send({ mensaje: "No ha ingresado todos los parámetros" })
    }
}


//Funcion Login

function login(req, res) {
    var parametros = req.body;
    // BUSCAMOS EL CORREO
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (usuarioEncontrado){
            // COMPARAMOS CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        if(parametros.obtenerToken == 'true'){
                            return res.status(200)
                                .send({ token: jwt2.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;

                            return res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }                       
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La contrasena no coincide.'})
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'El usuario, no se ha podido identificar'})
        }
    })
}

//Función para editar el usuario
function editarRegistro(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    if (req.user.sub != idUsuario) {
        return res.status(500).send({ mensaje: "No tiene la autorización para editar el usuario" })
    } else {
        delete params.password;
        Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioEditado) => {
            if (err) {
                return res.status(500).send({ mensaje: "Error en la petición" })
            } else if (!usuarioEditado) {
                return res.status(500).send({ mensaje: "No se ha podido editar el registro" })
            } else {
                return res.status(200).send({ usuarioEditado })
            }
        })
    }
}

function editarUsuarioAdmin(req, res) {
    var idUsuario = req.params.idUsuario;
    Usuario.findByIdAndUpdate(idUsuario, req.body, { new: true }, (err, usuarioEditado) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!usuarioEditado) {
            return res.status(500).send({ mensaje: "No se ha podido editar el registro" })
        } else {
            return res.status(200).send({ usuarioEditado })
        }
    })
}

function convertirAdmin(req, res) {
    var iduser = req.params.idUsuario;
    var founduser = Usuario.findOne({ _id: iduser });
    if (founduser.rol === "Admin_App") {
        return res.status(400).json({ error: "El usuario ya es Administrador" })
    }

    Usuario.findByIdAndUpdate(iduser, { rol: "Admin_App" })
        .then(doc => res.status(200).json(doc))
        .catch(err => console.error(err));
}

//Función para eliminar el usuario
function eliminarRegistro(req, res) {
    var idUsuario = req.params.idUsuario;
    if (req.user.sub != idUsuario) {
        return res.status(500).send({ mensaje: "No tiene el rol de autorización para eliminar el registro" })
    } else {
        Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado) => {
            if (err) {
                return res.status(500).send({ mensaje: "Error en la petición" })
            } else if (!usuarioEliminado) {
                return res.status(500).send({ mensaje: "No se pudo eliminar el registro" })
            } else {
                return res.status(200).send({ usuarioEliminado })
            }
        })
    }
}

function eliminarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    Usuario.findByIdAndDelete(idUsuario)
        .then(doc => res.status(200).json(doc))
        .catch(err => console.error(err))
}

//Función para obtener un usuario por id
function obtenerUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    Usuario.findById(idUsuario, (err, usuarioEncontrado) => {
        if (err) {
            return res.status(500).send({ mensaje: "Error en la petición" })
        } else if (!usuarioEncontrado) {
            return res.status(500).send({ mensaje: "No se pudo obtener el registro" })
        } else {
            return res.status(200).send({ usuarioEncontrado })
        }
    })
}

function obtenerIdentidad(req, res) {
    let x = jwt.decode(req.headers["authorization"], "Torneo_Deportivo");
    res.json(x)
}

function obtenerTodosLosUsuarios(req, res) {
    Usuario.find().sort({ rol: 1 })
        .then(doc => res.status(200).json(doc))
        .catch(err => console.error(err));
}

function obtenerTodosLosUsuariosClientes(req, res) {
    Usuario.find({ rol: "Rol_Cliente" })
        .then(doc => res.status(200).json(doc))
        .catch(err => console.error(err));
}

module.exports = {
    registro,
    login,
    editarRegistro,
    editarUsuarioAdmin,
    eliminarRegistro,
    eliminarUsuario,
    obtenerUsuario,
    obtenerTodosLosUsuariosClientes,
    obtenerTodosLosUsuarios,
    obtenerIdentidad,
    convertirAdmin,
    mainStart
}