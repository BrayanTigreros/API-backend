    const express = require('express');
    const garantiasController = require('./controllers/garantiasController');
    const morgan = require('morgan');

    const app = express();
    app.use(morgan('dev'));
    app.use(express.json());

    app.use('/garantias', garantiasController);

    app.listen(3004, () => {
        console.log('Microservicio de Garantías ejecutándose en el puerto 3004');
    });
