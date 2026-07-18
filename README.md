# Web Barberías — Plataforma SaaS

Aplicación web para barberías en **Next.js 16 (full-stack) + Tailwind v4 +
Prisma**, con arquitectura **multi-tenant** (una instalación administra varias
barberías) y **control de acceso por roles (RBAC)**.

Se construye por fases. Hoy están listos el **sitio público** (landing con 4
estilos visuales) y la **Fundación SaaS** (base de datos, autenticación y
paneles por rol). Los módulos de negocio se conectan sobre esa base.

## Qué incluye hoy

### Sitio público
- **Home**: Hero con foto por estilo + parallax, Servicios (con fotos), ¿Por qué
  elegirnos?, Proceso, Nosotros, Referencias/galería y CTA final.
- **Agendar** (`/cotizar`): formulario que arma un mensaje y abre WhatsApp.
- **Estilos en vivo** (botón "Estilo"): **Premium**, **Clásico**, **Urbano** y
  **Minimalista** — cada uno reescribe tipografía, colores, superficies, fondo y
  motivos (atributo `data-style` + bloques en `globals.css`). Más modo claro/oscuro.
- Navbar, Footer con mapa, WhatsApp flotante, fondo animado, SEO.

### Fundación SaaS
- **Base de datos multi-tenant** (Prisma): `Tenant` (barbería), `User`,
  `Location` (sede), `Service`, `BarberProfile`, `Appointment`, `Review` y tokens.
  Todo cuelga de un `tenantId` (aislamiento entre negocios).
- **Autenticación**: registro, login y logout con sesión firmada (HMAC, cookie
  httpOnly), contraseñas con scrypt. Recuperación de contraseña (interfaz).
- **RBAC — 4 roles**: `CLIENT`, `BARBER`, `ADMIN`, `OWNER`. Cada rol tiene su
  panel en `/panel/*`, protegido en el servidor (`requireRole`).
- **Esqueleto de paneles** (`/panel`): shell con sidebar por rol y el mapa
  completo de módulos; los pendientes muestran su fase.

## Cómo correrlo

```bash
npm install                 # instala y genera el cliente Prisma
cp .env.example .env         # o usa el .env incluido (SQLite de desarrollo)
npm run db:push              # crea la base SQLite (prisma/dev.db)
npm run db:seed              # siembra la barbería demo y las 4 cuentas
npm run dev                  # http://localhost:3000
```

### Cuentas de demostración (contraseña: `demo1234`)
| Rol | Correo |
|---|---|
| Dueño | `dueno@barberiaimperio.com` |
| Administrador | `admin@barberiaimperio.com` |
| Barbero | `barbero@barberiaimperio.com` |
| Cliente | `cliente@barberiaimperio.com` |

## Base de datos: dev vs producción

- **Desarrollo**: SQLite (`provider = "sqlite"`), corre sin infraestructura.
- **Producción**: cambia el provider a `postgresql` en `prisma/schema.prisma` y
  apunta `DATABASE_URL` a Neon (u otro Postgres). El esquema es portable: no usa
  enums nativos (los roles/estados son String validados en `src/lib/roles.ts`).

## Estado por fases (todas implementadas)
- **Fase 1 — Público**: servicios con precio/duración desde BD, sedes,
  portafolio con filtros, páginas públicas de barberos, reseñas, galería. ✅
- **Fase 2 — Cliente**: perfil editable, historial, agendamiento con
  disponibilidad en tiempo real, asesoría, fidelización, referidos. ✅
- **Fase 3 — Barbero**: agenda (completar/cancelar), ingresos, comisiones,
  clientes frecuentes, estadísticas. ✅
- **Fase 4 — Admin/Dueño**: dashboard con gráficos y tops, comparativo de sedes,
  CRUD de citas/servicios/sedes/personal, clientes, comisiones, financiero,
  reportes CSV, configuración. ✅
- **Fase 5 — Pagos + Notificaciones**: registro de pago por método + comprobante
  imprimible; notificaciones con degradación elegante. ✅ (pasarelas reales
  Stripe/Mercado Pago y envío real de email/WhatsApp/push requieren credenciales).

## Personalización
- `src/lib/site-config.ts` — datos del negocio de la landing.
- `src/lib/theme.ts` + `globals.css` — estilos visuales y paletas.
- Imágenes en `public/hero`, `public/cortes`, `public/nosotros`.
