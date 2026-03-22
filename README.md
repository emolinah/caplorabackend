# Caplora Backend

API REST para el sistema de gestión de proyectos y ciclo de vida de productos **Caplora**. Construida con Node.js, Express y Sequelize sobre MySQL.

## Stack

- **Runtime:** Node.js 20
- **Framework:** Express.js 4
- **ORM:** Sequelize 6 + MySQL2
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Archivos:** Multer + express-fileupload
- **PDF:** pdf-lib + puppeteer-core
- **Email:** Nodemailer + Handlebars

## Características

- Gestión de **proyectos**, **productos** y **procesos** con historial de cambios
- **Multi-tenant** por empresa con módulos configurables por cliente
- Control de acceso basado en roles (RBAC): `administracion`, `supervisor`, `operador`
- Carga y descarga de archivos con tracking de descargas
- Generación de PDFs
- Notificaciones por email con plantillas
- Sistema de etiquetas, checklists, recordatorios e imprevistos
- Rutas dinámicas por convención de nombres

## Módulos configurables por empresa

| Módulo | Flag |
|---|---|
| Cotización | `modulo_cotizacion` |
| Producción | `modulo_produccion` |
| Instalación | `modulo_instalacion` |
| Rectificación | `modulo_rectificacion` |
| Despacho | `modulo_despacho` |
| Multimedia | `modulo_multimedia` |
| Checklist | `modulo_checklist` |
| Etiquetas | `modulo_etiqueta` |

## Instalación local

### Requisitos
- Node.js 20+
- MySQL 8

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/emolinah/caplorabackend.git
cd caplorabackend

# Instalar dependencias
npm install

# Configurar la base de datos
# Editar config/db.js con tus credenciales
# O usar variables de entorno (ver sección Variables de entorno)

# Crear la base de datos en MySQL
mysql -u root -p -e "CREATE DATABASE caplora2;"

# Iniciar el servidor (Sequelize sincroniza las tablas automáticamente)
node server.js
```

El servidor queda disponible en `http://localhost:8081`.

## Variables de entorno

La base de datos puede configurarse mediante variables de entorno:

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `8081` | Puerto del servidor |
| `DB_HOST` | `localhost` | Host MySQL |
| `DB_PORT` | `3306` | Puerto MySQL |
| `DB_USER` | `root` | Usuario MySQL |
| `DB_PASSWORD` | `` | Contraseña MySQL |
| `DB_NAME` | `caplora2` | Nombre de la base de datos |

## Despliegue con Docker

### Requisitos
- Docker
- Docker Compose

### Levantar con Docker Compose

```bash
# Clonar el repositorio
git clone https://github.com/emolinah/caplorabackend.git
cd caplorabackend

# Copiar y configurar el archivo de secretos
cp middlewares/SK.example.js middlewares/SK.js
# Editar SK.js con tu secret JWT y configuración de email

# Levantar los servicios (app + MySQL)
docker compose up -d --build

# Ver logs
docker compose logs -f app
```

La API quedará disponible en `http://localhost:8081`.

> **Nota:** Editar las contraseñas de MySQL en `docker-compose.yml` antes de desplegar en producción.

## Estructura del proyecto

```
├── config/         Configuración de BD y app
├── controllers/    Handlers de rutas (18 archivos)
├── middlewares/    Auth, query builder, email, rutas dinámicas
├── models/         Modelos Sequelize (26 entidades)
├── modules/        Lógica de negocio por módulo
├── pdf/            Generación de PDF
├── uploads/        Archivos subidos por usuarios
├── routes.js       Configuración de rutas por rol
└── server.js       Entry point
```

## Autenticación

```
POST /auth/login
Body: { "usuario": "...", "clave": "..." }
Response: { "token": "...", "rol": "..." }
```

El token JWT debe enviarse en el header `Authorization: Bearer <token>` en todas las rutas protegidas.

## Convención de rutas

Las rutas se generan automáticamente según el rol y el nombre del método del controller:

```
POST   /{rol}/{entidad}_create
GET    /{rol}/{entidad}_index
GET    /{rol}/{entidad}_edit
PUT    /{rol}/{entidad}_update
DELETE /{rol}/{entidad}_delete
```

Ejemplo: `POST /administracion/producto_create`
