# Backend — Grupos de Amistad

API REST hecha con **NestJS + TypeScript**, conectada a **MySQL** vía **TypeORM**, con
autenticación por **JWT** (Passport) y control de acceso por rol (`admin` / `lider`).

## Requisitos

- Node.js 18 o superior
- MySQL corriendo localmente (o accesible por red)

## Instalación

```bash
cd backend
npm install
```

## Configuración

Copia el archivo de ejemplo y llena tus datos de conexión a MySQL:

```bash
cp .env.example .env
```

Edita `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_de_mysql
DB_NAME=grupos_amistad
DB_PORT=3306

JWT_SECRET=cualquier_texto_largo_y_secreto
PORT=3000
```

## Preparar la base de datos

1. Crea las tablas (desde la carpeta `database/`, ver [su README](../database/README.md)):
   ```bash
   mysql -u root -p < ../database/create_tables.sql
   ```
2. Crea los usuarios iniciales (admin y líderes) con contraseña cifrada:
   ```bash
   npm run seed
   ```
   Esto crea:
   | usuario | contraseña | rol |
   |---|---|---|
   | admin | admin123 | admin |
   | jperez | lider123 | lider |
   | mlopez | lider123 | lider |

   **Cambia estas contraseñas antes de usar el proyecto fuera de pruebas locales.**

3. Carga los datos de ejemplo (grupos, miembros, asistencias, ofrendas):
   ```bash
   mysql -u root -p < ../database/insert_data.sql
   ```

## Ejecutar el servidor

```bash
npm run dev       # con recarga automática (nest start --watch)
# o
npm run build && npm run start:prod
```

El servidor queda en `http://localhost:3000`.

## Librerías usadas

| Librería | Uso |
|---|---|
| @nestjs/core, @nestjs/common, @nestjs/platform-express | Framework NestJS |
| @nestjs/typeorm + typeorm + mysql2 | ORM y driver de conexión a MySQL |
| @nestjs/jwt, @nestjs/passport, passport, passport-jwt | Autenticación JWT |
| @nestjs/config | Variables de entorno (`.env`) |
| class-validator, class-transformer | Validación declarativa de los DTOs |
| bcryptjs | Hash de contraseñas |
| @nestjs/mapped-types | DTOs de actualización (`PartialType`) reutilizando los de creación |

## Estructura

```
src/
  main.ts                    -> arranca la app, CORS, ValidationPipe global
  app.module.ts               -> conexión a MySQL (TypeORM) y registro de módulos
  seed.ts                     -> crea usuarios iniciales con contraseña cifrada
  common/
    guards/                    -> JwtAuthGuard, RolesGuard
    decorators/                 -> @Roles(), @CurrentUser()
    services/grupo-access.service.ts -> verifica que un grupo sea del lider autenticado
  auth/                        -> login, estrategia JWT
  grupos/                      -> entity, dto, service, controller (incluye sub-recursos:
                                   /grupos/:id/miembros, /asistencias, /ofrendas)
  miembros/                    -> entity, dto, service, controller
  asistencias/                 -> entity, dto, service, controller
  ofrendas/                    -> entity, dto, service, controller
  reportes/                    -> las 2 consultas relacionales (SQL crudo via TypeORM DataSource)
  usuarios/entities/usuario.entity.ts -> entidad compartida (login y relación "lider" de un grupo)
```

Cada entidad sigue el patrón **Controller → Service → Repository** con inyección de
dependencias, igual que en los ejercicios de NestJS de la otra materia (Aplicaciones Web
Orientadas a Servicios).

## Endpoints principales

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | /auth/login | público | Login, retorna JWT |
| GET | /grupos | admin/lider | Admin ve todos, líder solo el suyo |
| POST | /grupos | admin | Crear grupo |
| GET | /grupos/:id | admin/lider | Detalle de un grupo (líder solo el suyo) |
| PUT / DELETE | /grupos/:id | admin | Editar / eliminar grupo |
| GET | /grupos/:id/miembros | admin/lider | Miembros de un grupo |
| POST | /miembros | lider | Registrar miembro en su grupo |
| PUT / DELETE | /miembros/:id | lider | Editar / eliminar miembro de su grupo |
| POST | /asistencias | lider | Registrar asistencia (grupo o domingo) |
| POST | /ofrendas | lider | Registrar ofrenda del grupo |
| GET | /reportes/semanal?inicio=&fin= | admin | Reporte semanal por grupo |
| GET | /reportes/asistencia-baja | admin | Grupos con menor asistencia |

Colección de Postman con ejemplos de cada request: [`../postman/coleccion.json`](../postman/coleccion.json).

## Feature avanzada (no vista en clase)

Autorización por rol **a nivel de dato**: un `lider` solo puede leer/escribir información de
**su propio grupo** (miembros, asistencias, ofrendas). Esto no depende solo del rol en el JWT
— cada operación verifica contra la base de datos que el grupo le pertenece, vía
`GrupoAccessService` (`src/common/services/grupo-access.service.ts`), inyectado en los
services de `miembros`, `asistencias` y `ofrendas`. Además, el password de los usuarios
se marca `select: false` en la entidad para que nunca se filtre por accidente en respuestas
que incluyan la relación `lider` de un grupo (solo `auth.service.ts` lo pide explícitamente
para comparar el login).
