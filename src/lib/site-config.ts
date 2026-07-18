/**
 * Configuración central del sitio — DATOS DE EJEMPLO (Barbería).
 *
 * Este es el ÚNICO archivo con los datos del negocio: cambiar el WhatsApp, el
 * nombre o los servicios debe ser editar aquí, no buscar por todo el proyecto.
 *
 * Regla: si un dato del negocio aparece escrito dentro de un componente, está
 * mal puesto — su sitio es este archivo.
 *
 * >>> Los valores de abajo son de EJEMPLO. Reemplázalos por los reales. <<<
 */

export const siteConfig = {
  name: "Barbería Imperio",
  slogan: "Tradición y estilo en cada corte",
  description:
    "Barbería clásica en Bogotá: cortes de cabello, arreglo de barba y afeitado tradicional a navaja, con atención personalizada.",
  tagline: "Donde tu estilo cobra vida.",

  // Contacto
  whatsapp: {
    // Formato internacional, SOLO dígitos (sin "+" ni espacios): así lo quiere wa.me.
    number: "573001234567",
    // Como se le muestra a una persona.
    display: "300 123 4567",
  },
  email: "citas@barberiaimperio.com",

  // Ubicación
  address: {
    street: "Calle 85 #12-34, Local 2",
    neighborhood: "Chapinero",
    city: "Bogotá D.C.",
    country: "Colombia",
    // Consulta para el mapa embebido del footer.
    mapQuery: "Calle 85 #12-34, Chapinero, Bogotá",
  },

  schedule: "Martes a Domingo, 9:00 a.m. a 8:00 p.m.",

  // Redes sociales. Deja el string vacío para NO pintar el icono: un enlace que
  // no lleva a ningún lado se lee como descuido.
  social: {
    facebook: "",
    instagram: "https://instagram.com/barberiaimperio",
  },

  // URL pública del sitio (para SEO / Open Graph). Sin barra final.
  url: "https://www.barberiaimperio.com",

  /**
   * Servicios que ofrece la barbería. Alimentan la sección "Servicios" de la
   * home y el selector del formulario de agenda. Agrega un campo `price` si
   * quieres mostrar precios.
   */
  services: [
    { title: "Corte de cabello", text: "Corte clásico o moderno adaptado a tu estilo, con acabado a navaja." },
    { title: "Arreglo de barba", text: "Perfilado, recorte y diseño de barba con toalla caliente." },
    { title: "Corte + barba", text: "El combo completo: cabello y barba impecables en una sola cita." },
    { title: "Afeitado clásico", text: "Afeitado tradicional a navaja con toalla caliente y aceites." },
    { title: "Corte infantil", text: "Cortes para los más pequeños, con paciencia y buena onda." },
    { title: "Diseños y líneas", text: "Líneas, degradados y diseños personalizados a mano alzada." },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
