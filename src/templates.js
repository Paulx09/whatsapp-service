import logger from './utils/logger.js';

const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://127.0.0.1:8000';
const API_KEY = process.env.API_KEY || 'dev_local_2026_digimedia';

// Cache de plantillas (5 minutos para reducir llamadas a API)
const templateCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene una plantilla WhatsApp desde la API de Laravel
 * @param {number} id_service - ID del servicio (1-4)
 * @param {number} messageNumber - Número de plantilla (1-3)
 * @returns {Promise<{mensaje: string, imagen_url: string, servicio: object}>}
 */
async function fetchTemplateFromAPI(id_service, messageNumber) {
  const cacheKey = `${id_service}-${messageNumber}`;
  
  // Verificar cache
  if (templateCache.has(cacheKey)) {
    const cached = templateCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      logger.info(`📦 Plantilla en caché - Servicio: ${id_service}, Número: ${messageNumber}`);
      return cached.data;
    }
  }

  try {
    const url = `${MAIN_BACKEND_URL}/api/plantillas/whatsapp/${id_service}/${messageNumber}`;
    
    logger.info(`🔄 Consultando plantilla desde Laravel API: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': API_KEY
      },
      signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(`API respondió con status ${response.status}: ${errorData.message || 'Error'}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Respuesta de API inválida');
    }

    const plantilla = result.data;

    // Guardar en cache
    templateCache.set(cacheKey, {
      data: plantilla,
      timestamp: Date.now()
    });

    logger.info(`✅ Plantilla obtenida exitosamente - Servicio: ${plantilla.servicio?.nombre_servicio || id_service}`);

    return plantilla;

  } catch (error) {
    logger.error(`❌ Error obteniendo plantilla WhatsApp (servicio: ${id_service}, número: ${messageNumber}):`, error.message);
    throw new Error(`No se pudo obtener la plantilla: ${error.message}`);
  }
}

/**
 * Obtiene una plantilla WhatsApp y procesa el contenido
 * @param {number} id_service - ID del servicio (1-4)
 * @param {number} messageNumber - Número de plantilla (1-3)
 * @param {object} params - Parámetros para reemplazar en la plantilla
 * @param {string} params.nombre - Nombre del cliente
 * @param {string} params.image - URL de imagen personalizada (opcional)
 * @returns {Promise<{name: string, text: string, image: string}>}
 */
export async function getTemplate(id_service, messageNumber, params = {}) {
  const { nombre = "", image = null } = params;

  try {
    const plantilla = await fetchTemplateFromAPI(id_service, messageNumber);

    // Reemplazar {nombre} en el mensaje
    const text = plantilla.mensaje.replaceAll('{nombre}', nombre);

    // Usar imagen personalizada o la de la plantilla
    const finalImage = image || plantilla.imagen_url;

    return {
      name: plantilla.servicio?.nombre_servicio || `Servicio ${id_service}`,
      text: text,
      image: finalImage
    };

  } catch (error) {
    logger.error(`❌ Error en getTemplate:`, error.message);
    
    // Plantilla de respaldo genérica (fallback)
    return {
      name: "General",
      text: `✨ ¡Hola ${nombre}! Te saluda Digimedia. 💻🚀

Potencia tu presencia online con una página web profesional y personalizada para tu marca.

Te ayudamos con:

  🌐 Diseño web *moderno y a tu medida*.
  ⚡ Desarrollo optimizado y veloz.
  📱 100% adaptable a móviles.
  🎯 SEO listo para posicionarte en Google.
  💰 Inversión inteligente que multiplica tus ventas.

  👉 Todo en un solo servicio creado para hacer crecer tu negocio sin límites.

    "Sí tu negocio no 𝘦𝘴𝘵𝘢́ en internet, tu negocio no existe." -Bill gates

Tu negocio no puede esperar más para crecer.

Hazlo digital con *DigiMedia.*`,
      image: 'imagenes/Flyer.jpg'
    };
  }
}

/**
 * Lista de plantillas para exponer al front-end (deprecated - usar API)
 * Mantener solo para compatibilidad temporal
 * @deprecated Usar getTemplate() que consulta la API de Laravel
 */
export const templateList = [
  {
    id: 1,
    name: "DISEÑO Y DESARROLLO WEB"
  },
  {
    id: 2,
    name: "GESTIÓN DE REDES SOCIALES"
  },
  {
    id: 3,
    name: "MARKETING Y GESTIÓN DIGITAL"
  },
  {
    id: 4,
    name: "BRANDING Y DISEÑO"
  }
];

/**
 * Invalida el cache de plantillas (útil para forzar actualización)
 */
export function clearTemplateCache() {
  templateCache.clear();
  logger.info('🗑️ Cache de plantillas limpiado');
}

/**
 * Pre-carga todas las plantillas en cache
 * @returns {Promise<void>}
 */
export async function preloadTemplates() {
  logger.info('🔄 Pre-cargando plantillas en cache...');
  
  const promises = [];
  for (let servicio = 1; servicio <= 4; servicio++) {
    for (let numero = 1; numero <= 3; numero++) {
      promises.push(
        fetchTemplateFromAPI(servicio, numero).catch(err => {
          logger.warn(`⚠️ No se pudo pre-cargar plantilla ${servicio}-${numero}: ${err.message}`);
        })
      );
    }
  }
  
  await Promise.allSettled(promises);
  logger.info(`✅ Pre-carga completada - ${templateCache.size} plantillas en cache`);
}

/**
 * Template para mensajes de aceptación
 * @param {string} message - Comentario del administrador
 * @returns {string} Mensaje formateado
 */
export function getAcceptanceTemplate(message) {
  return `✅ *Aceptado*\n\n${message}\n\n¡Gracias por confiar en Digimedia! 🚀`;
}

/**
 * Template para mensajes de rechazo
 * @param {string} message - Comentario del administrador
 * @returns {string} Mensaje formateado
 */
export function getRejectionTemplate(message) {
  return `❌ *No procede*\n\n${message}\n\nGracias por tu interés en Digimedia.`;
}
