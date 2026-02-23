import {
  sendMessage,
  getStatus,
  requestNewQr,
  forceExpireQr,
  getQrStatus,
  getQrCode,
  resetAuth,
  getSentMessages,
  checkAuthStatus,
  forceReconnect,
  getReconnectionStatus,
  sendMessageWithImage,
  sendMessageAccept,
  sendMessageReject,
  sendMessageWithImageDashboard,
  sendCampaignBatch
} from '../controllers/message.controller.js';
import {
  validateSendMessage,
  validateSendImage,
  validateSendMessageAccept,
  validateSendMessageReject,
  validateSendServiceTemplate
} from '../validators/message.validator.js';
import { 
  authenticateJWT, 
  authorizeRole, 
  authenticateJWTorAPIKey,
  authorizeRoles 
} from '../middlewares/auth.middleware.js';
import { upload } from '../config/message.config.js';
import { Router } from 'express';
import { templateList } from '../templates.js'

const router = Router();

// ENDPOINTS PROTEGIDOS - Solo Laravel (con JWT o API Key)
// Envío de mensajes individuales - Protegido
router.post('/send-message', authenticateJWTorAPIKey, authorizeRoles(['marketing', 'administrador', 'system']), validateSendServiceTemplate, sendMessage);

// Envío de campañas masivas - CRÍTICO: Solo marketing/admin o Jobs
router.post('/send-campaign-batch', authenticateJWTorAPIKey, authorizeRoles(['marketing', 'administrador', 'system']), sendCampaignBatch);

// Envío con imagen - Protegido
router.post('/send-message-image', authenticateJWTorAPIKey, authorizeRoles(['marketing', 'administrador', 'system']), upload.single("image"), sendMessageWithImageDashboard);

// ENDPOINTS PÚBLICOS (sin autenticación)
// Mensajes de aceptación/rechazo desde frontend público
router.post('/send-message-accept', validateSendMessageAccept, sendMessageAccept);
router.post('/send-message-reject', validateSendMessageReject, sendMessageReject);

// ENDPOINTS ADMINISTRATIVOS
router.get('/sent-messages', authenticateJWT, authorizeRoles(['administrador', 'marketing']), getSentMessages);
router.get('/qr-code', authenticateJWT, authorizeRoles(['administrador', 'marketing']), getQrCode);
router.post('/send-image', authenticateJWT, authorizeRoles(['administrador', 'marketing']), validateSendImage, sendMessageWithImage);
router.get('/status', authenticateJWT, getStatus);
router.get('/qr-status', authenticateJWT, getQrStatus);
router.get('/auth-status', authenticateJWT, checkAuthStatus);
router.get('/reconnection-status', authenticateJWT, getReconnectionStatus);
router.post('/qr-request', authenticateJWT, authorizeRoles(['administrador', 'marketing']), requestNewQr);
router.post('/qr-expire', authenticateJWT, authorizeRoles(['administrador', 'marketing']), forceExpireQr);
router.post('/auth/reset', authenticateJWT, authorizeRoles(['administrador']), resetAuth);
router.post('/force-reconnect', authenticateJWT, authorizeRoles(['administrador', 'marketing']), forceReconnect);

router.get('/templates', (req, res) => {
  res.json(templateList);
});

// Nuevas rutas para el frontend (Sin prefijo /whatsapp/ aquí porque se añade en app.js)
router.post('/restart', authenticateJWT, authorizeRoles(['administrador', 'marketing']), requestNewQr);
router.post('/template', authenticateJWT, authorizeRoles(['administrador', 'marketing']), upload.single('image'), (req, res) => {
  res.json({ success: true, message: "Plantilla recibida", data: req.body, file: req.file });
});
router.post('/activate', authenticateJWT, authorizeRoles(['administrador', 'marketing']), (req, res) => {
  res.json({ success: true, message: "Campaña activada" });
});

export default router;