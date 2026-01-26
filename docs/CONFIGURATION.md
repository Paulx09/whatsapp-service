# ⚙️ Guía de Configuración

## Tabla de Contenidos

- [Variables de Entorno](#variables-de-entorno)
- [Configuración de Usuarios](#configuración-de-usuarios)
- [Configuración de WhatsApp](#configuración-de-whatsapp)
- [Configuración de Seguridad](#configuración-de-seguridad)
- [Configuración de Archivos](#configuración-de-archivos)
- [Configuración de PM2](#configuración-de-pm2)
- [Configuración de Docker](#configuración-de-docker)
- [Troubleshooting](#troubleshooting)

---

## Variables de Entorno

### Archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Servidor
PORT=5111
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion

# Base URL (para imágenes)
BASE_URL=http://localhost:5111

# CORS - Orígenes permitidos (separados por comas)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

# Usuario estándar
USER_USERNAME=usuario
USER_PASSWORD=usuario123
USER_ROLE=user

# Usuario administrador
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_ROLE=admin
```

### Archivo .env.example

```bash
# Servidor
PORT=5111
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Base URL
BASE_URL=http://localhost:5111

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Usuario
USER_USERNAME=usuario
USER_PASSWORD=usuario123
USER_ROLE=user

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_ROLE=admin
```

### Variables Requeridas

| Variable | Tipo | Requerida | Default | Descripción |
|----------|------|-----------|---------|-------------|
| `PORT` | number | No | 5111 | Puerto del servidor |
| `NODE_ENV` | string | No | development | Entorno de ejecución |
| `JWT_SECRET` | string | Sí | - | Secreto para firmar JWT |
| `BASE_URL` | string | Sí | - | URL base para imágenes |
| `ALLOWED_ORIGINS` | string | No | localhost:3000 | Orígenes CORS permitidos |
| `USER_USERNAME` | string | No | usuario | Usuario estándar |
| `USER_PASSWORD` | string | No | usuario123 | Contraseña usuario |
| `USER_ROLE` | string | No | user | Rol de usuario |
| `ADMIN_USERNAME` | string | No | admin | Usuario administrador |
| `ADMIN_PASSWORD` | string | No | admin123 | Contraseña admin |
| `ADMIN_ROLE` | string | No | admin | Rol de administrador |

### Validación de Variables

Al iniciar, el sistema valida las variables de entorno:

```javascript
// src/config/auth.config.js
AUTH_CONFIG.validateConfig();

// Output en consola:
// ✅ Configuración de autenticación cargada:
//    - usuario (user)
//    - admin (admin)
```

---

## Configuración de Usuarios

### Usuarios Predeterminados

El sistema incluye dos usuarios configurables:

#### Usuario Estándar
- **Username:** `usuario` (configurable)
- **Password:** `usuario123` (configurable)
- **Rol:** `user`
- **Permisos:**
  - Ver estado de QR
  - Ver estado de conexión
  - Consultar plantillas

#### Usuario Administrador
- **Username:** `admin` (configurable)
- **Password:** `admin123` (configurable)
- **Rol:** `admin`
- **Permisos:**
  - Todos los permisos de usuario
  - Generar QR
  - Enviar mensajes
  - Expirar QR
  - Ver historial
  - Forzar reconexión
  - Resetear autenticación

### Cambiar Credenciales

#### Desarrollo
Edita el archivo `.env`:

```bash
ADMIN_USERNAME=mi_admin
ADMIN_PASSWORD=contraseña_super_segura
```

#### Producción
Usa variables de entorno del sistema:

```bash
export ADMIN_USERNAME=admin_prod
export ADMIN_PASSWORD=contraseña_super_ultra_segura
```

O en Docker:

```bash
docker run -e ADMIN_USERNAME=admin_prod \
           -e ADMIN_PASSWORD=contraseña_segura \
           whatsapp-service
```

### Agregar Más Usuarios

Actualmente el sistema solo soporta 2 usuarios. Para agregar más:

1. Edita `src/config/auth.config.js`:

```javascript
export const AUTH_CONFIG = {
  users: [
    {
      username: process.env.USER_USERNAME || 'usuario',
      password: process.env.USER_PASSWORD || 'usuario123',
      role: process.env.USER_ROLE || 'user'
    },
    {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: process.env.ADMIN_ROLE || 'admin'
    },
    // Agregar nuevo usuario
    {
      username: process.env.MANAGER_USERNAME || 'manager',
      password: process.env.MANAGER_PASSWORD || 'manager123',
      role: process.env.MANAGER_ROLE || 'manager'
    }
  ]
};
```

2. Actualiza `.env`:

```bash
MANAGER_USERNAME=manager
MANAGER_PASSWORD=manager123
MANAGER_ROLE=manager
```

---

## Configuración de WhatsApp

### Configuración de Conexión

Archivo: `src/config/whatsapp.config.js`

```javascript
export function getWhatsAppConfig() {
  return {
    printQRInTerminal: true,  // Imprimir QR en terminal
    browser: ['WhatsApp Service', 'Chrome', '1.0.0'],
    connectTimeoutMs: 60000,   // Timeout de conexión: 60s
    qrTimeout: 60000,          // Timeout de QR: 60s
    
    // Opciones de reconexión
    retryRequestDelayMs: 250,
    maxRetries: 5,
    
    // Logging
    logger: {
      level: 'error',  // 'trace' | 'debug' | 'info' | 'warn' | 'error'
      stream: process.stderr
    }
  };
}
```

### Personalizar Configuración

```javascript
// src/config/whatsapp.config.js
export function getWhatsAppConfig() {
  return {
    // Tu navegador personalizado
    browser: ['Mi App', 'Safari', '2.0.0'],
    
    // Aumentar timeout
    connectTimeoutMs: 120000,
    qrTimeout: 120000,
    
    // Más reintentos
    maxRetries: 10,
    
    // Más logging
    logger: {
      level: 'debug'
    }
  };
}
```

### Autenticación Persistente

Los datos de autenticación se guardan automáticamente en:

```
auth_info/
├── creds.json
└── app-state-sync-key-*.json
```

**Importante:** Respalda esta carpeta para mantener la sesión.

### Resetear Autenticación

```bash
# Opción 1: Eliminar carpeta
rm -rf auth_info/

# Opción 2: Via API
POST /api/auth/reset
Authorization: Bearer <admin_token>
```

---

## Configuración de Seguridad

### JWT

#### Generar Secreto Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

#### Configuración JWT

```javascript
// Tiempo de expiración
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '24h'  // Cambiar según necesidad
});
```

### CORS

#### Configuración Básica

```bash
# .env
ALLOWED_ORIGINS=http://localhost:3000
```

#### Múltiples Orígenes

```bash
# .env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://miapp.com
```

#### Configuración Avanzada

```javascript
// src/app.js
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600  // 10 minutos
}));
```

### Rate Limiting

#### Configuración Actual

```javascript
// src/app.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // 100 requests
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/qr-status';
  }
});
```

#### Personalizar Rate Limit

```javascript
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutos
  max: 50,                    // 50 requests
  message: 'Demasiadas solicitudes, intenta más tarde',
  
  // Rate limit por IP
  keyGenerator: (req) => req.ip,
  
  // Rate limit por usuario
  keyGenerator: (req) => {
    return req.user?.userId || req.ip;
  }
});
```

### Helmet

```javascript
// src/app.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## Configuración de Archivos

### Multer (Upload de Imágenes)

Archivo: `src/config/message.config.js`

```javascript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/imagenes_dashboard/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024  // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo imágenes JPEG y PNG'));
    }
  }
});
```

### Cambiar Límites

```javascript
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB
    files: 5                      // Máximo 5 archivos
  }
});
```

### Cambiar Tipos Permitidos

```javascript
fileFilter: (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  // ...
}
```

---

## Configuración de PM2

Archivo: `ecosystem.config.js`

```javascript
export default {
  apps: [{
    name: 'whatsapp-service',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Variables de entorno
    env: {
      NODE_ENV: 'development',
      PORT: 5111
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5111
    },
    
    // Logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Reintentos
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Timeouts
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Node args
    node_args: '--max-old-space-size=4096 --trace-warnings'
  }]
};
```

### Personalizar PM2

```javascript
// Más memoria
node_args: '--max-old-space-size=8192'

// Watch mode (desarrollo)
watch: true,
ignore_watch: ['node_modules', 'logs', 'auth_info'],

// Cluster mode (no recomendado para este proyecto)
instances: 'max',  // Usar todos los CPUs
exec_mode: 'cluster',
```

---

## Configuración de Docker

### Dockerfile

```dockerfile
FROM node:22-alpine

# Instalar herramientas
RUN apk add --no-cache \
    ca-certificates \
    curl \
    bash \
    tzdata \
    tini && \
    update-ca-certificates

WORKDIR /app

# Copiar package.json y patches
COPY package*.json ./
COPY patches ./patches

# Instalar dependencias
RUN npm ci --omit=dev

# Copiar código
COPY . .

# Puerto
EXPOSE 5111

# Init process
ENTRYPOINT ["/sbin/tini", "--"]

# Ejecutar
CMD ["node", "index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  whatsapp-service:
    build: .
    container_name: whatsapp-service
    ports:
      - "5111:5111"
    environment:
      - NODE_ENV=production
      - PORT=5111
      - JWT_SECRET=${JWT_SECRET}
      - BASE_URL=http://localhost:5111
      - ALLOWED_ORIGINS=http://localhost:3000
    volumes:
      - ./auth_info:/app/auth_info
      - ./logs:/app/logs
      - ./src/public:/app/src/public
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5111/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Variables en Docker

```bash
# .env para docker-compose
JWT_SECRET=tu_secreto_aqui
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password_seguro
```

---

## Troubleshooting

### Problema: QR no se genera

**Solución:**
```bash
# 1. Verificar logs
pm2 logs whatsapp-service

# 2. Verificar permisos de auth_info/
chmod -R 755 auth_info/

# 3. Eliminar sesión y reintentar
rm -rf auth_info/
pm2 restart whatsapp-service
```

### Problema: No se puede conectar

**Solución:**
```bash
# 1. Verificar firewall
sudo ufw status
sudo ufw allow 5111

# 2. Verificar puerto
netstat -tuln | grep 5111
lsof -i :5111

# 3. Verificar logs de Baileys
# Cambiar nivel de log en whatsapp.config.js
logger: { level: 'debug' }
```

### Problema: JWT inválido

**Solución:**
```bash
# 1. Verificar JWT_SECRET en .env
cat .env | grep JWT_SECRET

# 2. Generar nuevo token
POST /api/auth/login

# 3. Verificar expiración
# JWT expira en 24h por defecto
```

### Problema: Rate limit excedido

**Solución:**
```javascript
// Aumentar límite en src/app.js
const limiter = rateLimit({
  max: 200  // Aumentar a 200
});

// O excluir endpoint específico
skip: (req) => {
  return req.path.startsWith('/api/send-');
}
```

### Problema: Imágenes no se cargan

**Solución:**
```bash
# 1. Verificar permisos
chmod -R 755 src/public/

# 2. Verificar BASE_URL
echo $BASE_URL

# 3. Verificar ruta
curl http://localhost:5111/public/imagenes/test.jpg
```

### Problema: PM2 no inicia

**Solución:**
```bash
# 1. Ver errores
pm2 logs whatsapp-service --err

# 2. Verificar sintaxis
node --check index.js

# 3. Verificar dependencias
npm install

# 4. Limpiar PM2
pm2 delete all
pm2 flush
pm2 start ecosystem.config.js
```

---

## Recursos Adicionales

- [Documentación Express](https://expressjs.com/)
- [Documentación Baileys](https://github.com/WhiskeySockets/Baileys)
- [Documentación Socket.IO](https://socket.io/docs/)
- [Documentación PM2](https://pm2.keymetrics.io/)
- [Documentación Docker](https://docs.docker.com/)
