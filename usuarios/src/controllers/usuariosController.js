const { Router } = require('express');
const usuariosModel = require('../models/usuariosModel');
const router = Router();

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const result = await usuariosModel.traerUsuarios();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios', detalle: error.message });
    }
});

// Obtener un usuario por nombre de usuario
router.get('/usuarios/:usuario', async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const result = await usuariosModel.traerUsuario(usuario);
        
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario', detalle: error.message });
    }
});

// Validar usuario con contraseña
router.get('/usuarios/:usuario/:password', async (req, res) => {
    try {
        const { usuario, password } = req.params;
        console.log(`Validando usuario: ${usuario}, con contraseña: ${password}`);

        const result = await usuariosModel.validarUsuario(usuario, password);
        console.log("Resultado de validación:", result);

        if (!result) {
            console.warn(`Credenciales incorrectas para: ${usuario}`);
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const { rol } = result;
        return res.json({ mensaje: `Bienvenido ${rol === 'admin' ? 'Admin' : 'Usuario'}`, usuario: result.usuario, rol });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ error: 'Error al validar el usuario', detalle: error.message });
    }
});

// Crear un nuevo usuario
router.post('/usuarios', async (req, res) => {
    try {
        const { nombre, email, usuario, password, telefono, cedula, direccion, rol = 'usuario' } = req.body;
        
        if (!nombre || !email || !usuario || !password || !telefono || !cedula || !direccion) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        
        await usuariosModel.crearUsuario(nombre, email, usuario, password, telefono, cedula, direccion, rol);
        res.status(201).json({ mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario', detalle: error.message });
    }
});

// Eliminar usuario por nombre de usuario
router.delete('/usuarios/:usuario', async (req, res) => {
    try {
        const usuario = req.params.usuario;
        await usuariosModel.borrarUsuario(usuario);
        res.json({ mensaje: `Usuario ${usuario} eliminado` });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario', detalle: error.message });
    }
});

module.exports = router;
