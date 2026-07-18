// Siembra de datos de demostración: una barbería (tenant) con las cuentas de
// rol, sedes, servicios (con foto), barberos y reseñas. Idempotente: borra y
// recrea el tenant "barberia-imperio" (el cascade limpia lo asociado).
//
// Ejecutar:  npm run db:seed
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

const SLUG = "barberia-imperio";
const PASSWORD = "demo1234";
const CUTS = ["/cortes/1.avif", "/cortes/2.avif", "/cortes/3.jpg", "/cortes/4.avif", "/cortes/5.webp", "/cortes/6.avif"];

async function main() {
  const existing = await prisma.tenant.findUnique({ where: { slug: SLUG } });
  if (existing) await prisma.tenant.delete({ where: { id: existing.id } });

  const tenant = await prisma.tenant.create({
    data: { name: "Barbería Imperio", slug: SLUG, primaryColor: "#c9a227" },
  });

  const hash = hashPassword(PASSWORD);
  const mkUser = (role, firstName, lastName, email, phone) =>
    prisma.user.create({
      data: { tenantId: tenant.id, role, firstName, lastName, email, phone, passwordHash: hash, emailVerified: new Date() },
    });

  await mkUser("OWNER", "Diego", "Restrepo", "dueno@barberiaimperio.com", "3000000001");
  await mkUser("ADMIN", "Laura", "Gómez", "admin@barberiaimperio.com", "3000000002");
  await mkUser("CLIENT", "Juan", "Pérez", "cliente@barberiaimperio.com", "3000000004");

  // --- Barberos (el primero conserva el correo de demo para login) ---
  const barbersData = [
    {
      firstName: "Andrés", lastName: "Marín", email: "barbero@barberiaimperio.com", phone: "3000000003",
      specialty: "Fades y diseños", experienceYears: 8, rating: 4.9, totalCuts: 1240, clientsServed: 820,
      bio: "Especialista en degradados milimétricos y trabajo a navaja. Cada corte es una obra a mano alzada.",
      studies: "Academia de Barbería de Bogotá", certifications: "Fade Master 2022 | Straight Razor Pro",
      languages: "Español, Inglés", instagram: "https://instagram.com/andres.fades", goals: "Abrir mi propia academia de barbería.",
    },
    {
      firstName: "Camilo", lastName: "Ríos", email: "camilo@barberiaimperio.com", phone: "3000000005",
      specialty: "Barba y afeitado clásico", experienceYears: 6, rating: 4.8, totalCuts: 980, clientsServed: 610,
      bio: "Amante del ritual clásico: toalla caliente, navaja y aceites. La barba perfecta es su firma.",
      studies: "Escuela Tradicional de Afeitado", certifications: "Classic Shave Certified",
      languages: "Español", instagram: "https://instagram.com/camilo.barbers", goals: "Ser referente en afeitado tradicional en la ciudad.",
    },
    {
      firstName: "Sebastián", lastName: "Tovar", email: "sebastian@barberiaimperio.com", phone: "3000000006",
      specialty: "Estilos urbanos y color", experienceYears: 5, rating: 4.7, totalCuts: 760, clientsServed: 480,
      bio: "Tendencias, texturas y color. El corte que se ve en redes, hecho realidad.",
      studies: "Diplomado en Colorimetría Masculina", certifications: "Color & Style 2023",
      languages: "Español, Portugués", instagram: "https://instagram.com/seba.styles", goals: "Llevar la barbería colombiana a competencias internacionales.",
    },
  ];

  const barberProfiles = [];
  for (const b of barbersData) {
    const u = await mkUser("BARBER", b.firstName, b.lastName, b.email, b.phone);
    const profile = await prisma.barberProfile.create({
      data: {
        tenantId: tenant.id, userId: u.id,
        specialty: b.specialty, experienceYears: b.experienceYears, bio: b.bio,
        studies: b.studies, certifications: b.certifications, languages: b.languages,
        instagram: b.instagram, goals: b.goals, rating: b.rating, totalCuts: b.totalCuts,
        clientsServed: b.clientsServed, commissionPct: 55,
      },
    });
    barberProfiles.push(profile);
  }

  await prisma.location.createMany({
    data: [
      { tenantId: tenant.id, name: "Sede Chapinero", address: "Calle 85 #12-34, Local 2", phone: "3000000010", whatsapp: "573001234567", mapQuery: "Calle 85 #12-34, Chapinero, Bogotá", schedule: "Mar a Dom, 9:00 a.m. - 8:00 p.m.", parking: true },
      { tenantId: tenant.id, name: "Sede Cedritos", address: "Av. 19 #140-20", phone: "3000000011", whatsapp: "573001234568", mapQuery: "Avenida 19 140-20, Cedritos, Bogotá", schedule: "Mar a Dom, 10:00 a.m. - 8:00 p.m.", parking: false },
    ],
  });

  const services = [
    { name: "Corte clásico", description: "Corte tradicional a tijera y máquina.", priceCents: 2500000, durationMin: 30, category: "Cortes" },
    { name: "Fade", description: "Degradado profesional a tu medida.", priceCents: 3000000, durationMin: 40, category: "Cortes" },
    { name: "Barba", description: "Perfilado y arreglo de barba con toalla caliente.", priceCents: 1800000, durationMin: 20, category: "Barba" },
    { name: "Barba + Corte", description: "El combo completo, cabello y barba.", priceCents: 4200000, durationMin: 50, category: "Combos" },
    { name: "Tinte", description: "Coloración y cubrimiento de canas.", priceCents: 5500000, durationMin: 60, category: "Color" },
    { name: "Diseño", description: "Líneas y diseños personalizados a mano alzada.", priceCents: 2000000, durationMin: 30, category: "Cortes" },
    { name: "Limpieza facial", description: "Limpieza e hidratación facial masculina.", priceCents: 3500000, durationMin: 40, category: "Cuidado" },
    { name: "Combo Premium", description: "Corte + barba + limpieza facial.", priceCents: 6000000, durationMin: 70, category: "Combos" },
  ];
  await prisma.service.createMany({
    data: services.map((s, i) => ({ tenantId: tenant.id, ...s, image: CUTS[i % CUTS.length] })),
  });

  // --- Reseñas aprobadas (autores clientes) ---
  const reviews = [
    { author: ["Mateo", " Hernández"], rating: 5, comment: "El mejor fade que me han hecho en Bogotá. Andrés es un crack.", barber: 0, days: 3 },
    { author: ["Carlos", "Rincón"], rating: 5, comment: "La barba me quedó perfecta y el ambiente es de otro nivel.", barber: 1, days: 8 },
    { author: ["Julián", "Pardo"], rating: 5, comment: "Puntuales, profesionales y a buen precio. Ya soy cliente fijo.", barber: 2, days: 12 },
    { author: ["Andrés", "Salazar"], rating: 4, comment: "Muy buen corte y atención. Volveré sin duda.", barber: 0, days: 18 },
    { author: ["David", "Muñoz"], rating: 5, comment: "El combo premium vale cada peso. Salí como nuevo.", barber: 1, days: 25 },
  ];
  for (const r of reviews) {
    const author = await mkUser("CLIENT", r.author[0], r.author[1].trim(), `${r.author[0].toLowerCase()}.${Date.now()}${Math.round(r.days)}@demo.com`, null);
    await prisma.review.create({
      data: {
        tenantId: tenant.id, authorId: author.id, barberId: barberProfiles[r.barber].id,
        rating: r.rating, comment: r.comment, approved: true,
        createdAt: new Date(Date.now() - r.days * 86400000),
      },
    });
  }

  console.log("✓ Seed listo. Barbería:", tenant.name);
  console.log("  Cuentas (contraseña:", PASSWORD + "):");
  console.log("   OWNER  dueno@barberiaimperio.com");
  console.log("   ADMIN  admin@barberiaimperio.com");
  console.log("   BARBER barbero@barberiaimperio.com");
  console.log("   CLIENT cliente@barberiaimperio.com");
  console.log(`  ${barberProfiles.length} barberos · ${services.length} servicios · ${reviews.length} reseñas`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
