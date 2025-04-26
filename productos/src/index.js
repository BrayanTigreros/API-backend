const express = require('express');
const productosController = require('./controllers/productosController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use('/productos', productosController);
app.listen(3001, "0.0.0.0", () => {
    console.log('backProductos ejecutandose en el puerto 3001');
});
