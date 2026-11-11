# Fly Away Travel – Frontend

Frontend del laboratorio de la semana 14 de CS2031: una aplicación web para registrarse, buscar vuelos y reservarlos usando la API de [Fly Away](https://github.com/CS2031-DBP/cs2031-2026-2-week14-fly-away-backend).

Hecho con React 19, TypeScript, Vite, Axios, React Router y Tailwind CSS.

## Requisitos

- Node.js 20.19+ o 22.12+
- El backend de Fly Away corriendo en `http://localhost:8080` (necesita JDK 26)

## Cómo correrlo

1. Levanta el backend en una terminal:

   ```bash
   git clone https://github.com/CS2031-DBP/cs2031-2026-2-week14-fly-away-backend.git
   cd cs2031-2026-2-week14-fly-away-backend
   ./mvnw spring-boot:run
   ```

2. En otra terminal, levanta el frontend:

   ```bash
   git clone https://github.com/marcobautista-sketch/flyawaysem14.git
   cd flyawaysem14
   npm install
   npm run dev
   ```

3. Abre http://localhost:5173.

Para probar sin registrarte puedes usar la cuenta `ana.garcia@utec.edu.pe` con la contraseña `Password1`.

## Funcionalidades

| Pantalla | Ruta | Qué hace |
|----------|------|----------|
| Registro | `/register` | Valida campos vacíos, muestra los errores del backend y, si todo sale bien, muestra un mensaje y lleva al login. |
| Login | `/login` | Guarda el token en `localStorage`, muestra el error si las credenciales no son válidas y redirige a la búsqueda. El nombre del usuario aparece en la barra de navegación. |
| Búsqueda | `/search` | Filtra por número de vuelo, aerolínea y rango de fechas de salida. Muestra un mensaje cuando no hay resultados. |
| Reserva | `/search` | Botón "Reservar" en cada vuelo, visible solo con sesión iniciada. Muestra el ID de la reserva o el error del backend (vuelo pasado, horario superpuesto). |
| Detalle de reserva | `/bookings/:id` | Muestra los datos de una reserva. Ruta protegida. |
| Mis reservas | `/bookings` | Lista las reservas del usuario a partir de los IDs guardados en `localStorage`. Ruta protegida. |
| Cerrar sesión | barra de navegación | Borra el token y vuelve al login. |

Las rutas protegidas redirigen al login si no hay token. Si el backend responde `403` (token inválido o vencido), la sesión se cierra sola.

## Estructura

```
src/
├── api.ts            # instancia de Axios con el token y el manejo del 403
├── types.ts          # tipos de las respuestas del backend
├── components/       # Navbar, ProtectedRoute, FlightTable, FormField, Alert
├── context/          # AuthContext: token y usuario actual
├── hooks/            # useAuth
├── pages/            # una página por pantalla
├── services/         # llamadas a la API (auth y vuelos)
└── utils/            # mensajes de error, formato de fechas, reservas en localStorage
```

## Notas

- El backend no tiene un endpoint para listar las reservas de un usuario. Por eso los IDs se guardan en `localStorage` con la clave `bookings:<email>`, una lista por usuario.
- Las fechas del filtro se envían en formato ISO-8601 (`toISOString()`), que es el que acepta el backend.
- La base de datos del backend vive en memoria: al reiniciarlo se borran los usuarios y reservas creados.
