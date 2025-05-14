-- init.sql: crea todas las bases necesarias al arrancar MySQL

CREATE DATABASE IF NOT EXISTS usuariosMS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS productosMS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS garantiasMS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS enviosMS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE usuariosMS;

CREATE TABLE IF NOT EXISTS usuarios (
    nombre VARCHAR(20) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    usuario VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Para hashes seguros
    telefono VARCHAR(10),
    cedula VARCHAR(12) UNIQUE,
    direccion VARCHAR(30),
    PRIMARY KEY (usuario)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE productosMS;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    cpu VARCHAR(100) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    gb_almacenamiento VARCHAR(50) NOT NULL,
    tipo_almacenamiento VARCHAR(50) NOT NULL,
    gpu VARCHAR(100) NOT NULL,
    pantalla VARCHAR(50) NOT NULL,
    es_tactil VARCHAR(10) NOT NULL,
    precio VARCHAR(50) NOT NULL,
    garantia VARCHAR(50) NOT NULL,
    stock VARCHAR(50) NOT NULL  # Usa espacios normales
);

USE enviosMS;

CREATE TABLE IF NOT EXISTS envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(10) NOT NULL,
  direccion VARCHAR(30),
  fecha_envio DATE,
  fecha_entrega DATE,
  telefono VARCHAR(10),
  cedula VARCHAR(12),
  estado_envio VARCHAR(20),
  metodo_pago VARCHAR(20),
  numero_tarjeta VARCHAR(20),
  fecha_caducidad VARCHAR(20),
  codigo_cvv VARCHAR(5),
  producto_id VARCHAR(30) NOT NULL,
  precio DECIMAL(10,2)
);

USE garantiasMS;

CREATE TABLE IF NOT EXISTS garantias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cliente VARCHAR(100) NOT NULL,
    fecha_compra DATE NOT NULL,
    fecha_expiracion_garantia DATE NOT NULL,
    estado ENUM('Activa', 'Expirada') NOT NULL
);
