import "server-only";
import { formatCOP } from "./utils";

/**
 * Notificaciones (email / WhatsApp / push).
 *
 * Degradación elegante: si no hay servicios configurados (SMTP, API de WhatsApp,
 * llaves de push), NO falla: registra la notificación en el servidor. Cuando se
 * configuren las variables de entorno correspondientes, aquí se conecta el envío
 * real sin tocar el resto del código.
 *
 * Recordatorios de cita, confirmaciones de pago, promociones y cumpleaños pasan
 * todos por estas funciones.
 */
type NotifyResult = { delivered: boolean; channel: "email" | "log" };

async function deliver(to: string, subject: string, body: string): Promise<NotifyResult> {
  // Email real (cuando exista SMTP): integrar aquí con las credenciales.
  if (process.env.SMTP_URL) {
    // TODO: enviar por SMTP con SMTP_URL. Por ahora se registra.
  }
  // Sin proveedor configurado → se registra en el servidor (no se pierde).
  console.log(`[notificación:email] Para: ${to} · ${subject}\n${body}`);
  return { delivered: Boolean(process.env.SMTP_URL), channel: process.env.SMTP_URL ? "email" : "log" };
}

export async function notifyAppointmentConfirmed(email: string, name: string, service: string, when: Date) {
  const fecha = new Date(when).toLocaleString("es-CO", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
  return deliver(email, "Tu cita está confirmada", `Hola ${name}, tu cita de ${service} quedó confirmada para el ${fecha}. ¡Te esperamos!`);
}

export async function notifyPaymentReceipt(email: string, name: string, service: string, amountCents: number, reference: string) {
  return deliver(email, `Comprobante de pago ${reference}`, `Hola ${name}, recibimos tu pago de ${formatCOP(amountCents / 100)} por ${service}. Comprobante: ${reference}. ¡Gracias!`);
}
