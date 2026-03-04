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
        console.log('[DEBUG AUTH] User role from Laravel:', data.rol); // Log del rol
        req.user = {
          userId: data.user?.id || data.id,
          username: data.user?.name || data.name,
          role: data.rol || 'user', // El rol viene directo como string en data.rol
          roleData: data.empleado?.rol // Guardar datos completos del rol si existen
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

// Middleware híbrido: JWT (preferido) o API Key (fallback para Jobs)
export async function authenticateJWTorAPIKey(req, res, next) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  // 1. Primera prioridad: JWT
  if (authHeader) {
    return authenticateJWT(req, res, next);
  }

  // 2. Fallback: API Key (para Jobs de Laravel)
  if (apiKey) {
    if (!process.env.API_KEY || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ success: false, message: 'API Key inválida' });
    }
    
    // Marcar como request de servicio
    req.user = {
      userId: 0,
      username: 'Sistema (Job)',
      role: 'system',
      isSystemJob: true
    };
    
    console.log('[DEBUG AUTH] API Key validated - System Job');
    return next();
  }

  // 3. Sin autenticación
  return res.status(401).json({ 
    success: false, 
    message: 'Se requiere autenticación (JWT o API Key)' 
  });
}

// Middleware para autorizar roles múltiples (marketing o administrador)
export function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    // Permitir siempre a jobs del sistema
    if (req.user?.isSystemJob) {
      return next();
    }

    // Validar que el usuario tenga uno de los roles permitidos
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: `Acceso prohibido. Se requiere uno de estos roles: ${allowedRoles.join(', ')}` 
    });
  };
}