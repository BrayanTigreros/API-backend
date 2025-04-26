const { Router } = require('express');
const router = Router();
const garantiasModel = require('../models/garantiasModel');

// Obtener todas las garantías
router.get('/garantias', async (req, res) => {
  try {
    const result = await garantiasModel.obtenerGarantias();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las garantías', detalle: error.message });
  }
});

// Obtener una garantía por usuario
router.get('/:usuario', async (req, res) => {
    const usuario = req.params.usuario;
    console.log(`Solicitando garantía para usuario: ${usuario}`);
    try {
        const result = await garantiasModel.obtenerGarantiaPorUsuario(usuario);
        console.log("Resultado de la consulta:", result);
        if (!result || result.length === 0) {
            return res.status(404).json({ error: "No se encontraron garantías para este usuario" });
        }
        res.json(result[0]);
    } catch (error) {
        console.error("Error en la ruta GET de garantías:", error);
        res.status(500).json({ error: "Error en el servidor", detalle: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        // Desestructuramos: esperamos recibir producto_id y usuario
        const { producto_id, usuario, fecha_compra } = req.body;
        
        // Si no se envía fecha_compra, usamos la fecha actual (formateada como "YYYY-MM-DD")
        const fechaCompra = fecha_compra || new Date().toISOString().split('T')[0];

        // Llamamos a la función crearGarantia, usando "usuario" como cliente
        const nuevaGarantia = await garantiasModel.crearGarantia(producto_id, usuario, fechaCompra);

        res.status(201).json(nuevaGarantia);
    } catch (error) {
        console.error("Error al registrar la garantía:", error);
        res.status(500).json({ error: 'Error al registrar la garantía', detalle: error.message });
    }
});

module.exports = router;
