const mysql = require('mysql2/promise');

// Establecer la conexión con la base de datos
const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'david664',
    database: 'usuariosMS'
});

// Obtener todos los usuarios
async function traerUsuarios() {
    const [rows] = await connection.query('SELECT * FROM usuarios');
    return rows;
}

// Obtener un usuario por su nombre de usuario
async function traerUsuario(usuario) {
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return rows;
}

// Validar usuario con contraseña y devolver toda la información del usuario (incluyendo rol)
async function validarUsuario(usuario, password) {
    try {
        console.log(`Consultando usuario: ${usuario}, contraseña: ${password}`);

        const [rows] = await connection.query('SELECT * FROM usuarios WHERE usuario = ? AND password = ?', [usuario, password]);

        console.log("Resultado de la consulta:", rows);

        if (rows.length === 0) {
            console.warn("Usuario o contraseña incorrectos");
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error("Error en validarUsuario:", error);
        throw new Error("Error al validar usuario en la base de datos");
    }
}

// Crear un nuevo usuario, incluyendo el rol
async function crearUsuario(nombre, email, usuario, password, telefono, cedula, direccion, rol = 'usuario') {
    const [result] = await connection.query('INSERT INTO usuarios (nombre, email, usuario, password, telefono, cedula, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [nombre, email, usuario, password, telefono, cedula, direccion, rol]);
    return result;
}

// Borrar un usuario por nombre de usuario
async function borrarUsuario(usuario) {
    const [result] = await connection.query('DELETE FROM usuarios WHERE usuario = ?', [usuario]);
    return result;
}

module.exports = {
    traerUsuarios,
    traerUsuario,
    validarUsuario,
    crearUsuario,
    borrarUsuario
};
