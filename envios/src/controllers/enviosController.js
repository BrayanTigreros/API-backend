const { Router } = require('express');
const axios = require('axios');
const router = Router();
const enviosModel = require('../models/enviosModel');

console.log("Modelo de envíos cargado:", enviosModel);

// Obtener envíos
router.get('/', async (req, res) => {
    try {
        const result = await enviosModel.traerEnvios();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los envíos', detalle: error.message });
    }
});

router.get('/envios/:usuario', async (req, res) => {
    try {
        const usuario = req.params.usuario;

        // Obtener el envío de la base de datos
        const result = await enviosModel.traerEnvioPorUsuario(usuario);
        if (!result.length) {
            return res.status(404).json({ error: "No se encontraron envíos para este usuario." });
        }

        const envio = result[0];  // Tomamos el primer resultado

        // Obtener los datos actualizados del usuario desde usuariosMS
        const respuestaUsuario = await axios.get(`http://192.168.100.2:3002/usuarios/${envio.usuario}`);
        const datosUsuario = respuestaUsuario.data;

        // Obtener los datos actualizados del producto desde productosMS
        const respuestaProducto = await axios.get(`http://192.168.100.2:3001/productos/${envio.producto_id}`);
        const datosProducto = respuestaProducto.data;

        // Responder con el envío, pero agregando la información actualizada del usuario y producto
        res.json({
            id: envio.id,
            usuario: envio.usuario,
            direccion: datosUsuario.direccion,
            telefono: datosUsuario.telefono,
            fecha_envio: envio.fecha_envio,
            fecha_entrega: envio.fecha_entrega,
            estado_envio: envio.estado_envio,
            metodo_pago: envio.metodo_pago,
            producto: {
                id: envio.producto_id,
                nombre: datosProducto.nombre,
                precio: datosProducto.precio
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el envío', detalle: error.message });
    }
});

// Crear nuevo envío con estado "En camino"
router.post('/', async (req, res) => {
    try {
        const { usuario, metodo_pago, numero_tarjeta, fecha_caducidad, codigo_cvv, producto_id } = req.body;

        // Obtener los datos del usuario desde el MS de usuarios
        const respuesta = await axios.get(`http://192.168.100.2:3002/usuarios/${usuario}`);
        const datosUsuario = respuesta.data;
        if (!datosUsuario) {
            return res.status(400).json({ error: "El usuario no existe en la base de datos." });
        }

        // Obtener datos del producto desde el MS de productos
        const respuestaProducto = await axios.get(`http://192.168.100.2:3001/productos/${producto_id}`);
        const datosProducto = respuestaProducto.data;
        if (!datosProducto) {
            return res.status(400).json({ error: "El producto no existe o no se pudo obtener la información." });
        }

        // Verificar el stock
        if (parseInt(datosProducto.stock, 10) <= 0) {
            return res.status(400).json({ error: "Stock insuficiente para el producto." });
        }

        // Calcular fechas
        const fecha_envio = new Date();
        const fecha_entrega = new Date();
        fecha_entrega.setDate(fecha_envio.getDate() + 12);

        // Estado inicial del envío
        const estado_envio = "En camino";

        // Registrar el envío (solo guardamos usuario y producto_id)
        await enviosModel.crearEnvio(
            usuario,
            fecha_envio,
            fecha_entrega,
            estado_envio,
            metodo_pago,
            numero_tarjeta,
            fecha_caducidad,
            codigo_cvv,
            producto_id
        );

        res.status(201).json({ message: "Envío registrado exitosamente", usuario, fecha_envio, fecha_entrega, estado_envio });
    } catch (error) {
        console.error("Error al obtener el usuario desde usuariosMS:", error.message);
        res.status(500).json({ error: 'Error al registrar el envío', detalle: error.message });
    }
});

// Actualizar estados de envíos automáticamente
router.put('/envios/actualizar-estados', async (req, res) => {
    try {
        await enviosModel.actualizarEstadoEnvios();
        res.json({ message: "Estados de envíos actualizados correctamente." });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar los estados de envíos', detalle: error.message });
    }
});

// Eliminar un envío por usuario
router.delete('/envios/:usuario', async (req, res) => {
    try {
        const usuario = req.params.usuario;
        await enviosModel.borrarEnvio(usuario);
        res.json({ message: `Envío del usuario ${usuario} eliminado` });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el envío', detalle: error.message });
    }
});

module.exports = router;
