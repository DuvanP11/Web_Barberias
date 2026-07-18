// Siembra de datos de demostración: una barbería (tenant) con las 4 cuentas de
// rol, dos sedes y los servicios del catálogo. Idempotente: borra y recrea el
// tenant "barberia-imperio" (el cascade limpia lo asociado).
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

async function main() {
  const existing = await prisma.tenant.findUnique({ where: { slug: SLUG } });
  if (existing) await prisma.tenant.delete({ where: { id: existing.id } });

  const tenant = await prisma.tenant.create({
    data: {
      name: "Barbería Imperio",
      slug: SLUG,
      primaryColor: "#c9a227",
    },
  });

  const hash = hashPassword(PASSWORD);
  const mkUser = (role, firstName, lastName, email, phone) =>
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        role,
        firstName,
        lastName,
        email,
        phone,
        passwordHash: hash,
        emailVerified: new Date(),
      },
    });

  await mkUser("OWNER", "Diego", "Restrepo", "dueno@barberiaimperio.com", "3000000001");
  await mkUser("ADMIN", "Laura", "Gómez", "admin@barberiaimperio.com", "3000000002");
  const barberUser = await mkUser("BARBER", "Andrés", "Marín", "barbero@barberiaimperio.com", "3000000003");
  await mkUser("CLIENT", "Juan", "Pérez", "cliente@barberiaimperio.com", "3000000004");

  await prisma.barberProfile.create({
    data: {
      tenantId: tenant.id,
      userId: barberUser.id,
      specialty: "Fades y diseños",
      experienceYears: 8,
      bio: "Especialista en degradados y trabajo a navaja.",
      rating: 4.9,
      totalCuts: 1240,
      commissionPct: 55,
    },
  });

  await prisma.location.createMany({
    data: [
      {
        tenantId: tenant.id,
        name: "Sede Chapinero",
        address: "Calle 85 #12-34, Local 2",
        phone: "3000000010",
        whatsapp: "573001234567",
        mapQuery: "Calle 85 #12-34, Chapinero, Bogotá",
        schedule: "Mar a Dom, 9:00 a.m. - 8:00 p.m.",
        parking: true,
      },
      {
        tenantId: tenant.id,
        name: "Sede Cedritos",
        address: "Av. 19 #140-20",
        phone: "3000000011",
        whatsapp: "573001234568",
        mapQuery: "Avenida 19 140-20, Cedritos, Bogotá",
        schedule: "Mar a Dom, 10:00 a.m. - 8:00 p.m.",
        parking: false,
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      { tenantId: tenant.id, name: "Corte clásico", description: "Corte tradicional a tijera y máquina.", priceCents: 2500000, durationMin: 30, category: "Cortes" },
      { tenantId: tenant.id, name: "Fade", description: "Degradado profesional a tu medida.", priceCents: 3000000, durationMin: 40, category: "Cortes" },
      { tenantId: tenant.id, name: "Barba", description: "Perfilado y arreglo de barba con toalla caliente.", priceCents: 1800000, durationMin: 20, category: "Barba" },
      { tenantId: tenant.id, name: "Barba + Corte", description: "El combo completo, cabello y barba.", priceCents: 4200000, durationMin: 50, category: "Combos" },
      { tenantId: tenant.id, name: "Tinte", description: "Coloración y cubrimiento de canas.", priceCents: 5500000, durationMin: 60, category: "Color" },
      { tenantId: tenant.id, name: "Diseño", description: "Líneas y diseños personalizados a mano alzada.", priceCents: 2000000, durationMin: 30, category: "Cortes" },
      { tenantId: tenant.id, name: "Limpieza facial", description: "Limpieza e hidratación facial masculina.", priceCents: 3500000, durationMin: 40, category: "Cuidado" },
      { tenantId: tenant.id, name: "Combo Premium", description: "Corte + barba + limpieza facial.", priceCents: 6000000, durationMin: 70, category: "Combos" },
    ],
  });

  console.log("✓ Seed listo. Barbería:", tenant.name);
  console.log("  Cuentas (contraseña:", PASSWORD + "):");
  console.log("   OWNER  dueno@barberiaimperio.com");
  console.log("   ADMIN  admin@barberiaimperio.com");
  console.log("   BARBER barbero@barberiaimperio.com");
  console.log("   CLIENT cliente@barberiaimperio.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
