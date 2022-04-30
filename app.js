const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS
const usuarioRoutes = require('./src/routes/usuario.routes');
const ligaRoutes = require('./src/routes/liga.routes');
const equipoRoutes = require('./src/routes/equipo.routes');


// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api
app.use('/api', usuarioRoutes, ligaRoutes, equipoRoutes);

module.exports = app;