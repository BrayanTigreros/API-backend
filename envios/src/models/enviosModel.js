// Verifica que este bloque no tenga problemas
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
   host: process.env.DB_HOST || 'mysql',
   user: process.env.DB_USER || 'root',
   password: process.env.DB_PASSWORD || 'david664',
   database: process.env.DB_NAME || 'enviosMS',
   port: process.env.DB_PORT || 3306,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0
});

console.log("Pool creado:", pool);

// Obtener todos los envíos
async function traerEnvios() {
  const [rows] = await pool.query('SELECT * FROM envios');
  return rows;
}

// Obtener un envío por usuario
async function traerEnvioPorUsuario(usuario) {
  const [rows] = await pool.query('SELECT usuario, direccion, telefono, cedula, fecha_envio, fecha_entrega, estado_envio FROM envios WHERE usuario = ?', [usuario]);
  return rows;
}

async function crearEnvio(usuario, fecha_envio, fecha_entrega, estado_envio, metodo_pago, numero_tarjeta, fecha_caducidad, codigo_cvv, producto_id, direccion, telefono, cedula, precio) {
  // Verificar si el usuario ya tiene un pedido
  const [existingOrders] = await pool.query('SELECT COUNT(*) as total FROM envios WHERE usuario = ?', [usuario]);

  if (existingOrders[0].total > 0) {
    throw new Error('El usuario ya tiene un pedido y no puede hacer otro.');
  }

  // Si no tiene pedidos, crear el nuevo
  await pool.query(
    'INSERT INTO envios (usuario, direccion, fecha_envio, fecha_entrega, telefono, cedula, estado_envio, metodo_pago, numero_tarjeta, fecha_caducidad, codigo_cvv, producto_id, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [usuario, direccion || 'N/A', fecha_envio, fecha_entrega, telefono || 'N/A', cedula || 'N/A', estado_envio, metodo_pago, numero_tarjeta, fecha_caducidad, codigo_cvv, producto_id, precio]
  );
}

// Actualizar estado del envío a Entregado si han pasado 7 días
async function actualizarEstadoEnvios() {
  await pool.query('UPDATE envios SET estado_envio = "Entregado" WHERE fecha_entrega <= NOW() AND estado_envio = "En camino"');
}

// Eliminar un envío por usuario
async function borrarEnvio(usuario) {
  await pool.query('DELETE FROM envios WHERE usuario = ?', [usuario]);
}

module.exports = { traerEnvios, traerEnvioPorUsuario, crearEnvio, borrarEnvio, actualizarEstadoEnvios };
