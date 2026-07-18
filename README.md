# Web Barberías — Plantilla base

Plantilla web de negocio en **Next.js 16 + Tailwind v4**, lista para convertirse
en la página de una barbería (o cualquier negocio de servicios con cita).

Es una **plantilla neutra**: conserva el sistema de diseño (temas claro/oscuro +
5 acentos, animaciones, componentes) pero sin marca, sin fotos, sin roles de
acceso y sin datos de ningún negocio en particular.

## Qué incluye

- **Home** de una sola página: Hero, barra de confianza, Servicios, ¿Por qué
  elegirnos?, Proceso, Nosotros, Referencias/galería y CTA final.
- **Agendar** (`/cotizar`): formulario que arma un mensaje y abre WhatsApp con
  los datos prellenados (sin base de datos).
- **Temas en vivo**: modo claro/oscuro y 5 colores de acento, elegibles por el
  visitante desde la barra superior. Se guardan en el navegador.
- **Navbar**, **Footer** (con mapa), **WhatsApp flotante** y **fondo animado**.
- Metadata/SEO, `robots.ts`, `sitemap.ts` e icono.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verifica el build de producción
```

## Cómo personalizarlo (lo mínimo)

1. **`src/lib/site-config.ts`** — el ÚNICO archivo con datos del negocio: nombre,
   WhatsApp, correo, dirección, horario, redes y la lista de **servicios**.
2. **Fotos** — hoy hay marcos "Espacio para foto" y "Foto próximamente" en Hero,
   Nosotros, Servicios y la galería. Reemplázalos por `<Image/>` cuando tengas el
   material (los dominios remotos permitidos se configuran en `next.config.ts`).
3. **Textos** — los marcadores de posición viven dentro de cada sección en
   `src/components/home/`.
4. **Color de marca** — el acento por defecto es "morado"; se cambia en el
   `@theme` de `src/app/globals.css` o desde el selector de tema.

## Qué NO trae (a propósito)

- Panel de administración, login ni roles de acceso.
- Base de datos / Prisma.
- Carrito ni catálogo con configurador.

Todo eso puede añadirse después; esta base está pensada para publicar rápido una
landing y crecer desde ahí.
