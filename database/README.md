# Base de datos — Grupos de Amistad

Motor: **MySQL** (probado con MySQL 8/9).

## Diagrama del modelo

```
usuarios (id, nombre, username, password, rol['admin'|'lider'])
   |
   | 1:N (un lider puede liderar 1 o mas grupos)
   v
grupos (id, nombre, id_lider FK, dia_semana, hora, ubicacion)
   |
   | 1:N
   v
miembros (id, nombre, direccion, edad, telefono, id_grupo FK)
   |
   | 1:N
   +--> asistencias (id, id_miembro FK, id_grupo FK, fecha, tipo['grupo'|'domingo'], asistio)

grupos 1:N ofrendas (id, id_grupo FK, fecha, monto)
```

## Archivos

| Archivo | Contenido |
|---|---|
| `create_tables.sql` | Crea la base de datos `grupos_amistad` y las 5 tablas con sus llaves foraneas. |
| `insert_data.sql` | Datos de ejemplo para `grupos`, `miembros`, `asistencias` y `ofrendas`. |

Los usuarios (`admin`, lideres) **no** se crean aqui porque su contraseña debe guardarse cifrada
(bcrypt). Se crean con el script `npm run seed` del backend — ver [../backend/README.md](../backend/README.md).

## Como ejecutarlo manualmente

```bash
mysql -u root -p < create_tables.sql
# despues de correr "npm run seed" en el backend (crea los usuarios):
mysql -u root -p < insert_data.sql
```

(El README de la raíz del repositorio incluye el flujo completo de instalación en orden.)
