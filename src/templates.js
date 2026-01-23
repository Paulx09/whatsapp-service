import { BASE_URL } from "./config/index.js";
import logger from './utils/logger.js';

// Lista de plantillas para exponer al front-end
export const templateList = [
  {
    id: 1,
    name: "DISEÑO Y DESARROLLO WEB",
    messages: {
      1: {
        text: `Hola {nombre} 👋
Gracias por contactarnos. Soy de DIGIMEDIA 🚀
A continuación, te contamos los principales beneficios que obtendrás con este servicio 👇
✅ Tendrás una web profesional que genere confianza desde el primer contacto.
✅ Atraerás más clientes con una experiencia clara y fácil de usar.
✅ Te encontrarán en Google y llegarás a más personas interesadas.
Escríbenos y comencemos a trabajar en tu web 🚀

`,
        image: "imagenes/desarrollo_web/1-1.png",
      },
      2: {
        text: `Hola {nombre} 👋
En DIGIMEDIA diseñamos y desarrollamos sitios web pensados para generar confianza, atraer clientes y apoyar el crecimiento de tu negocio. 🚀
👉 Escríbenos y te ayudamos con tu desarrollo web

`,
        image: "imagenes/desarrollo_web/1-2.png",
      },
      3: {
        text: `Hola {nombre} 👋
En DIGIMEDIA trabajamos tu web para que se vea profesional, genere confianza y apoye el crecimiento de tu negocio 🚀
 ✅ Web profesional que transmite confianza desde el primer contacto.
 ✅ Experiencia clara y fácil de usar que atraiga más clientes.
 ✅ Mayor visibilidad en Google para llegar a más personas interesadas.
 ✅ Una web pensada para convertir visitas en oportunidades reales.

.👉 Escríbenos para más información
`,
        image: "imagenes/desarrollo_web/1-3.png",
      }
    }
  },

  {
    id: 2,
    name: "GESTIÓN DE REDES SOCIALES",
    messages: {
      1: {
        text: `Hola {nombre} 👋
Gracias por contactarnos. Soy de DIGIMEDIA 🚀
✅ Tendrás redes sociales profesionales alineadas a tu marca.
✅ Atraerás más clientes con contenido estratégico y atractivo.
✅ Conectarás mejor con tu audiencia y fortalecerás tu presencia digital.
Escríbenos y comencemos a trabajar tus redes sociales 🚀 

`,
        image: "imagenes/gestion_redes/2-1.png",
      },
      2: {
        text: `Hola {nombre} 👋
En DIGIMEDIA ayudamos a marcas como la tuya a usar las redes sociales para atraer clientes y crecer. 🚀
👉 Escríbenos y te ayudamos con tus redes sociales`,
        image: "imagenes/gestion_redes/2-2.png",
      },
      3: {
        text: `Hola {nombre} 😊
En DIGIMEDIA trabajamos tus redes sociales con enfoque estratégico para que generen resultados reales 🚀
 ✅ 👉 Escríbenos para más información
`,
        image: "imagenes/gestion_redes/2-3.png",
      }
    }
  },

  {
    id: 3,
    name: "MARKETING Y GESTIÓN DIGITAL",
    messages: {
      1: {
        text: `Hola {nombre} 👋
Gracias por contactarnos. Soy de DIGIMEDIA 🚀
A continuación, te contamos los principales beneficios que obtendrás con este servicio 👇
✅ Tendrás una estrategia digital clara enfocada en resultados.
✅ Atraerás clientes ideales con acciones bien planificadas.
✅ Tomarás mejores decisiones usando datos y métricas reales.
Escríbenos y comencemos a impulsar tu crecimiento digital 🚀
 `,
        image: "imagenes/marketing_digital/3-1.png",
      },
      2: {
        text: `Hola {nombre} 👋
En DIGIMEDIA definimos y gestionamos estrategias digitales para que tus acciones tengan dirección, generen clientes y se basen en datos reales. 🚀
👉 Escríbenos y te ayudamos con tu conexión digital
`,
        image: "imagenes/marketing_digital/3-2.png",
      },
      3: {
        text: `Hola {nombre} 👋
En DIGIMEDIA trabajamos tu marketing digital con estrategia y datos para lograr crecimiento real 🚀
 ✅ Estrategia digital clara enfocada en resultados.
 ✅ Acciones bien planificadas para atraer clientes ideales.
 ✅ Decisiones basadas en datos y métricas reales.
 ✅ Dirección y orden para que tu marketing sí funcione.
.👉 Escríbenos para más información
`,
        image: "imagenes/marketing_digital/3-3.png",
      }
    }
  },

  {
    id: 4,
    name: "BRANDING Y DISEÑO",
    messages: {
      1: {
        text: `Hola {nombre} 👋
Gracias por contactarnos. Soy de DIGIMEDIA 🚀
A continuación, te contamos los principales beneficios que obtendrás con este servicio 👇
✅ Tendrás una identidad de marca clara y bien definida, que genere confianza al vender.
✅ Harás crecer tu marca con una estrategia pensada para atraer y convertir.
✅ Verás resultados reales gracias a una imagen potente y métricas relevantes.
Escríbenos y comencemos a construir una marca sólida 🚀

`,
        image: "imagenes/branding_diseño/4-1.png",
      },
      2: {
        text: ` Hola {nombre} 👋
En DIGIMEDIA trabajamos la identidad de tu marca para que se vea profesional, comunique con claridad y genere confianza desde el primer contacto. 🚀
👉 Escríbenos y te ayudamos con tu marca
`,
        image: "imagenes/branding_diseño/4-2.png",
      },
      3: {
        text: `Hola {nombre} 👋
En DIGIMEDIA trabajamos tu marca para que se vea profesional, comunique con claridad y genere confianza real 🚀
 ✅ Identidad de marca clara y bien definida.
 ✅ Estrategia pensada para atraer, convertir y crecer.
 ✅ Imagen profesional que genera confianza al vender.
 ✅ Resultados medibles con una marca coherente y sólida.
.👉 Escríbenos para más información
`,
        image: "imagenes/branding_diseño/4-3.png",
      }
    }
  },
];


export function getTemplate(id_service, messageNumber, params = {}) {
  const { nombre = "", image = null } = params;

  const template = templateList.find(p => p.id === Number(id_service));

  if (!template) return { 
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

  const message = template.messages[messageNumber];

  if (!message) return { 
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
  
  const finalImage = image || message.image;

  return {
    name: template.name,
    text: message.text.replace('{nombre}', nombre),  // Reemplaza el placeholder
    image: finalImage,
  };
}