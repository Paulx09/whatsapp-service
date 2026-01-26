# 📝 CHANGELOG

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-01-17

### ✨ Agregado

#### Funcionalidades Principales
- Conexión con WhatsApp Web mediante Baileys 6.7.21
- Sistema de autenticación JWT con roles (Admin/User)
- API RESTful completa con Express 5.1
- WebSocket con Socket.IO para actualizaciones en tiempo real
- Sistema de QR con gestión inteligente de tiempo (60s)
- Chatbot conversacional automático con timeout
- Sistema de plantillas de mensajes multi-nivel
- Soporte para envío de imágenes con Multer
- Rate limiting configurable
- Logging estructurado con Winston

#### Seguridad
- Helmet.js para headers HTTP seguros
- CORS configurable por orígenes
- Validación de datos con Express Validator
- Límite de tamaño de archivos (50MB)
- Protección contra spam con rate limiting

#### Monitoreo y Logs
- Logger Winston con niveles configurables
- Tracking de mensajes enviados
- Estados de conexión en tiempo real
- Métricas de QR (tiempo, porcentaje, urgencia)

#### Deployment
- Configuración PM2 con reintentos automáticos
- Dockerfile optimizado con Node 22 Alpine
- docker-compose.yml para fácil deployment
- Variables de entorno configurables

#### Documentación
- README completo con ejemplos
- Documentación de API detallada
- Guía de arquitectura del sistema
- Guía de configuración exhaustiva
- Ejemplos de uso en múltiples lenguajes

### 🔄 Endpoints API

#### Autenticación
- `POST /api/auth/login` - Login y generación de JWT
- `GET /api/auth/me` - Información del usuario actual

#### QR Management
- `POST /api/qr-request` - Generar nuevo QR
- `GET /api/qr-status` - Estado del QR en tiempo real
- `POST /api/qr-expire` - Expirar QR manualmente
- `GET /api/qr-code` - Obtener imagen del QR
- `GET /api/auth-status` - Estado de autenticación WhatsApp

#### Mensajería
- `POST /api/send-message` - Enviar mensaje con plantilla
- `POST /api/send-message-image` - Enviar mensaje con imagen
- `POST /api/send-message-accept` - Mensaje de aceptación
- `POST /api/send-message-reject` - Mensaje de rechazo
- `POST /api/send-image` - Enviar solo imagen
- `GET /api/sent-messages` - Historial de mensajes
- `GET /api/templates` - Lista de plantillas
- `GET /api/status` - Estado general del servicio

#### Gestión de Conexión
- `POST /api/force-reconnect` - Forzar reconexión
- `GET /api/reconnection-status` - Estado de reconexión
- `POST /api/auth/reset` - Resetear autenticación

### 🤖 Chatbot

#### Flujo Conversacional
- Menú principal: Desarrollo, Tester, Diseño, Marketing
- Sub-menús por categoría
- Timeout de 60 segundos por inactividad
- Cierre automático de conversaciones
- Gestión de estado por usuario

### 📱 Plantillas

#### 4 Plantillas de Servicio
1. **Diseño y Desarrollo Web** - 3 mensajes de seguimiento
2. **Gestión de Redes Sociales** - 3 mensajes de seguimiento
3. **Marketing y Gestión Digital** - 3 mensajes de seguimiento
4. **Branding y Diseño** - 3 mensajes de seguimiento

Cada plantilla incluye:
- Mensajes progresivos
- Imágenes personalizadas
- Variables dinámicas ({nombre}, {fecha}, {hora})

### 🔧 Configuración

#### Variables de Entorno
- `PORT` - Puerto del servidor (default: 5111)
- `NODE_ENV` - Entorno de ejecución
- `JWT_SECRET` - Secreto para JWT (requerido)
- `BASE_URL` - URL base para imágenes
- `ALLOWED_ORIGINS` - Orígenes CORS permitidos
- Credenciales de usuario y admin configurables

#### PM2
- Reinicio automático en caso de fallo
- Límite de memoria: 1GB (configurable)
- Logging rotativo
- Max 10 reintentos con delay de 4s

#### Docker
- Imagen basada en Node 22 Alpine
- Soporte para tini como init process
- Volúmenes para auth_info/, logs/, y public/
- Health checks configurados

### 🛠️ Dependencias

#### Principales
- `@whiskeysockets/baileys@6.7.21` - Cliente WhatsApp
- `express@5.1.0` - Framework web
- `socket.io@4.8.1` - WebSocket
- `jsonwebtoken@9.0.2` - Autenticación JWT
- `multer@2.0.2` - Upload de archivos
- `qrcode@1.5.4` - Generación de QR
- `helmet@8.1.0` - Seguridad HTTP
- `cors@2.8.5` - Cross-Origin Resource Sharing
- `express-rate-limit@8.0.1` - Rate limiting
- `express-validator@7.2.1` - Validación de datos
- `dotenv@17.2.1` - Variables de entorno

### 📚 Documentación

#### Archivos Creados
- `README.md` - Documentación principal
- `docs/API.md` - Documentación completa de API
- `docs/ARCHITECTURE.md` - Guía de arquitectura
- `docs/CONFIGURATION.md` - Guía de configuración
- `docs/EXAMPLES.md` - Ejemplos de uso
- `CHANGELOG.md` - Historial de cambios
- `.env.example` - Ejemplo de variables de entorno

### 🔒 Seguridad

- Validación de formato de teléfono (Perú: 51XXXXXXXXX)
- Sanitización de inputs
- Rate limiting: 100 requests / 15 minutos
- Timeout de QR: 60 segundos
- JWT con expiración de 24 horas
- Headers de seguridad con Helmet
- CORS restrictivo

### 🐛 Correcciones

- Manejo robusto de desconexiones
- Limpieza automática de QR expirados
- Reintentos automáticos de reconexión (max 5)
- Gestión de memoria optimizada
- Prevención de fugas de memoria en conversaciones

---

## [Unreleased]

### 🚀 Próximas Características

- [ ] Base de datos para persistencia (PostgreSQL/MongoDB)
- [ ] Redis para estado compartido
- [ ] Storage en la nube (AWS S3)
- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Documentación OpenAPI/Swagger
- [ ] Circuit breaker para Baileys
- [ ] Métricas con Prometheus
- [ ] Dashboard con Grafana
- [ ] Soporte para múltiples idiomas
- [ ] Plantillas personalizables desde API
- [ ] Programación de mensajes
- [ ] Webhooks para eventos
- [ ] Soporte para grupos de WhatsApp
- [ ] Respuestas automáticas avanzadas

### 🔧 Mejoras Planeadas

- [ ] Migrar a TypeScript
- [ ] Agregar ESLint y Prettier
- [ ] Mejorar cobertura de tests
- [ ] Optimizar rendimiento de imágenes
- [ ] Implementar cache para plantillas
- [ ] Agregar paginación a historial de mensajes
- [ ] Mejorar logging con contexto de request
- [ ] Implementar health checks más detallados

---

## Guía de Versionado

### Formato de Versión: MAJOR.MINOR.PATCH

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Corrección de bugs compatibles

### Categorías de Cambios

- **Agregado** - Nuevas características
- **Cambiado** - Cambios en funcionalidad existente
- **Deprecado** - Características que serán eliminadas
- **Eliminado** - Características eliminadas
- **Corregido** - Corrección de bugs
- **Seguridad** - Cambios relacionados con seguridad

---

## Soporte de Versiones

| Versión | Estado | Lanzamiento | Fin de Soporte |
|---------|--------|-------------|----------------|
| 1.0.x   | Actual | 2026-01-17  | TBD            |

---

## Contribuyendo

Para contribuir al proyecto:

1. Lee [CONTRIBUTING.md](CONTRIBUTING.md) (si existe)
2. Revisa los [issues abiertos](../../issues)
3. Crea una rama para tu feature
4. Sigue los estándares de código
5. Escribe tests para nuevas características
6. Actualiza la documentación
7. Envía un Pull Request

---

## Agradecimientos

Gracias a todos los que han contribuido a este proyecto:

- **Baileys Team** - Por la excelente librería de WhatsApp
- **Express.js Team** - Por el framework web
- **Socket.IO Team** - Por el sistema de WebSocket
- **Comunidad Open Source** - Por el soporte y feedback

---

## Licencia

Este proyecto está bajo la Licencia ISC. Ver [LICENSE](LICENSE) para más detalles.

---

**Nota**: Este changelog se actualiza con cada release. Para cambios no lanzados, ver la sección [Unreleased].
