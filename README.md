# Backend – API REST en Node + Express + MongoDB

API creada con Express, JWT para autenticación y MongoDB como base de datos.  
Incluye manejo de usuarios, roles, autenticación y soporte para ambientes mediante `.env`.

---

## Tecnologías principales

- Node.js + Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- TypeScript

---

## Instalación

Cloná el repositorio:

```
git clone <https://github.com/SebasGarcia123/Back-Conexion360.git>
cd Back-Conexion360
```
Instalá dependencias

```
npm install
```

Migraciones de Base de Datos

Para generar las variables de entorno de desarrollo

```
npm run migrate-dev 
```

Podés ejecutarlas con:
```
npm run migrate up
```

Debes crear un nuevo archivo llamado .env

Dentro colocar:
```
# Entorno (development)
NODE_ENV=development

# Puerto del servidor
PORT=4000

# Clave secreta para firmar JWT
JWT_SECRET=conexion360-backendParaFinalDeProgramacion3
JWT_ISSUER=conexion360-api

# URL del servidor MongoDB
MONGO_URL=mongodb://127.0.0.1:27017/

# Nombre de la base dentro de Mongo
MONGO_DB_NAME= Conexion360
```

Ejecutar el servidor:
```
npm run dev
```
```
