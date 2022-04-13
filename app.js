 //Variables globales
 const express = require("express");
 const app = express();
 const bodyParser = require("body-parser");
 const cors = require("cors")
 const morgan = require("morgan")

 //Cabeceras
 app.use(cors());


 //Middlewares
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 app.use(morgan("dev"));

 //Exportar 
 module.exports = app;