var Result  = require('../models/results.model');
var Partido = require('../models/partidos.model');

function crearResult (req ,res) {
    var partidoId = req.params.id;
    var params = req.body;
    var result = new Result();

    if(params.teamOne && params.teamTwo){
        Result.findOne({teamOne: params.teamOne}, (err, resultFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'});
            }else if(resultFind){
                return res.send({message: 'Ya se agregaron los resultados al partido'});
            }else{
                Partido.findById(partidoId,(err, matchFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(matchFind){
                        result.onegoles = params.onegoles;
                        result.twogoles = params.twogoles;
                        result.save((err, resultSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar'})
                            }else if (resultSaved){
                                Partido.findByIdAndUpdate(partidoId,{$push:{result: resultSaved._id}}, {new:true} , (err, resultPush)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general '});
                                    }else if(resultPush){
                                        return res.send({message: 'Se agregaron los resultados correctamente',resultPush });
                                    }else{
                                        return res.status(500).send({message: 'Error al gruadar'});
                                    }
                                }).populate('resultados');
                            }else{
                                return res.status(404).send({message: 'No se agregaron los resultados'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'El partido no existe o ya fue finalizado '})

                    }
                })
            }
        })
    }else{
        return res.send({message: 'Por favor ingresa los datos obligatorios'});
    }

}


function getResult(req , res) {
    Result.find({}).populate('resultados').exec((err, result)=>{
        if(err){
                return res.status(500).send({message: 'Error general en el servidor'})
        }else if(result){
                return res.send({message: 'Resultados: ', result})
        }else{
                return res.status(404).send({message: 'No hay registros'})
        }
    })
}




module.exports = {
    crearResult,
    getResult,
    
}