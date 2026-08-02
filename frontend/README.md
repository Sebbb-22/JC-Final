# Frontend — Grupos de Amistad

Interfaz hecha con **React + Vite**, consume la API del backend por `fetch`.

## Requisitos

- Node.js 18 o superior
- El backend corriendo (ver [../backend/README.md](../backend/README.md))

## Instalación

```bash
cd frontend
npm install
```

## Configuración

```bash
cp .env.example .env
```

Por defecto apunta al backend local:

```
VITE_API_URL=http://localhost:3000
```

## Ejecutar

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador.

## Librerías usadas

| Librería | Uso |
|---|---|
| react / react-dom | UI |
| react-router-dom | Rutas (login, panel admin, panel líder) |
| vite | Servidor de desarrollo y build |

## Estructura

```
src/
  main.jsx               -> punto de entrada
  App.jsx                -> rutas y protección por rol
  api.js                  -> funciones fetch hacia el backend
  context/AuthContext.jsx -> sesión (token + usuario) en localStorage
  pages/
    Login.jsx
    AdminDashboard.jsx    -> grupos, reporte semanal, grupos con asistencia baja
    LiderDashboard.jsx    -> miembros del grupo, tomar asistencia, registrar ofrenda
```

## Capturas de pantalla

_Agregar aquí las capturas de la interfaz en ejecución (login, panel admin, panel líder) antes de
la entrega, en `frontend/capturas/`._

## Usuarios de prueba

Una vez corrido `npm run seed` en el backend:

| usuario | contraseña | rol |
|---|---|---|
| admin | admin123 | admin |
| jperez | lider123 | lider |
