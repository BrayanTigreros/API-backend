const { Router } = require('express');
const router = Router();
const productosModel = require('../models/productosModel');

router.get('/', async (req, res) => {
    var result;
    result = await productosModel.traerProductos();
    res.json(result);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    var result;
    result = await productosModel.traerProducto(id);
    res.json(result[0]);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock } = req.body;

    if (stock < 0) {
        res.send("El stock no puede ser menor de cero");
        return;
    }

    var result = await productosModel.actualizarProducto(id, nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock);
    res.send("Producto actualizado correctamente");
});

router.post('/', async (req, res) => {
    const { nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock } = req.body;

    var result = await productosModel.crearProducto(nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock);
    res.send("Producto creado");
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    var result;
    result = await productosModel.borrarProducto(id);
    res.send("Producto borrado");
});

module.exports = router;