const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'mysql', // Usar el nombre del servicio Docker
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'david664',
    database: process.env.DB_NAME || 'garantiasMS',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Obtener todas las garantías
async function obtenerGarantias() {
  const [rows] = await pool.query('SELECT * FROM garantias');
  return rows;
}

// Crear nueva garantía (validando que no exista)
async function crearGarantia(producto_id, cliente, fecha_compra) {
  // Verificar si el cliente ya tiene una garantía
  const [existe] = await pool.query('SELECT id FROM garantias WHERE cliente = ?', [cliente]);
  
  if (existe.length > 0) {
    throw new Error('El usuario ya tiene una garantía registrada.');
  }

  const fechaCompra = new Date(fecha_compra);
  const fechaExpiracion = new Date(fechaCompra);
  fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 12);

  const fechaCompraStr = fechaCompra.toISOString().split('T')[0];
  const fechaExpiracionStr = fechaExpiracion.toISOString().split('T')[0];

  const estado = (new Date() < fechaExpiracion) ? "Activa" : "Expirada";

  const query = `
    INSERT INTO garantias (producto_id, cliente, fecha_compra, fecha_expiracion_garantia, estado)
    VALUES (?, ?, ?, ?, ?)
  `;

  await pool.query(query, [producto_id, cliente, fechaCompraStr, fechaExpiracionStr, estado]);

  return { producto_id, cliente, fecha_compra: fechaCompraStr, fecha_expiracion_garantia: fechaExpiracionStr, estado };
}

// Función para obtener la garantía de un usuario específico (cliente)
async function obtenerGarantiaPorUsuario(usuario) {
  try {
    const [rows] = await pool.query('SELECT * FROM garantias WHERE cliente = ?', [usuario]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de garantías:", error);
    throw error;
  }
}

module.exports = {
  crearGarantia,
  obtenerGarantias,
  obtenerGarantiaPorUsuario
};
