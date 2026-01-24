# 📡 Documentación de API

## Tabla de Contenidos

- [Autenticación](#autenticación)
- [Gestión de QR](#gestión-de-qr)
- [Mensajería](#mensajería)
- [Gestión de Conexión](#gestión-de-conexión)
- [WebSocket](#websocket)
- [Códigos de Estado](#códigos-de-estado)
- [Ejemplos de Respuesta](#ejemplos-de-respuesta)

---

## Autenticación

### POST /api/auth/login

Autenticar usuario y obtener token JWT.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

### GET /api/auth/me

Obtener información del usuario actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

---

## Gestión de QR

### POST /api/qr-request

Generar nuevo código QR para conexión WhatsApp.

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** Admin

**Response Success (200):**
```json
{
  "success": true,
  "message": "QR generado exitosamente",
  "qrData": "2@aB3cD4eF5gH6iJ7kL...",
  "expiresAt": 1737112256789,
  "expiresIn": 60
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Ya hay un QR activo"
}
```

### GET /api/qr-status

Obtener estado actual del código QR.

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success - QR Activo:**
```json
{
  "success": true,
  "hasActiveQR": true,
  "isConnected": false,
  "qrInfo": {
    "timeRemaining": 42,
    "timeRemainingFormatted": "0:42",
    "percentageRemaining": 70,
    "timeStatus": "notice",
    "urgencyMessage": "El QR tiene poco tiempo restante",
    "expiresAt": 1737112256789,
    "createdAt": "2026-01-17T10:30:56.789Z",
    "age": 18
  },
  "actions": {
    "canRenew": true,
    "shouldRenew": false,
    "mustRenew": false
  },
  "message": "QR activo con 42 segundos restantes",
  "timestamp": "2026-01-17T10:30:56.789Z"
}
```

**Response Success - Conectado:**
```json
{
  "success": true,
  "hasActiveQR": false,
  "isConnected": true,
  "message": "WhatsApp ya está conectado",
  "timestamp": "2026-01-17T10:30:56.789Z"
}
```

**Estados de timeStatus:**
- `normal`: > 45 segundos restantes
- `notice`: ≤ 45 segundos restantes
- `warning`: ≤ 30 segundos restantes
- `critical`: ≤ 10 segundos restantes

### GET /api/qr-code

Obtener código QR en formato imagen base64.

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** Admin

**Response Success (200):**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### POST /api/qr-expire

Expirar manualmente el código QR actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** Admin

**Response Success (200):**
```json
{
  "success": true,
  "message": "QR expirado manualmente"
}
```

### GET /api/auth-status

Verificar estado de autenticación de WhatsApp.

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "isAuthenticated": true,
  "connectionStatus": "open",
  "timestamp": "2026-01-17T10:30:56.789Z"
}
```

---

## Mensajería

### POST /api/send-message

Enviar mensaje usando plantilla.

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "templateOption": 1,
  "telefono": "51987654321",
  "fecha": "2026-01-20",
  "hora": "14:30",
  "id_servicio": 1
}
```

**Validación:**
- `nombre`: Requerido, string
- `templateOption`: Requerido, number (1-4)
- `telefono`: Requerido, formato `51XXXXXXXXX` (Perú)
- `fecha`: Opcional, string
- `hora`: Opcional, string
- `id_servicio`: Requerido, number

**Response Success (200):**
```json
{
  "success": true,
  "messageId": "msg_1737112256789",
  "sentAt": "2026-01-17T10:30:56.789Z",
  "to": "51987654321@s.whatsapp.net"
}
```

**Response Error (500):**
```json
{
  "success": false,
  "message": "WhatsApp no está conectado",
  "timestamp": "2026-01-17T10:30:56.789Z"
}
```

### POST /api/send-message-image

Enviar mensaje con imagen adjunta.

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `nombre`: Juan Pérez
- `id_service`: 1
- `telefono`: 51987654321
- `image`: [archivo]

**Response Success (200):**
```json
{
  "success": true,
  "messageId": "msg_1737112256789",
  "imageUrl": "http://localhost:5111/public/imagenes_dashboard/image-1737112256789.jpg",
  "sentAt": "2026-01-17T10:30:56.789Z"
}
```

### POST /api/send-message-accept

Enviar mensaje de aceptación.

**Request:**
```json
{
  "telefono": "51987654321",
  "nombre": "Juan Pérez"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "messageId": "msg_1737112256789"
}
```

### POST /api/send-message-reject

Enviar mensaje de rechazo.

**Request:**
```json
{
  "telefono": "51987654321",
  "nombre": "Juan Pérez"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "messageId": "msg_1737112256789"
}
```

### POST /api/send-image

Enviar solo imagen sin texto.

**Request:**
```json
{
  "telefono": "51987654321",
  "imageUrl": "https://ejemplo.com/imagen.jpg"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "messageId": "msg_1737112256789"
}
```

### GET /api/sent-messages

Obtener historial de mensajes enviados.

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** Admin

**Response Success (200):**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_1737112256789",
      "to": "51987654321",
      "template": 1,
      "sentAt": "2026-01-17T10:30:56.789Z",
      "status": "sent"
    }
  ],
  "total": 1
}
```

### GET /api/templates

Obtener lista de plantillas disponibles.

**Response Success (200):**
```json
[
  {
    "id": 1,
    "name": "DISEÑO Y DESARROLLO WEB",
    "messages": {
      "1": {
        "text": "Hola {nombre}...",
        "image": "imagenes/desarrollo_web/1-1.png"
      },
      "2": { "text": "...", "image": "..." },
      "3": { "text": "...", "image": "..." }
    }
  },
  {
    "id": 2,
    "name": "GESTIÓN DE REDES SOCIALES",
    "messages": { ... }
  }
]
```

### GET /api/status

Obtener estado general del servicio.

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "connected": true,
  "timestamp": "2026-01-17T10:30:56.789Z"
}
```

---

## Gestión de Conexión

### POST /api/force-reconnect

Forzar reconexión a WhatsApp.

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** Admin

**Response Success (200):**
```json
{
  "success": true,
  "message": "Reconexión forzada iniciada"
}
```

### GET /api/reconnection-status

Obtener estado de reconexión.

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "isReconnecting": false,
  "reconnectAttempts": 0,
  "maxReconnectAttempts": 5,
  "lastAttempt": null,
  "connected": true
}
```

### POST /api/auth/reset

Resetear autenticación de WhatsApp (eliminar sesión).

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** Admin

**Response Success (200):**
```json
{
  "success": true,
  "message": "Autenticación reseteada correctamente"
}
```

---

## WebSocket

### Conexión

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5111', {
  auth: {
    token: 'tu_jwt_token_aqui'
  }
});
```

### Eventos del Cliente

#### connect
```javascript
socket.on('connect', () => {
  console.log('Conectado:', socket.id);
});
```

#### disconnect
```javascript
socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
});
```

#### qr-status
```javascript
socket.on('qr-status', (data) => {
  console.log('Estado QR actualizado:', data);
  // data tiene la misma estructura que GET /api/qr-status
});
```

#### connection-update
```javascript
socket.on('connection-update', (update) => {
  console.log('Actualización de conexión:', update);
  // { connected: true/false, timestamp: "..." }
});
```

#### error
```javascript
socket.on('error', (error) => {
  console.error('Error:', error);
});
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado |
| 400 | Solicitud incorrecta |
| 401 | No autorizado |
| 403 | Prohibido (rol insuficiente) |
| 404 | No encontrado |
| 409 | Conflicto (ej: QR ya existe) |
| 429 | Demasiadas solicitudes (rate limit) |
| 500 | Error interno del servidor |

---

## Ejemplos de Respuesta

### Respuesta de Error Estándar

```json
{
  "success": false,
  "message": "Descripción del error",
  "timestamp": "2026-01-17T10:30:56.789Z"
}
```

### Respuesta de Error de Validación

```json
{
  "success": false,
  "errors": [
    {
      "field": "telefono",
      "message": "Formato de teléfono inválido"
    },
    {
      "field": "templateOption",
      "message": "Plantilla no válida"
    }
  ]
}
```

### Respuesta de Rate Limit

```json
{
  "message": "Too many requests, please try again later.",
  "retryAfter": 900
}
```

---

## Notas Importantes

1. **Autenticación**: La mayoría de endpoints requieren token JWT en el header `Authorization: Bearer <token>`
2. **Rate Limiting**: Máximo 100 requests cada 15 minutos por IP (excepto `/api/qr-status`)
3. **WebSocket**: Requiere token JWT en `auth.token` al conectar
4. **Formato de Teléfono**: Debe incluir código de país sin `+` (ej: `51987654321` para Perú)
5. **Imágenes**: Tamaño máximo 50MB, formatos: JPG, PNG
6. **Timeout**: El QR expira automáticamente después de 60 segundos
7. **Chatbot**: Responde automáticamente a mensajes entrantes con timeout de 60 segundos
