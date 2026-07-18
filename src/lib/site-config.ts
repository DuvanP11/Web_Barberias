/**
 * Configuración central del sitio — PLANTILLA.
 *
 * Este es el ÚNICO archivo con los datos del negocio: cambiar el WhatsApp, el
 * nombre o los servicios debe ser editar aquí, no buscar por todo el proyecto.
 *
 * Regla: si un dato del negocio aparece escrito dentro de un componente, está
 * mal puesto — su sitio es este archivo.
 *
 * >>> Reemplaza los valores marcados con « ... » por los reales del cliente. <<<
 */

export const siteConfig = {
  name: "Tu Negocio",
  slogan: "Tu eslogan corto aquí",
  description:
    "Descripción breve del negocio en una frase. Se usa en la metadata y en los buscadores.",
  tagline: "Una frase que resuma la promesa del negocio.",

  // Contacto
  whatsapp: {
    // Formato internacional, SOLO dígitos (sin "+" ni espacios): así lo quiere wa.me.
    number: "573000000000",
    // Como se le muestra a una persona.
    display: "300 000 0000",
  },
  email: "contacto@tunegocio.com",

  // Ubicación
  address: {
    street: "« Dirección »",
    neighborhood: "« Barrio / zona »",
    city: "Bogotá D.C.",
    country: "Colombia",
    // Consulta para el mapa embebido del footer.
    mapQuery: "Bogotá, Colombia",
  },

  schedule: "Lunes a Sábado, 9:00 a.m. a 7:00 p.m.",

  // Redes sociales. Deja el string vacío para NO pintar el icono: un enlace que
  // no lleva a ningún lado se lee como descuido.
  social: {
    facebook: "",
    instagram: "",
  },

  // URL pública del sitio (para SEO / Open Graph). Sin barra final.
  url: "https://www.tunegocio.com",

  /**
   * Servicios que ofrece el negocio. Alimentan la sección "Servicios" de la
   * home y el selector del formulario de contacto. Ajusta la lista al negocio
   * real (para una barbería: Corte de cabello, Barba, Corte + barba, etc.).
   */
  services: [
    { title: "Servicio 1", text: "Describe aquí en qué consiste este servicio." },
    { title: "Servicio 2", text: "Describe aquí en qué consiste este servicio." },
    { title: "Servicio 3", text: "Describe aquí en qué consiste este servicio." },
    { title: "Servicio 4", text: "Describe aquí en qué consiste este servicio." },
    { title: "Servicio 5", text: "Describe aquí en qué consiste este servicio." },
    { title: "Servicio 6", text: "Describe aquí en qué consiste este servicio." },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
