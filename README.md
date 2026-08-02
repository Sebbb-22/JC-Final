# Grupos de Amistad

Sistema para administrar los Grupos de Amistad de la iglesia: el administrador da de alta los
grupos y sus líderes; cada líder registra a las personas de su grupo, toma asistencia (al grupo
de amistad y a la reunión del domingo) y registra las ofrendas recabadas. El administrador
consulta un reporte semanal con el estado de cada grupo.

Proyecto final — Bases de Datos Avanzadas.

## Integrantes

- Sebastián Trejo Herrera
- Luis Alfredo Herrera Encarnación
- Bryan Alexander Collis Guerrero

## Tecnologías

- **Base de datos:** MySQL
- **Backend:** NestJS + TypeScript + TypeORM + JWT (Passport)
- **Frontend:** React + Vite
- **Pruebas de API:** Postman

## Estructura del repositorio

```
database/   -> diagrama y scripts SQL (create_tables.sql, insert_data.sql)
backend/    -> API REST (Express + MySQL)
frontend/   -> interfaz web (React)
postman/    -> colección de pruebas de la API
```

Cada carpeta tiene su propio README con más detalle:
[database](database/README.md) · [backend](backend/README.md) · [frontend](frontend/README.md)

---

## Instalación desde cero

### 0. Requisitos previos

Instala esto antes de empezar:

- **Git** — https://git-scm.com/downloads
- **Node.js** (versión 18 o superior, incluye `npm`) — https://nodejs.org
- **MySQL** (servidor local corriendo) — https://dev.mysql.com/downloads/

Verifica que quedaron instalados:

```bash
git --version
node --version
npm --version
mysql --version
```

### 1. Descargar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd grupos-amistad
```

### 2. Crear la base de datos

```bash
mysql -u root -p < database/create_tables.sql
```

(Te pedirá la contraseña de tu usuario de MySQL. Esto crea la base `grupos_amistad` y sus tablas.)

### 3. Configurar e instalar el backend

```bash
cd backend
npm install
cp .env.example .env
```

Abre `backend/.env` y coloca tu usuario/contraseña de MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_de_mysql
DB_NAME=grupos_amistad
DB_PORT=3306
JWT_SECRET=cualquier_texto_largo_y_secreto
PORT=3000
```

Crea los usuarios iniciales (admin y líderes, con contraseña cifrada):

```bash
npm run seed
```

Carga los datos de ejemplo (grupos, miembros, asistencias, ofrendas):

```bash
mysql -u root -p < ../database/insert_data.sql
```

Levanta el backend:

```bash
npm run dev
```

Debe quedar corriendo en `http://localhost:3000`. Déjalo abierto en esa terminal.

### 4. Configurar e instalar el frontend

En **otra terminal**, desde la raíz del proyecto:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

### 5. Iniciar sesión

Usuarios de prueba creados por `npm run seed`:

| usuario | contraseña | rol |
|---|---|---|
| admin | admin123 | admin |
| jperez | lider123 | lider |
| mlopez | lider123 | lider |

---

## Probar la API con Postman

1. Abre Postman (o Bruno).
2. Importa el archivo [`postman/coleccion.json`](postman/coleccion.json).
3. Corre primero la request **Auth > Login admin** (o **Login lider**): guarda el token
   automáticamente en la variable de colección `token` para las demás peticiones.
4. Con el backend corriendo en `http://localhost:3000`, ejecuta el resto de las requests.

## Criterios cubiertos

| Criterio | Cómo se cubre |
|---|---|
| CRUD/ABCD + 2 consultas relacionales | CRUD completo de usuarios, grupos, miembros, asistencias y ofrendas. Consultas: **reporte semanal por grupo** (líder, ubicación, asistentes y ofrenda por grupo) y **grupos con menor asistencia** — ver `backend/src/controllers/reportes.controller.js` |
| Implementación avanzada | Autorización por rol a nivel de dato: un líder solo puede operar sobre su propio grupo, verificado contra la BD en cada operación (`GrupoAccessService`), no solo con el rol del JWT |
| Frontend funcional | Login, panel de administrador (grupos, reportes) y panel de líder (miembros, asistencia, ofrendas) |
| Innovación | El reporte semanal que antes armaba el admin a mano ahora se genera automáticamente desde el panel, con filtro de fechas |

## Base de datos — diagrama

Ver [`database/README.md`](database/README.md) para el diagrama del modelo y la descripción de
cada tabla.
