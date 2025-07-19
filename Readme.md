# ChatApp

Una aplicación de chat en tiempo real construida con ASP.NET Core y React, utilizando SignalR para comunicación en tiempo real.

## 🚀 Características

- 💬 Chat en tiempo real con SignalR
- 🔐 Autenticación JWT
- 👥 Gestión de usuarios
- 🎨 Interfaz moderna con React y TypeScript
- 📱 Diseño responsivo
- 🔒 Rutas protegidas
- 🗄️ Base de datos PostgreSQL con Entity Framework Core

## 🏗️ Arquitectura

### Backend (ASP.NET Core 9.0)

- **API REST** para autenticación y gestión de usuarios
- **SignalR Hub** para comunicación en tiempo real
- **Entity Framework Core** con PostgreSQL
- **JWT Authentication** para seguridad
- **AutoMapper** para mapeo de DTOs

### Frontend (React + TypeScript)

- **React 19** con TypeScript
- **Vite** como bundler
- **React Router** para navegación
- **SignalR Client** para conexión en tiempo real
- **Axios** para llamadas HTTP
- **SweetAlert2** para alertas

## 📁 Estructura del Proyecto

```
ChatApp/
├── chatAppBakend/          # Backend API
│   ├── Controllers/        # Controladores de la API
│   ├── Data/              # Contexto de base de datos
│   ├── DTOs/              # Data Transfer Objects
│   ├── Hubs/              # SignalR Hubs
│   ├── Models/            # Modelos de datos
│   ├── Services/          # Servicios de negocio
│   └── Migrations/        # Migraciones de EF Core
└── ChatAppWeb/            # Frontend React
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── context/       # Context de React
    │   ├── hooks/         # Custom hooks
    │   ├── navigation/    # Configuración de rutas
    │   ├── screens/       # Pantallas principales
    │   └── service/       # Servicios de SignalR
    └── public/            # Archivos estáticos
```

## 🛠️ Tecnologías Utilizadas

### Backend

- ASP.NET Core 9.0
- Entity Framework Core 9.0
- PostgreSQL (Npgsql)
- SignalR
- JWT Authentication
- AutoMapper
- Swagger/OpenAPI

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- SignalR Client (@microsoft/signalr)
- Axios
- SweetAlert2

## 🚀 Instalación y Configuración

### Prerrequisitos

- .NET 9.0 SDK
- Node.js (versión 18 o superior)
- PostgreSQL
- Git

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ChatApp
```

### 2. Configurar el Backend

```bash
cd chatAppBakend
```

#### Configurar la base de datos

1. Crear una base de datos PostgreSQL
2. Actualizar la cadena de conexión en `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=ChatAppDB;Username=your_username;Password=your_password"
  },
  "Jwt": {
    "Key": "development-super-secret-key-here-minimum-32-chars",
    "Issuer": "chat-app",
    "Audience": "chat-app-client"
  }
}
```

#### Ejecutar migraciones

```bash
dotnet ef database update
```

#### Instalar dependencias y ejecutar

```bash
dotnet restore
dotnet run
```

El backend estará disponible en `https://localhost:5001`

### 3. Configurar el Frontend

```bash
cd ../ChatAppWeb
```

#### Instalar dependencias

```bash
npm install
```

#### Ejecutar en modo desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📋 Scripts Disponibles

### Backend

```bash
# Restaurar dependencias
dotnet restore

# Ejecutar en desarrollo
dotnet run

# Compilar
dotnet build

# Crear migración
dotnet ef migrations add <MigrationName>

# Actualizar base de datos
dotnet ef database update
```

### Frontend

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar compilación
npm run preview

# Linting
npm run lint
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno (Backend)

Crear `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=ChatAppDB;Username=dev_user;Password=dev_password"
  },
  "Jwt": {
    "Key": "development-super-secret-key-here-minimum-32-chars",
    "Issuer": "chat-app",
    "Audience": "chat-app-client"
  }
}
```

## 🔐 Autenticación

La aplicación utiliza JWT para autenticación:

1. **Registro**: Los usuarios pueden registrarse con email y contraseña
2. **Login**: Autenticación retorna un JWT token
3. **Protección**: Las rutas protegidas requieren token válido
4. **SignalR**: Autenticación también aplicada a conexiones SignalR

## 📡 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/{id}` - Obtener usuario por ID

### Mensajes

- `POST /api/messages` - Enviar mensaje
- `GET /api/messages` - Obtener mensajes

### SignalR Hub

- `/chatHub` - Conexión para chat en tiempo real

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un issue en GitHub con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Screenshots (si aplica)

## 📞 Contacto

- Autor: [Tu Nombre]
- Email: [tu-email@ejemplo.com]
- GitHub: [@tu-usuario]

---

⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub!
