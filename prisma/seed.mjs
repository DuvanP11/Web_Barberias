// Siembra de datos de demostración: barbería (tenant) con cuentas de rol, sedes,
// servicios, barberos, reseñas e HISTORIAL de citas/pagos/gastos (para que los
// paneles y dashboards tengan datos reales). Idempotente: borra y recrea el
// tenant "barberia-imperio".
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
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const SLUG = "barberia-imperio";
const PASSWORD = "demo1234";
const CUTS = ["/cortes/1.avif", "/cortes/2.avif", "/cortes/3.jpg", "/cortes/4.avif", "/cortes/5.webp", "/cortes/6.avif"];

async function main() {
  const existing = await prisma.tenant.findUnique({ where: { slug: SLUG } });
  if (existing) {
    const t = existing.id;
    // Borrado en orden de dependencia (las citas usan FK Restrict a sede/servicio/etc.)
    await prisma.payment.deleteMany({ where: { tenantId: t } });
    await prisma.expense.deleteMany({ where: { tenantId: t } });
    await prisma.review.deleteMany({ where: { tenantId: t } });
    await prisma.appointment.deleteMany({ where: { tenantId: t } });
    await prisma.barberProfile.deleteMany({ where: { tenantId: t } });
    await prisma.service.deleteMany({ where: { tenantId: t } });
    await prisma.location.deleteMany({ where: { tenantId: t } });
    await prisma.verificationToken.deleteMany({ where: { user: { tenantId: t } } });
    await prisma.user.deleteMany({ where: { tenantId: t } });
    await prisma.tenant.delete({ where: { id: t } });
  }

  const tenant = await prisma.tenant.create({
    data: { name: "Barbería Imperio", slug: SLUG, primaryColor: "#c9a227" },
  });
  const hash = hashPassword(PASSWORD);
  const mkUser = (role, firstName, lastName, email, phone) =>
    prisma.user.create({ data: { tenantId: tenant.id, role, firstName, lastName, email, phone, passwordHash: hash, emailVerified: new Date() } });

  await mkUser("OWNER", "Diego", "Restrepo", "dueno@barberiaimperio.com", "3000000001");
  await mkUser("ADMIN", "Laura", "Gómez", "admin@barberiaimperio.com", "3000000002");

  // Clientes (el primero es la cuenta de demo)
  const clientSpecs = [
    ["Juan", "Pérez", "cliente@barberiaimperio.com"],
    ["Mateo", "Hernández", "mateo@demo.com"],
    ["Carlos", "Rincón", "carlos@demo.com"],
    ["Julián", "Pardo", "julian@demo.com"],
    ["David", "Muñoz", "david@demo.com"],
    ["Andrés", "Salazar", "andres.s@demo.com"],
  ];
  const clients = [];
  for (const [f, l, e] of clientSpecs) clients.push(await mkUser("CLIENT", f, l, e, "30012345" + clients.length));

  // Barberos
  const barbersData = [
    { firstName: "Andrés", lastName: "Marín", email: "barbero@barberiaimperio.com", phone: "3000000003", specialty: "Fades y diseños", experienceYears: 8, rating: 4.9, totalCuts: 1240, clientsServed: 820, bio: "Especialista en degradados milimétricos y trabajo a navaja.", studies: "Academia de Barbería de Bogotá", certifications: "Fade Master 2022 | Straight Razor Pro", languages: "Español, Inglés", instagram: "https://instagram.com/andres.fades", goals: "Abrir mi propia academia de barbería." },
    { firstName: "Camilo", lastName: "Ríos", email: "camilo@barberiaimperio.com", phone: "3000000005", specialty: "Barba y afeitado clásico", experienceYears: 6, rating: 4.8, totalCuts: 980, clientsServed: 610, bio: "Amante del ritual clásico: toalla caliente, navaja y aceites.", studies: "Escuela Tradicional de Afeitado", certifications: "Classic Shave Certified", languages: "Español", instagram: "https://instagram.com/camilo.barbers", goals: "Ser referente en afeitado tradicional." },
    { firstName: "Sebastián", lastName: "Tovar", email: "sebastian@barberiaimperio.com", phone: "3000000006", specialty: "Estilos urbanos y color", experienceYears: 5, rating: 4.7, totalCuts: 760, clientsServed: 480, bio: "Tendencias, texturas y color.", studies: "Diplomado en Colorimetría Masculina", certifications: "Color & Style 2023", languages: "Español, Portugués", instagram: "https://instagram.com/seba.styles", goals: "Llevar la barbería colombiana a competencias internacionales." },
  ];
  const barbers = [];
  for (const b of barbersData) {
    const u = await mkUser("BARBER", b.firstName, b.lastName, b.email, b.phone);
    barbers.push(await prisma.barberProfile.create({
      data: { tenantId: tenant.id, userId: u.id, specialty: b.specialty, experienceYears: b.experienceYears, bio: b.bio, studies: b.studies, certifications: b.certifications, languages: b.languages, instagram: b.instagram, goals: b.goals, rating: b.rating, totalCuts: b.totalCuts, clientsServed: b.clientsServed, commissionPct: pick([50, 55, 60]) },
    }));
  }

  const locData = [
    { name: "Sede Chapinero", address: "Calle 85 #12-34, Local 2", phone: "3000000010", whatsapp: "573001234567", mapQuery: "Calle 85 #12-34, Chapinero, Bogotá", schedule: "Mar a Dom, 9:00 a.m. - 8:00 p.m.", parking: true },
    { name: "Sede Cedritos", address: "Av. 19 #140-20", phone: "3000000011", whatsapp: "573001234568", mapQuery: "Avenida 19 140-20, Cedritos, Bogotá", schedule: "Mar a Dom, 10:00 a.m. - 8:00 p.m.", parking: false },
  ];
  const locations = [];
  for (const l of locData) locations.push(await prisma.location.create({ data: { tenantId: tenant.id, ...l } }));

  const serviceData = [
    { name: "Corte clásico", description: "Corte tradicional a tijera y máquina.", priceCents: 2500000, durationMin: 30, category: "Cortes" },
    { name: "Fade", description: "Degradado profesional a tu medida.", priceCents: 3000000, durationMin: 40, category: "Cortes" },
    { name: "Barba", description: "Perfilado y arreglo de barba con toalla caliente.", priceCents: 1800000, durationMin: 20, category: "Barba" },
    { name: "Barba + Corte", description: "El combo completo, cabello y barba.", priceCents: 4200000, durationMin: 50, category: "Combos" },
    { name: "Tinte", description: "Coloración y cubrimiento de canas.", priceCents: 5500000, durationMin: 60, category: "Color" },
    { name: "Diseño", description: "Líneas y diseños personalizados a mano alzada.", priceCents: 2000000, durationMin: 30, category: "Cortes" },
    { name: "Limpieza facial", description: "Limpieza e hidratación facial masculina.", priceCents: 3500000, durationMin: 40, category: "Cuidado" },
    { name: "Combo Premium", description: "Corte + barba + limpieza facial.", priceCents: 6000000, durationMin: 70, category: "Combos" },
  ];
  const services = [];
  for (let i = 0; i < serviceData.length; i++) {
    services.push(await prisma.service.create({ data: { tenantId: tenant.id, ...serviceData[i], image: CUTS[i % CUTS.length] } }));
  }

  // --- Historial de citas + pagos (últimos ~60 días) ---
  const METHODS = ["CASH", "CARD", "NEQUI", "PSE", "DAVIPLATA"];
  let completed = 0;
  for (let i = 0; i < 55; i++) {
    const svc = pick(services);
    const barber = pick(barbers);
    const client = pick(clients);
    const location = pick(locations);
    const daysAgo = 1 + Math.floor(Math.random() * 60);
    const hour = 9 + Math.floor(Math.random() * 9);
    const min = pick([0, 30]);
    const start = new Date(); start.setDate(start.getDate() - daysAgo); start.setHours(hour, min, 0, 0);
    const end = new Date(start.getTime() + svc.durationMin * 60000);
    const roll = Math.random();
    const status = roll < 0.82 ? "COMPLETED" : roll < 0.92 ? "CANCELLED" : "COMPLETED";
    const appt = await prisma.appointment.create({
      data: { tenantId: tenant.id, locationId: location.id, clientId: client.id, barberId: barber.id, serviceId: svc.id, startAt: start, endAt: end, priceCents: svc.priceCents, status },
    });
    if (status === "COMPLETED") {
      completed++;
      await prisma.payment.create({ data: { tenantId: tenant.id, appointmentId: appt.id, method: pick(METHODS), amountCents: svc.priceCents, status: "PAID" } });
    }
  }
  // Próximas citas confirmadas
  for (let i = 0; i < 8; i++) {
    const svc = pick(services); const barber = pick(barbers); const client = pick(clients); const location = pick(locations);
    const daysAhead = 1 + Math.floor(Math.random() * 12);
    const hour = 9 + Math.floor(Math.random() * 9);
    const start = new Date(); start.setDate(start.getDate() + daysAhead); start.setHours(hour, pick([0, 30]), 0, 0);
    const end = new Date(start.getTime() + svc.durationMin * 60000);
    await prisma.appointment.create({ data: { tenantId: tenant.id, locationId: location.id, clientId: client.id, barberId: barber.id, serviceId: svc.id, startAt: start, endAt: end, priceCents: svc.priceCents, status: "CONFIRMED" } });
  }

  // --- Gastos ---
  const expenseData = [
    { concept: "Arriendo del local", category: "Fijos", amountCents: 250000000 },
    { concept: "Insumos y productos", category: "Insumos", amountCents: 80000000 },
    { concept: "Servicios públicos", category: "Fijos", amountCents: 35000000 },
    { concept: "Publicidad en redes", category: "Marketing", amountCents: 20000000 },
  ];
  for (const e of expenseData) {
    const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    await prisma.expense.create({ data: { tenantId: tenant.id, locationId: pick(locations).id, ...e, date: d } });
  }

  // --- Reseñas aprobadas ---
  const reviews = [
    { by: 1, text: "El mejor fade que me han hecho en Bogotá. Andrés es un crack.", barber: 0, r: 5, d: 3 },
    { by: 2, text: "La barba me quedó perfecta y el ambiente es de otro nivel.", barber: 1, r: 5, d: 8 },
    { by: 3, text: "Puntuales, profesionales y a buen precio. Ya soy cliente fijo.", barber: 2, r: 5, d: 12 },
    { by: 5, text: "Muy buen corte y atención. Volveré sin duda.", barber: 0, r: 4, d: 18 },
    { by: 4, text: "El combo premium vale cada peso. Salí como nuevo.", barber: 1, r: 5, d: 25 },
  ];
  for (const rv of reviews) {
    await prisma.review.create({ data: { tenantId: tenant.id, authorId: clients[rv.by].id, barberId: barbers[rv.barber].id, rating: rv.r, comment: rv.text, approved: true, createdAt: new Date(Date.now() - rv.d * 86400000) } });
  }

  console.log("✓ Seed listo.", tenant.name);
  console.log(`  Cuentas (contraseña: ${PASSWORD}): dueno@ / admin@ / barbero@ / cliente@ barberiaimperio.com`);
  console.log(`  ${barbers.length} barberos · ${services.length} servicios · ${locations.length} sedes · ${completed} citas completadas con pago · 8 próximas`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
