import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import messageRoutes from './routes/message.routes.js';
import authRoutes from './routes/auth.routes.js';
import jwt from 'jsonwebtoken';
import whatsappService, { startWhatsAppBot } from './services/whatsapp.service.js';
import sessionManager from './services/session.manager.js';
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";

// startWhatsAppBot();

// Procesa ALLOWED_ORIGINS (separado por comas) o usa localhost por defecto
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

const app = express();
app.set('trust proxy', 1);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"]
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(helmet());

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


// Aumentando limite a 50mb
app.use(express.json({
  limit: '50mb'
}));

app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Excluir el endpoint qr-status del rate limiting
    return req.path === '/api/qr-status' || req.path === '/api/qr-status/';
  }
});

app.use(limiter);

app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  next();
});

// Rutas de autenticación (sin API key)
app.use('/api/auth', authRoutes);

// Rutas de mensajes (con API key)
app.use('/api/whatsapp', messageRoutes);

// WebSocket para QR status
io.on('connection', async (socket) => {
  console.log('Cliente conectado:', socket.id);

  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('Conexión rechazada: No hay token');
    socket.disconnect();
    return;
  }

  // Lógica de autenticación (Interna o Laravel)
  let userData = null;
  try {
    userData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Intentar con Laravel
    try {
      const mainBackendUrl = process.env.MAIN_BACKEND_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${mainBackendUrl}/api/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        userData = {
          userId: data.user?.id || data.id,
          username: data.user?.name || data.name
        };
      }
    } catch (fetchErr) {
      console.error('Error socket auth Laravel:', fetchErr.message);
    }
  }

  if (!userData) {
    console.log('Conexión rechazada: Token inválido');
    socket.disconnect();
    return;
  }

  // Guardar info y proceder
  socket.userId = userData.userId;
  socket.user = userData;

  const qrStatus = whatsappService.getQRStatus();
  socket.emit('qr-status-update', qrStatus);
  console.log('Usuario socket autenticado:', userData.username);

  // Unirse a la sala del usuario
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Usuario ${userId} se unió a su sala`);
  });

  // Solicitar estado inicial
  socket.on('get-initial-status', () => {
    const qrStatus = whatsappService.getQRStatus();
    socket.emit('qr-status-update', qrStatus);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.userId);
  });
});

// Función para emitir actualizaciones del QR a todos los clientes
export function emitQrStatusUpdate(status) {
  io.emit('qr-status-update', status);
}

// Función para emitir a un usuario específico
export function emitQrStatusToUser(userId, status) {
  io.to(`user-${userId}`).emit('qr-status-update', status);
}

// Intentar auto-refresh de sesión al iniciar el servidor (no bloqueante)
const reconnectCallback = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Llamada al start que crea la sesión
      await startWhatsAppBot();
    } catch (err) {
      // startWhatsAppBot puede lanzar; igualmente intentamos observar el estado
    }

    const timeout = parseInt(process.env.RECONNECT_TIMEOUT || '30000', 10);
    const start = Date.now();
    const interval = 1000;

    const checker = setInterval(() => {
      try {
        const status = whatsappService.getQRStatus();
        if (status.isConnected) {
          clearInterval(checker);
          resolve(status);
        } else if (Date.now() - start > timeout) {
          clearInterval(checker);
          reject(new Error('TIMEOUT_WAIT_CONNECTED'));
        }
      } catch (e) {
        // ignorar y seguir esperando
      }
    }, interval);
  });
};

sessionManager.runOnStartup(reconnectCallback);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

export { server, io };