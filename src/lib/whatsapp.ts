import { siteConfig } from "./site-config";

/**
 * Construye un enlace de WhatsApp (wa.me) con un mensaje prellenado.
 * Se usa para los botones "WhatsApp" y para el envío del formulario de contacto.
 */
export function buildWhatsAppUrl(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${text}`;
}

/**
 * Mensaje genérico para los botones de WhatsApp.
 * Sin emojis: algunas versiones de WhatsApp los muestran como rombos (◈).
 */
export function quickQuoteMessage(serviceName?: string): string {
  const base = `Hola, *${siteConfig.name}*. Me gustaría`;
  return serviceName
    ? `${base} más información sobre *${serviceName}*. ¿Me pueden asesorar?`
    : `${base} más información sobre sus servicios. ¿Me pueden asesorar?`;
}

export interface ContactPayload {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha?: string;
  mensaje?: string;
}

/**
 * Arma el mensaje detallado de WhatsApp a partir del formulario de contacto.
 * Solo texto plano con negritas (*así*) para que se vea igual en cualquier
 * dispositivo. Se evitan emojis decorativos.
 */
export function contactToWhatsAppMessage(c: ContactPayload): string {
  const lines = [
    `*Nueva solicitud — ${siteConfig.name}*`,
    ``,
    `*Nombre:* ${c.nombre}`,
    `*Teléfono:* ${c.telefono}`,
    `*Servicio de interés:* ${c.servicio}`,
    c.fecha ? `*Fecha/hora preferida:* ${c.fecha}` : null,
    c.mensaje ? `*Mensaje:* ${c.mensaje}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}
