# 📚 Ejemplos de Uso

## Tabla de Contenidos

- [Autenticación](#autenticación)
- [Gestión de QR](#gestión-de-qr)
- [Envío de Mensajes](#envío-de-mensajes)
- [Chatbot](#chatbot)
- [WebSocket](#websocket)
- [Casos de Uso Completos](#casos-de-uso-completos)

---

## Autenticación

### Ejemplo 1: Login Básico

**JavaScript (Fetch):**
```javascript
const login = async () => {
  const response = await fetch('http://localhost:5111/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    console.log('Login exitoso:', data.user);
  } else {
    console.error('Error:', data.message);
  }
};

login();
```

**cURL:**
```bash
curl -X POST http://localhost:5111/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Python:**
```python
import requests

response = requests.post(
    'http://localhost:5111/api/auth/login',
    json={
        'username': 'admin',
        'password': 'admin123'
    }
)

data = response.json()
if data['success']:
    token = data['token']
    print(f"Token: {token}")
```

### Ejemplo 2: Obtener Usuario Actual

**JavaScript:**
```javascript
const getMe = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5111/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log('Usuario:', data.user);
};
```

---

## Gestión de QR

### Ejemplo 1: Generar QR

**JavaScript:**
```javascript
const generateQR = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5111/api/qr-request', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('QR generado, expira en:', data.expiresIn, 'segundos');
  }
};
```

**cURL:**
```bash
TOKEN="tu_token_aqui"

curl -X POST http://localhost:5111/api/qr-request \
  -H "Authorization: Bearer $TOKEN"
```

### Ejemplo 2: Obtener Estado del QR

**JavaScript con Polling:**
```javascript
const checkQRStatus = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5111/api/qr-status', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.hasActiveQR) {
    console.log(`QR activo: ${data.qrInfo.timeRemainingFormatted}`);
    console.log(`Estado: ${data.qrInfo.timeStatus}`);
    console.log(`Porcentaje restante: ${data.qrInfo.percentageRemaining}%`);
  } else if (data.isConnected) {
    console.log('WhatsApp ya conectado');
  } else {
    console.log('No hay QR activo');
  }
};

// Polling cada 5 segundos
setInterval(checkQRStatus, 5000);
```

### Ejemplo 3: Obtener Imagen del QR

**React Component:**
```jsx
import React, { useState, useEffect } from 'react';

function QRDisplay() {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchQR = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5111/api/qr-code', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQrCode(data.qrCode);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={fetchQR} disabled={loading}>
        {loading ? 'Cargando...' : 'Obtener QR'}
      </button>
      
      {qrCode && (
        <img src={qrCode} alt="QR Code" />
      )}
    </div>
  );
}
```

### Ejemplo 4: Expirar QR Manualmente

**JavaScript:**
```javascript
const expireQR = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5111/api/qr-expire', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data.message);
};
```

---

## Envío de Mensajes

### Ejemplo 1: Mensaje con Plantilla

**JavaScript:**
```javascript
const sendMessage = async () => {
  const response = await fetch('http://localhost:5111/api/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: 'Juan Pérez',
      templateOption: 1,  // DISEÑO Y DESARROLLO WEB
      telefono: '51987654321',
      fecha: '2026-01-20',
      hora: '14:30',
      id_servicio: 1
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Mensaje enviado:', data.messageId);
  }
};
```

**Python:**
```python
import requests

response = requests.post(
    'http://localhost:5111/api/send-message',
    json={
        'nombre': 'Juan Pérez',
        'templateOption': 1,
        'telefono': '51987654321',
        'fecha': '2026-01-20',
        'hora': '14:30',
        'id_servicio': 1
    }
)

data = response.json()
print(f"Éxito: {data['success']}")
```

**cURL:**
```bash
curl -X POST http://localhost:5111/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "templateOption": 1,
    "telefono": "51987654321",
    "fecha": "2026-01-20",
    "hora": "14:30",
    "id_servicio": 1
  }'
```

### Ejemplo 2: Mensaje con Imagen

**JavaScript (FormData):**
```javascript
const sendMessageWithImage = async () => {
  const formData = new FormData();
  formData.append('nombre', 'María López');
  formData.append('id_service', '2');
  formData.append('telefono', '51912345678');
  
  // Agregar archivo
  const fileInput = document.getElementById('image-input');
  formData.append('image', fileInput.files[0]);
  
  const response = await fetch('http://localhost:5111/api/send-message-image', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('Imagen enviada:', data.imageUrl);
};
```

**React Component:**
```jsx
function ImageUploader() {
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    const formData = new FormData();
    formData.append('nombre', 'Cliente Test');
    formData.append('id_service', '1');
    formData.append('telefono', '51987654321');
    formData.append('image', file);
    
    try {
      const response = await fetch('http://localhost:5111/api/send-message-image', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Mensaje enviado exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSending(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={!file || sending}>
        {sending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
```

**cURL:**
```bash
curl -X POST http://localhost:5111/api/send-message-image \
  -F "nombre=María López" \
  -F "id_service=2" \
  -F "telefono=51912345678" \
  -F "image=@/ruta/a/imagen.jpg"
```

### Ejemplo 3: Envío Masivo

**JavaScript:**
```javascript
const sendBulkMessages = async () => {
  const recipients = [
    { nombre: 'Juan', telefono: '51987654321' },
    { nombre: 'María', telefono: '51987654322' },
    { nombre: 'Pedro', telefono: '51987654323' }
  ];
  
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const response = await fetch('http://localhost:5111/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: recipient.nombre,
          templateOption: 1,
          telefono: recipient.telefono,
          fecha: '2026-01-20',
          hora: '14:30',
          id_servicio: 1
        })
      });
      
      const data = await response.json();
      results.push({
        telefono: recipient.telefono,
        success: data.success,
        messageId: data.messageId
      });
      
      // Esperar 1 segundo entre mensajes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error con ${recipient.telefono}:`, error);
      results.push({
        telefono: recipient.telefono,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log('Resultados:', results);
};
```

### Ejemplo 4: Obtener Plantillas

**JavaScript:**
```javascript
const getTemplates = async () => {
  const response = await fetch('http://localhost:5111/api/templates');
  const templates = await response.json();
  
  templates.forEach(template => {
    console.log(`ID: ${template.id}`);
    console.log(`Nombre: ${template.name}`);
    console.log(`Mensajes disponibles: ${Object.keys(template.messages).length}`);
    console.log('---');
  });
};
```

**React Component:**
```jsx
function TemplateSelector() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:5111/api/templates')
      .then(res => res.json())
      .then(data => setTemplates(data));
  }, []);
  
  return (
    <div>
      <select onChange={(e) => setSelected(e.target.value)}>
        <option value="">Seleccionar plantilla</option>
        {templates.map(template => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
      
      {selected && (
        <div>
          <h3>Vista previa:</h3>
          {Object.entries(templates.find(t => t.id == selected).messages).map(([key, msg]) => (
            <div key={key}>
              <h4>Mensaje {key}</h4>
              <p>{msg.text}</p>
              {msg.image && <img src={`http://localhost:5111/public/${msg.image}`} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Chatbot

### Ejemplo: Flujo del Chatbot

El chatbot responde automáticamente a mensajes entrantes. No requiere configuración adicional.

**Flujo de Usuario:**

1. Usuario envía: `"Hola"`
   - Bot responde con menú principal (Desarrollo, Tester, Diseño, Marketing)

2. Usuario responde: `"1"`
   - Bot muestra sub-menú de Desarrollo (PHP, Python, Node.js)

3. Usuario responde: `"2"`
   - Bot envía información sobre Python
   - Bot envía mensaje de cierre
   - Conversación termina

**Timeout:**
- Si el usuario no responde en 60 segundos, el bot envía mensaje de cierre automático

---

## WebSocket

### Ejemplo 1: Conexión Básica

**JavaScript (Socket.IO Client):**
```javascript
import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

const socket = io('http://localhost:5111', {
  auth: {
    token: token
  }
});

// Eventos
socket.on('connect', () => {
  console.log('Conectado:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
});

socket.on('qr-status', (data) => {
  console.log('Estado QR:', data);
});

socket.on('connection-update', (update) => {
  console.log('Conexión actualizada:', update);
});

socket.on('error', (error) => {
  console.error('Error:', error);
});
```

### Ejemplo 2: React Hook para WebSocket

**Custom Hook:**
```jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function useWhatsAppStatus() {
  const [qrStatus, setQrStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const newSocket = io('http://localhost:5111', {
      auth: { token }
    });
    
    newSocket.on('connect', () => {
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });
    
    newSocket.on('qr-status', (data) => {
      setQrStatus(data);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  return { qrStatus, isConnected, socket };
}

// Uso
function Dashboard() {
  const { qrStatus, isConnected } = useWhatsAppStatus();
  
  return (
    <div>
      <h1>Dashboard WhatsApp</h1>
      <p>Socket: {isConnected ? 'Conectado' : 'Desconectado'}</p>
      
      {qrStatus?.hasActiveQR && (
        <div>
          <p>QR activo</p>
          <p>Tiempo restante: {qrStatus.qrInfo.timeRemainingFormatted}</p>
          <p>Estado: {qrStatus.qrInfo.timeStatus}</p>
        </div>
      )}
      
      {qrStatus?.isConnected && (
        <p>✅ WhatsApp conectado</p>
      )}
    </div>
  );
}
```

### Ejemplo 3: Indicador Visual de QR

**React Component con Colores:**
```jsx
function QRIndicator({ qrStatus }) {
  if (!qrStatus?.hasActiveQR) return null;
  
  const { timeStatus, timeRemainingFormatted, percentageRemaining } = qrStatus.qrInfo;
  
  const getColor = () => {
    switch (timeStatus) {
      case 'normal': return '#22c55e';  // Verde
      case 'notice': return '#eab308';  // Amarillo
      case 'warning': return '#f97316'; // Naranja
      case 'critical': return '#ef4444'; // Rojo
      default: return '#gray';
    }
  };
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: getColor(),
      color: 'white',
      borderRadius: '8px'
    }}>
      <h3>QR Activo</h3>
      <p>Tiempo restante: {timeRemainingFormatted}</p>
      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '5px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentageRemaining}%`,
          height: '100%',
          backgroundColor: 'white',
          transition: 'width 0.3s'
        }} />
      </div>
    </div>
  );
}
```

---

## Casos de Uso Completos

### Caso 1: Sistema de Notificaciones de Citas

**Escenario:** Enviar recordatorios de citas médicas

```javascript
class AppointmentNotifier {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }
  
  async sendAppointmentReminder(appointment) {
    const { patientName, patientPhone, date, time, doctorName } = appointment;
    
    try {
      const response = await fetch(`${this.apiUrl}/api/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: patientName,
          templateOption: 1,
          telefono: patientPhone,
          fecha: date,
          hora: time,
          id_servicio: 1
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Recordatorio enviado a ${patientName}`);
        return { success: true, messageId: data.messageId };
      } else {
        console.error(`❌ Error enviando a ${patientName}: ${data.message}`);
        return { success: false, error: data.message };
      }
      
    } catch (error) {
      console.error(`❌ Error de red: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  async sendBatchReminders(appointments) {
    const results = [];
    
    for (const appointment of appointments) {
      const result = await this.sendAppointmentReminder(appointment);
      results.push({
        ...appointment,
        ...result
      });
      
      // Esperar 2 segundos entre mensajes
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
  }
}

// Uso
const notifier = new AppointmentNotifier('http://localhost:5111');

const appointments = [
  {
    patientName: 'Juan Pérez',
    patientPhone: '51987654321',
    date: '2026-01-20',
    time: '10:00',
    doctorName: 'Dr. García'
  },
  {
    patientName: 'María López',
    patientPhone: '51987654322',
    date: '2026-01-20',
    time: '11:00',
    doctorName: 'Dra. Martínez'
  }
];

const results = await notifier.sendBatchReminders(appointments);
console.log('Resultados:', results);
```

### Caso 2: Dashboard Completo con React

```jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function WhatsAppDashboard() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [qrStatus, setQrStatus] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState({
    nombre: '',
    telefono: '',
    templateOption: 1
  });
  
  // Login
  const handleLogin = async (username, password) => {
    const response = await fetch('http://localhost:5111/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    }
  };
  
  // WebSocket
  useEffect(() => {
    if (!token) return;
    
    const newSocket = io('http://localhost:5111', {
      auth: { token }
    });
    
    newSocket.on('qr-status', setQrStatus);
    setSocket(newSocket);
    
    return () => newSocket.disconnect();
  }, [token]);
  
  // Generar QR
  const generateQR = async () => {
    await fetch('http://localhost:5111/api/qr-request', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Obtener imagen
    const response = await fetch('http://localhost:5111/api/qr-code', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.success) setQrImage(data.qrCode);
  };
  
  // Enviar mensaje
  const sendMessage = async () => {
    const response = await fetch('http://localhost:5111/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Mensaje enviado exitosamente');
      setMessage({ nombre: '', telefono: '', templateOption: 1 });
    } else {
      alert(`Error: ${data.message}`);
    }
  };
  
  if (!token) {
    return (
      <LoginForm onLogin={handleLogin} />
    );
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard WhatsApp Service</h1>
      
      {/* Usuario */}
      <div>
        <p>Usuario: {user?.username} ({user?.role})</p>
      </div>
      
      {/* Estado de Conexión */}
      <div style={{ marginTop: '20px' }}>
        <h2>Estado de Conexión</h2>
        {qrStatus?.isConnected && <p>✅ WhatsApp conectado</p>}
        {qrStatus?.hasActiveQR && (
          <div>
            <p>⏰ QR activo: {qrStatus.qrInfo.timeRemainingFormatted}</p>
            <p>Estado: {qrStatus.qrInfo.timeStatus}</p>
            <progress 
              value={qrStatus.qrInfo.percentageRemaining} 
              max="100"
            />
          </div>
        )}
        {!qrStatus?.isConnected && !qrStatus?.hasActiveQR && (
          <p>❌ Desconectado</p>
        )}
      </div>
      
      {/* Generar QR */}
      {user?.role === 'admin' && !qrStatus?.isConnected && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={generateQR}>Generar QR</button>
          {qrImage && <img src={qrImage} alt="QR" style={{ maxWidth: '300px' }} />}
        </div>
      )}
      
      {/* Enviar Mensaje */}
      {qrStatus?.isConnected && (
        <div style={{ marginTop: '20px' }}>
          <h2>Enviar Mensaje</h2>
          <input 
            placeholder="Nombre"
            value={message.nombre}
            onChange={(e) => setMessage({ ...message, nombre: e.target.value })}
          />
          <input 
            placeholder="Teléfono (51987654321)"
            value={message.telefono}
            onChange={(e) => setMessage({ ...message, telefono: e.target.value })}
          />
          <select
            value={message.templateOption}
            onChange={(e) => setMessage({ ...message, templateOption: Number(e.target.value) })}
          >
            <option value="1">Diseño y Desarrollo Web</option>
            <option value="2">Gestión de Redes Sociales</option>
            <option value="3">Marketing Digital</option>
            <option value="4">Branding y Diseño</option>
          </select>
          <button onClick={sendMessage}>Enviar</button>
        </div>
      )}
    </div>
  );
}
```

### Caso 3: CLI para Administración

**Node.js CLI:**
```javascript
#!/usr/bin/env node

import readline from 'readline';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5111';
let token = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function login() {
  const username = await question('Username: ');
  const password = await question('Password: ');
  
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    token = data.token;
    console.log(`✅ Login exitoso como ${data.user.username}`);
    return true;
  } else {
    console.log('❌ Login fallido');
    return false;
  }
}

async function generateQR() {
  const response = await fetch(`${API_URL}/api/qr-request`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('✅ QR generado, escanea desde WhatsApp');
    console.log(`Expira en: ${data.expiresIn} segundos`);
  }
}

async function sendMessage() {
  const nombre = await question('Nombre: ');
  const telefono = await question('Teléfono: ');
  const template = await question('Template (1-4): ');
  
  const response = await fetch(`${API_URL}/api/send-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      telefono,
      templateOption: Number(template),
      id_servicio: 1
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Mensaje enviado');
  } else {
    console.log(`❌ Error: ${data.message}`);
  }
}

async function main() {
  console.log('=== WhatsApp Service CLI ===\n');
  
  if (!await login()) {
    process.exit(1);
  }
  
  while (true) {
    console.log('\nOpciones:');
    console.log('1. Generar QR');
    console.log('2. Enviar mensaje');
    console.log('3. Salir');
    
    const option = await question('\nSelecciona: ');
    
    switch (option) {
      case '1':
        await generateQR();
        break;
      case '2':
        await sendMessage();
        break;
      case '3':
        rl.close();
        process.exit(0);
      default:
        console.log('Opción inválida');
    }
  }
}

main();
```

**Uso:**
```bash
chmod +x cli.js
./cli.js
```

---

## Recursos Adicionales

- [Documentación de API](./API.md)
- [Guía de Arquitectura](./ARCHITECTURE.md)
- [Guía de Configuración](./CONFIGURATION.md)
