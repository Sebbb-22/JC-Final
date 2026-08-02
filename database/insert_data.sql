-- Datos de ejemplo. Ejecutar despues de create_tables.sql
-- Los usuarios (admin/lideres) se crean con el script de seed del backend (ver backend/README.md),
-- porque su contrasena debe guardarse cifrada (bcrypt) y no en texto plano en un script SQL.
-- Este archivo asume que ya existen los usuarios con id 1 (admin), 2 y 3 (lideres).

USE grupos_amistad;

INSERT INTO grupos (nombre, id_lider, dia_semana, hora, ubicacion) VALUES
('Grupo Renuevo', 2, 'Miercoles', '19:00:00', 'Casa de Juan, Col. Centro'),
('Grupo Esperanza', 3, 'Jueves', '18:30:00', 'Casa de Maria, Col. Las Flores');

INSERT INTO miembros (nombre, direccion, edad, telefono, id_grupo) VALUES
('Ana Torres', 'Calle 5 #123', 28, '4491234567', 1),
('Luis Ramirez', 'Calle 8 #45', 35, '4499876543', 1),
('Sofia Mendez', 'Av. Central #90', 22, '4495551234', 2),
('Carlos Perez', 'Calle 3 #12', 40, '4497778888', 2);

INSERT INTO asistencias (id_miembro, id_grupo, fecha, tipo, asistio) VALUES
(1, 1, '2026-07-22', 'grupo', TRUE),
(2, 1, '2026-07-22', 'grupo', FALSE),
(1, 1, '2026-07-26', 'domingo', TRUE),
(2, 1, '2026-07-26', 'domingo', TRUE),
(3, 2, '2026-07-23', 'grupo', TRUE),
(4, 2, '2026-07-23', 'grupo', TRUE),
(3, 2, '2026-07-26', 'domingo', FALSE);

INSERT INTO ofrendas (id_grupo, fecha, monto) VALUES
(1, '2026-07-22', 250.00),
(2, '2026-07-23', 180.00);
