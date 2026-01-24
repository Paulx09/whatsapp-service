# 📚 Documentación del Proyecto

Bienvenido a la documentación del WhatsApp Service API. Aquí encontrarás toda la información necesaria para entender, configurar, usar y extender este proyecto.

---

## 📖 Guías Disponibles

### 🚀 [README Principal](../README.md)
**Punto de partida del proyecto**
- Características principales
- Instalación rápida
- Configuración básica
- Guía de inicio rápido

### 📡 [Documentación de API](API.md)
**Referencia completa de endpoints**
- Autenticación
- Gestión de QR
- Mensajería
- WebSocket
- Códigos de estado
- Ejemplos de respuesta

### 🏗️ [Guía de Arquitectura](ARCHITECTURE.md)
**Entendiendo el sistema**
- Visión general
- Arquitectura del sistema
- Componentes principales
- Flujo de datos
- Patrones de diseño
- Tecnologías utilizadas

### ⚙️ [Guía de Configuración](CONFIGURATION.md)
**Configuración detallada**
- Variables de entorno
- Configuración de usuarios
- Configuración de WhatsApp
- Seguridad
- PM2 y Docker
- Troubleshooting

### 💡 [Ejemplos de Uso](EXAMPLES.md)
**Aprende con ejemplos prácticos**
- Autenticación
- Gestión de QR
- Envío de mensajes
- Chatbot
- WebSocket
- Casos de uso completos

### 📝 [Changelog](../CHANGELOG.md)
**Historial de cambios**
- Versiones
- Nuevas características
- Correcciones de bugs
- Roadmap

---

## 🎯 Guías Rápidas

### Para Usuarios Nuevos

1. Lee el [README](../README.md) para entender qué hace el proyecto
2. Sigue la sección de [Instalación](../README.md#-instalación)
3. Configura las [Variables de Entorno](CONFIGURATION.md#variables-de-entorno)
4. Revisa los [Ejemplos Básicos](EXAMPLES.md#autenticación)

### Para Desarrolladores

1. Lee la [Guía de Arquitectura](ARCHITECTURE.md) para entender el sistema
2. Revisa la [Documentación de API](API.md) para conocer los endpoints
3. Explora los [Ejemplos de Código](EXAMPLES.md#casos-de-uso-completos)
4. Consulta la [Guía de Configuración](CONFIGURATION.md) para personalizar

### Para DevOps

1. Revisa [Configuración de PM2](CONFIGURATION.md#configuración-de-pm2)
2. Consulta [Configuración de Docker](CONFIGURATION.md#configuración-de-docker)
3. Lee la sección de [Despliegue](../README.md#-despliegue)
4. Implementa [Monitoreo](../README.md#-monitoreo)

---

## 🗺️ Mapa del Sistema

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE                          │
│  (Web App, Mobile App, CLI, Postman, etc.)         │
└──────────────────┬──────────────────────────────────┘
                   │
          HTTP/WebSocket
                   │
┌──────────────────▼──────────────────────────────────┐
│              EXPRESS SERVER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │Middleware│  │  Routes  │  │Controllers│         │
│  └──────────┘  └──────────┘  └──────────┘         │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│           WHATSAPP SERVICE                          │
│  - Gestión de conexión                              │
│  - QR Management                                    │
│  - Envío de mensajes                               │
│  - Chatbot                                         │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              BAILEYS                                │
│  (WhatsApp Web Client)                             │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Estructura de la Documentación

```
docs/
├── README.md              # Este archivo (índice)
├── API.md                 # Documentación completa de API
├── ARCHITECTURE.md        # Arquitectura y diseño del sistema
├── CONFIGURATION.md       # Guía de configuración
└── EXAMPLES.md           # Ejemplos de uso prácticos
```

---

## 🔍 Búsqueda Rápida

### Conceptos Clave

- **JWT**: [Autenticación](API.md#autenticación)
- **QR**: [Sistema de QR](API.md#gestión-de-qr)
- **WebSocket**: [WebSocket](API.md#websocket)
- **Plantillas**: [Mensajería](API.md#mensajería)
- **Chatbot**: [Chatbot](ARCHITECTURE.md#4-chatbot-system)
- **Rate Limiting**: [Seguridad](CONFIGURATION.md#rate-limiting)
- **PM2**: [Configuración PM2](CONFIGURATION.md#configuración-de-pm2)
- **Docker**: [Configuración Docker](CONFIGURATION.md#configuración-de-docker)

### Tareas Comunes

| Tarea | Documentación |
|-------|---------------|
| Instalar el proyecto | [README - Instalación](../README.md#-instalación) |
| Configurar variables | [Configuration - Variables](CONFIGURATION.md#variables-de-entorno) |
| Hacer login | [Examples - Login](EXAMPLES.md#ejemplo-1-login-básico) |
| Generar QR | [Examples - QR](EXAMPLES.md#ejemplo-1-generar-qr) |
| Enviar mensaje | [Examples - Mensaje](EXAMPLES.md#ejemplo-1-mensaje-con-plantilla) |
| Conectar WebSocket | [Examples - WebSocket](EXAMPLES.md#ejemplo-1-conexión-básica) |
| Deploy con Docker | [README - Docker](../README.md#-docker) |
| Troubleshooting | [Configuration - Troubleshooting](CONFIGURATION.md#troubleshooting) |

---

## 🆘 Soporte

### ¿Necesitas Ayuda?

1. **Primero**: Revisa la documentación relevante
2. **Luego**: Consulta [Troubleshooting](CONFIGURATION.md#troubleshooting)
3. **Si persiste**: Abre un [issue en GitHub](../../issues)

### Reportar Bugs

Cuando reportes un bug, incluye:
- Versión del proyecto
- Node.js version
- Sistema operativo
- Pasos para reproducir
- Logs relevantes
- Configuración (sin credenciales)

### Solicitar Características

Cuando solicites una característica:
- Describe el caso de uso
- Explica por qué es importante
- Sugiere una implementación (opcional)
- Proporciona ejemplos (opcional)

---

## 🤝 Contribuir

¿Quieres mejorar la documentación? ¡Genial!

1. Identifica qué falta o está desactualizado
2. Crea una rama: `git checkout -b docs/mejora-seccion-x`
3. Realiza los cambios
4. Envía un Pull Request

### Estilo de Documentación

- Usa Markdown para formato
- Incluye ejemplos de código
- Agrega diagramas cuando sea útil
- Mantén consistencia con el resto
- Revisa ortografía y gramática

---

## 📚 Recursos Externos

### Librerías Principales

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Cliente WhatsApp
- [Express](https://expressjs.com/) - Framework web
- [Socket.IO](https://socket.io/) - WebSocket
- [JWT](https://jwt.io/) - Autenticación

### Herramientas

- [PM2](https://pm2.keymetrics.io/) - Gestión de procesos
- [Docker](https://docs.docker.com/) - Containerización
- [Node.js](https://nodejs.org/) - Runtime JavaScript

### Tutoriales

- [REST API Best Practices](https://restfulapi.net/)
- [WebSocket Guide](https://socket.io/docs/v4/)
- [Docker for Beginners](https://docker-curriculum.com/)
- [PM2 Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## 📌 Versión

**Documentación para:** v1.0.0  
**Última actualización:** 2026-01-17  
**Mantenido por:** DIGIMEDIA Team

---

## 📄 Licencia

Esta documentación está bajo la misma licencia que el proyecto (ISC).

---

<div align="center">

**¿Encontraste útil esta documentación?**  
⭐ Dale una estrella al proyecto en GitHub

**¿Algo no está claro?**  
📝 Abre un issue para mejorarla

</div>
