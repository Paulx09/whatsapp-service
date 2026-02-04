import fs from 'fs';
import path from 'path';
import https from 'https';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  AUTO_REFRESH_ENABLED: process.env.AUTO_REFRESH_SESSION === 'true',
  MAX_RECONNECT_ATTEMPTS: parseInt(process.env.MAX_RECONNECT_ATTEMPTS || '3', 10),
  RECONNECT_TIMEOUT: parseInt(process.env.RECONNECT_TIMEOUT || '30000', 10),
  RECONNECT_COOLDOWN: parseInt(process.env.RECONNECT_COOLDOWN || '10000', 10),
  AUTH_FOLDER: 'auth_info',
  // Por defecto habilitamos health check salvo que se ponga 'false'
  HEALTH_CHECK_ENABLED: process.env.WHATSAPP_HEALTH_CHECK !== 'false',
  HEALTH_CHECK_TIMEOUT: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000', 10),
  // máximo delay para backoff
  MAX_BACKOFF: parseInt(process.env.MAX_BACKOFF || '300000', 10) // 5 minutos
};

const state = {
  isOperationInProgress: false,
  lastAttemptTimestamp: 0,
  consecutiveFailures: 0,
  lastValidationTimestamp: 0
};

class SessionManager {
  async _pingWhatsApp() {
    if (!CONFIG.HEALTH_CHECK_ENABLED) return true;

    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), CONFIG.HEALTH_CHECK_TIMEOUT);

      const options = {
        hostname: 'web.whatsapp.com',
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: CONFIG.HEALTH_CHECK_TIMEOUT
      };

      const req = https.request(options, (res) => {
        clearTimeout(timeout);
        const isOnline = res.statusCode >= 200 && res.statusCode < 500;
        resolve(isOnline);
      });

      req.on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });

      req.on('timeout', () => {
        req.destroy();
        clearTimeout(timeout);
        resolve(false);
      });

      req.end();
    });
  }

  async validateCredentials() {
    try {
      const authPath = path.resolve(process.cwd(), CONFIG.AUTH_FOLDER);
      const credsPath = path.join(authPath, 'creds.json');

      if (!fs.existsSync(authPath) || !fs.existsSync(credsPath)) {
        state.consecutiveFailures = 0;
        return { valid: false, status: 'missing', reason: 'auth_info or creds.json missing' };
      }

      const stats = fs.statSync(credsPath);
      if (stats.size < 50) return { valid: false, status: 'corrupted', reason: 'creds.json suspiciously small' };

      const content = fs.readFileSync(credsPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object' || !parsed.me || !parsed.me.id) {
        return { valid: false, status: 'invalid', reason: 'missing me.id' };
      }

      state.lastValidationTimestamp = Date.now();
      return { valid: true, status: 'valid', userId: parsed.me.id };
    } catch (error) {
      logger.error('SessionManager.validateCredentials error', { error: error.message });
      return { valid: false, status: 'error', reason: error.message };
    }
  }

  canAttemptReconnect() {
    if (!CONFIG.AUTO_REFRESH_ENABLED) return { allowed: false, reason: 'disabled', code: 'DISABLED' };
    if (state.isOperationInProgress) return { allowed: false, reason: 'in_progress', code: 'IN_PROGRESS' };

    const sinceLast = Date.now() - state.lastAttemptTimestamp;
    if (sinceLast < CONFIG.RECONNECT_COOLDOWN) {
      return { allowed: false, reason: 'cooldown', code: 'COOLDOWN', waitMs: CONFIG.RECONNECT_COOLDOWN - sinceLast };
    }

    if (state.consecutiveFailures >= CONFIG.MAX_RECONNECT_ATTEMPTS) {
      return { allowed: false, reason: 'max_attempts', code: 'MAX_ATTEMPTS', requiresManual: true };
    }

    return { allowed: true, attemptNumber: state.consecutiveFailures + 1, maxAttempts: CONFIG.MAX_RECONNECT_ATTEMPTS };
  }

  _markStart() {
    state.isOperationInProgress = true;
    state.lastAttemptTimestamp = Date.now();
  }

  _markEnd(success = false) {
    state.isOperationInProgress = false;
    if (success) state.consecutiveFailures = 0;
  }

  _recordFailure() {
    state.consecutiveFailures++;
  }

  _computeBackoff(attempt) {
    const base = Math.max(1000, CONFIG.RECONNECT_COOLDOWN);
    const delay = Math.min(CONFIG.MAX_BACKOFF, Math.floor(base * Math.pow(2, Math.max(0, attempt - 1))));
    // jitter ±10%
    const jitter = Math.floor(delay * 0.1);
    const sign = Math.random() > 0.5 ? 1 : -1;
    return Math.max(1000, delay + sign * Math.floor(Math.random() * jitter));
  }

  async autoRefreshSession(reconnectCallback) {
    logger.info('SessionManager: starting autoRefreshSession');

    const can = this.canAttemptReconnect();
    if (!can.allowed) {
      logger.info('SessionManager: cannot attempt reconnect', { reason: can.reason });
      return { success: false, status: can.code, reason: can.reason };
    }

    this._markStart();

    try {
      const credentials = await this.validateCredentials();
      if (!credentials.valid) {
        logger.warn('SessionManager: credentials invalid', { status: credentials.status });
        this._markEnd(false);
        return { success: false, status: credentials.status, requiresQR: true, validation: credentials };
      }

      const health = await this._pingWhatsApp();
      if (!health) {
        logger.warn('SessionManager: whatsapp health check failed');
        this._markEnd(false);
        return { success: false, status: 'whatsapp_unavailable' };
      }

      // Intentar reconexión con timeout
      try {
        const timeout = CONFIG.RECONNECT_TIMEOUT;
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), timeout));
        const reconnectPromise = Promise.resolve().then(() => reconnectCallback());

        const result = await Promise.race([reconnectPromise, timeoutPromise]);
        logger.info('SessionManager: reconnect success');
        this._markEnd(true);
        return { success: true, status: 'connected', result };
      } catch (err) {
        logger.warn('SessionManager: reconnect failed', { error: err.message });
        this._recordFailure();
        this._markEnd(false);
        return { success: false, status: 'reconnect_failed', error: err.message, attemptsRemaining: CONFIG.MAX_RECONNECT_ATTEMPTS - state.consecutiveFailures };
      }

    } catch (error) {
      logger.error('SessionManager.autoRefreshSession error', { error: error.message });
      this._markEnd(false);
      return { success: false, status: 'error', error: error.message };
    }
  }

  async runOnStartup(reconnectCallback) {
    if (!CONFIG.AUTO_REFRESH_ENABLED) {
      logger.info('SessionManager: auto refresh disabled by env');
      return;
    }

    logger.info('SessionManager: running auto-refresh on startup');

    const attempt = async () => {
      const res = await this.autoRefreshSession(reconnectCallback);
      if (res.success) return;

      // Si las credenciales no existen o son inválidas, no tiene sentido reintentar
      // hasta que el usuario escanee un QR manualmente.
      if (['missing', 'corrupted', 'invalid'].includes(res.status)) {
        logger.info('SessionManager: credentials not found or invalid, stopping auto-refresh. Waiting for manual QR scan.');
        return;
      }

      if (state.consecutiveFailures >= CONFIG.MAX_RECONNECT_ATTEMPTS) {
        logger.warn('SessionManager: reached max consecutive failures, stopping retries');
        return;
      }

      const nextAttemptNumber = state.consecutiveFailures + 1;
      const delay = this._computeBackoff(nextAttemptNumber);
      logger.info('SessionManager: scheduling next attempt', { delayMs: delay, attempt: nextAttemptNumber });

      setTimeout(() => {
        attempt().catch(e => logger.error('SessionManager: scheduled attempt error', { error: e.message }));
      }, delay);
    };

    // Lanzar primer intento sincrónico (no await bloqueante de app startup)
    attempt().catch(e => logger.error('SessionManager: initial attempt error', { error: e.message }));
  }
}

export default new SessionManager();
