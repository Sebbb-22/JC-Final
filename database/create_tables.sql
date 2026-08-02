-- Base de datos: Sistema de Grupos de Amistad
-- Ejecutar este script primero para crear la base de datos y las tablas.

CREATE DATABASE IF NOT EXISTS grupos_amistad;
USE grupos_amistad;

-- Usuarios que inician sesion: administradores y lideres de grupo
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'lider') NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grupos de amistad, cada uno con un lider responsable
CREATE TABLE grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  id_lider INT NOT NULL,
  dia_semana ENUM('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo') NOT NULL,
  hora TIME NOT NULL,
  ubicacion VARCHAR(200),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_lider) REFERENCES usuarios(id)
);

-- Personas que asisten a un grupo de amistad (no inician sesion)
CREATE TABLE miembros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(200),
  edad INT,
  telefono VARCHAR(20),
  id_grupo INT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_grupo) REFERENCES grupos(id)
);

-- Asistencia de cada miembro, ya sea al grupo de amistad o a la reunion del domingo
CREATE TABLE asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_miembro INT NOT NULL,
  id_grupo INT NOT NULL,
  fecha DATE NOT NULL,
  tipo ENUM('grupo', 'domingo') NOT NULL,
  asistio BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_miembro) REFERENCES miembros(id),
  FOREIGN KEY (id_grupo) REFERENCES grupos(id)
);

-- Ofrendas recabadas por grupo el dia de la reunion de grupo
CREATE TABLE ofrendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo INT NOT NULL,
  fecha DATE NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_grupo) REFERENCES grupos(id)
);
