const jwt_simple = require('jwt-simple');
const moment = require('moment');
const claveSecreta = "clave_secreta_IN6BV";

exports.ensureAuth = function (req, res, next) {
    if( !req.headers.authorization ){
        return res.status(500).send({ mensaje: "La peticion no tiene la cabecera de Authorization" });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt_simple.decode(token, claveSecreta);
        console.log(payload);
        // EXP = variable que contiene el tiempo de expiracion del token
        if(payload.exp <= moment().unix()){
            return res.status(500).send({ mensaje: "El token ha expirado."});
        }
    } catch (error) {
        return res.status(500).send({ mensaje: "El token no es valido."})
    }

    req.user = payload;
    next();
}

exports.ensureAuthAdmin = (req, res, next)=>{
    var payload = req.user;
        
    if(payload.rol != 'ADMIN'){
        return res.status(404).send({message: 'No tienes permiso para ingresar a esta ruta'})
    }else{
       return next(); 
    }
}