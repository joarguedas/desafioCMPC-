# 📚 CMPC-libros

Sistema de gestión de libros desarrollado en una arquitectura fullstack moderna. Incluye autenticación, administración de usuarios, libros, autores, géneros, editoriales y sistema de logs, con exportación CSV, carga de imágenes, y frontend React con Material UI.

---

## 🧱 Tecnologías Utilizadas

- **Backend:** NestJS, TypeScript, PostgreSQL, Sequelize ORM
- **Frontend:** React, TypeScript, Material UI
- **Autenticación:** JWT
- **DevOps:** Docker, Docker Compose
- **Documentación:** Swagger
- **ORM Diagrama:** dbdiagram.io

---

## ⚙️ Instalación y Configuración

### Requisitos

- Node.js >= 18
- Docker + Docker Compose
- Git

.env (backend)

# Base de datos db : 5432 o localhost : 5435
DATABASE_HOST=localhost
DATABASE_PORT=5435
DATABASE_USER=cmpc_user
DATABASE_PASSWORD=cmpc_pass
DATABASE_NAME=cmpc_books

# Sequelize pool (opcional, pero recomendable en producción)
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Logging de Sequelize (solo si lo implementas)
TYPEORM_LOGGING=true

# App
JWT_SECRET=supersecret
PORT=3000

# Entorno (development o production)
NODE_ENV=development

# Usuario Default
DEFAULT_ADMIN_EMAIL=admin@admin.com
DEFAULT_ADMIN_PASSWORD=admin123


.env (frontend)

VITE_API_URL=http://localhost:3000

🐳 Uso con Docker
Levantar toda la aplicación (frontend + backend + base de datos):

docker-compose up --build
Esto creará los siguientes servicios:

backend en http://localhost:3000

frontend en http://localhost:5173

postgres (base de datos)

🚀 Guía de Uso
Usuarios y Roles
Usuario con rol admin o superadmin puede:

Crear/editar/eliminar libros

Administrar usuarios, logs y entidades relacionadas

Usuario con rol user puede:

Visualizar información y filtrar libros

Funcionalidades destacadas
🔒 Autenticación segura con JWT

📄 Exportación CSV de registros filtrados

🧠 Carga y gestión de imágenes (URL)

📝 Logs de auditoría por cada acción relevante

🔍 Filtros avanzados y paginación

🎨 UI limpia y responsiva (Material UI)

🧪 Documentación de API (Swagger)
El backend NestJS expone Swagger en:
http://localhost:3000/docs
Incluye documentación de todos los endpoints RESTful, parámetros, tipos, autenticación, y respuestas.


🗃️ Modelo Relacional (dbdiagram.io)
Puedes importar el siguiente modelo en dbdiagram.io:


Table books {
  id int [pk, increment]
  title varchar
  isbn varchar
  description text
  price int
  stock int
  publishedAt date
  imageUrl varchar
  genreId int [ref: > genres.id]
  authorId int [ref: > authors.id]
  publisherId int [ref: > publishers.id]
  status boolean
  createdAt timestamp
  updatedAt timestamp
}

Table genres {
  id int [pk, increment]
  name varchar
}

Table authors {
  id int [pk, increment]
  name varchar
}

Table publishers {
  id int [pk, increment]
  name varchar
}

Table users {
  id int [pk, increment]
  email varchar
  password varchar
  role varchar
  createdAt timestamp
  updatedAt timestamp
}

Table logs {
  id int [pk, increment]
  table varchar
  action varchar
  description text
  userId int [ref: > users.id]
  createdAt timestamp
}


🏗️ Arquitectura del Sistema y Decisiones de Diseño
La aplicación CMPC Libros está diseñada como una solución web full-stack moderna y escalable, implementada con una arquitectura en capas clara que separa responsabilidades entre frontend, backend y persistencia de datos. A continuación se detalla la arquitectura y las decisiones clave adoptadas:

🧩 Arquitectura General
Frontend:
Desarrollado en React con TypeScript, utilizando Material UI para una experiencia de usuario moderna, responsiva y accesible. Las funcionalidades principales incluyen:

Autenticación JWT.

Panel de administración con CRUD completo para libros, autores, géneros, editoriales y usuarios.

Exportación CSV con filtros.

Paginación y búsqueda avanzada.

Modal genérico reutilizable (GenericFormDialog) para formularios consistentes.

Backend:
Implementado con NestJS y Sequelize como ORM para PostgreSQL. El backend expone APIs RESTful seguras y estructuradas:

Arquitectura modular: cada recurso (libros, usuarios, logs, etc.) tiene su propio módulo.

Middleware de autenticación y autorización basado en JWT.

Validación con DTOs y class-validator.

Sistema de logging automático para auditoría de acciones críticas (con controlador para consulta).

Exportación de datos en CSV (text/csv) mediante filtros.

Base de Datos:
PostgreSQL, con modelo relacional normalizado. Las tablas principales incluyen:

books, authors, genres, publishers, users, logs.

Uso de claves foráneas, soft delete (status: boolean), timestamps (createdAt, updatedAt), e índices para mejorar rendimiento de filtros.

Autenticación y Seguridad:

Login con JWT (usuario y contraseña).

Protección de rutas con guards según roles (user, admin, superadmin).

Headers con Bearer Token para todas las peticiones protegidas.

Logging de Auditoría:

Registro automático de operaciones relevantes (create, update, delete) con metainformación (tabla, acción, usuario, descripción).

Endpoint protegido para listar logs con filtros avanzados y exportación CSV.

Infraestructura:

Contenedores con Docker y Docker Compose para facilitar despliegue y desarrollo local.

.env para configuración segura y flexible.

Almacenamiento de imágenes mediante URLs, listas para integrar con servicios como S3 o almacenamiento local.

🎯 Decisiones de Diseño
Separación de responsabilidades
Se priorizó una arquitectura modular y desacoplada para facilitar mantenimiento, escalabilidad y pruebas.

Reutilización de componentes
El componente GenericFormDialog permite definir formularios genéricos reutilizables a partir de un esquema, reduciendo duplicación de código.

Seguridad y trazabilidad
JWT asegura cada llamada a la API, y el sistema de logging garantiza trazabilidad en acciones críticas del sistema.

Escalabilidad
La estructura modular tanto en frontend como en backend permite agregar nuevas entidades o funcionalidades fácilmente.

Facilidad de desarrollo y despliegue
Se utilizó Docker para estandarizar el entorno y facilitar tanto el desarrollo local como el despliegue a producción.

