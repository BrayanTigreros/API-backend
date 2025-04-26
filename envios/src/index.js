const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const enviosController = require('./controllers/enviosController');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Se usa el controlador para manejar las rutas de envíos
app.use('/envios', enviosController);

app.listen(3003, "0.0.0.0", () => {
    console.log('Microservicio Envíos ejecutándose en el puerto 3003');
});

