import jwt from 'jsonwebtoken';

// Middleware para verificar API Key (para servicios)
export function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!process.env.API_KEY || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
  next();
}

// Middleware para verificar JWT (soporta validación interna y cruzada con Laravel)
export async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('[DEBUG AUTH] No auth header provided');
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  // 1. Intentar validar localmente (JWT interno)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[DEBUG AUTH] Local JWT validated:', decoded.username);
    req.user = decoded;
    return next();
  } catch (err) {
    console.log('[DEBUG AUTH] Local JWT failed, trying Laravel backend...');

    // 2. Si falla lo local, pedir validación al Backend Principal (Laravel)
    try {
      const mainBackendUrl = process.env.MAIN_BACKEND_URL || 'http://127.0.0.1:8000';
      console.log(`[DEBUG AUTH] Fetching Laravel auth: ${mainBackendUrl}/api/me`);

      const response = await fetch(`${mainBackendUrl}/api/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[DEBUG AUTH] Laravel backend validated user:', data.user?.name || data.name);
        req.user = {
          userId: data.user?.id || data.id,
          username: data.user?.name || data.name,
          role: 'admin' // Acceso concedido si está autenticado en el principal
        };
        return next();
      } else {
        const errorText = await response.text();
        console.log(`[DEBUG AUTH] Laravel backend validation failed with status ${response.status}:`, errorText.substring(0, 100));
      }
    } catch (fetchError) {
      console.error('[DEBUG AUTH] Error connection to Laravel backend:', fetchError.message);
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido o sesión no autorizada'
    });
  }
}

// Middleware para verificar roles
export function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Acceso prohibido' });
    }
  };
}