const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'david664',
    database: 'productosMS'
});

async function traerProductos() {
    const [result] = await connection.query('SELECT * FROM productos');
    return result;
}

async function traerProducto(id) {
    const [result] = await connection.query('SELECT * FROM productos WHERE id = ?', [id]);
    return result;
}

async function actualizarProducto(id, nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock) {
    const [result] = await connection.query(
        'UPDATE productos SET nombre = ?, estado = ?, marca = ?, modelo = ?, cpu = ?, ram = ?, gb_almacenamiento = ?, tipo_almacenamiento = ?, gpu = ?, pantalla = ?, es_tactil = ?, precio = ?, garantia = ?, stock = ? WHERE id = ?',
        [nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock, id]
    );
    return result;
}

async function crearProducto(nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock) {
    const [result] = await connection.query(
        'INSERT INTO productos (nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, estado, marca, modelo, cpu, ram, gb_almacenamiento, tipo_almacenamiento, gpu, pantalla, es_tactil, precio, garantia, stock]
    );
    return result;
}

async function borrarProducto(id) {
    const [result] = await connection.query('DELETE FROM productos WHERE id = ?', [id]);
    return result;
}

module.exports = {
    traerProductos,
    traerProducto,
    actualizarProducto,
    crearProducto,
    borrarProducto
};
