import "server-only";
import { cache } from "react";
import { prisma, hasDatabase } from "./prisma";

/**
 * Acceso a datos del SITIO PÚBLICO. Todo se limita a la barbería principal
 * (primer tenant activo) y degrada con elegancia si no hay base de datos, para
 * que el sitio renderice igual. `cache` deduplica las consultas por request.
 */

export const getPrimaryTenant = cache(async () => {
  if (!hasDatabase) return null;
  try {
    return await prisma.tenant.findFirst({ where: { active: true } });
  } catch {
    return null;
  }
});

export const getPublicServices = cache(async () => {
  const tenant = await getPrimaryTenant();
  if (!tenant) return [];
  try {
    return await prisma.service.findMany({
      where: { tenantId: tenant.id, active: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return [];
  }
});

export const getPublicLocations = cache(async () => {
  const tenant = await getPrimaryTenant();
  if (!tenant) return [];
  try {
    return await prisma.location.findMany({
      where: { tenantId: tenant.id, active: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return [];
  }
});

export const getPublicBarbers = cache(async () => {
  const tenant = await getPrimaryTenant();
  if (!tenant) return [];
  try {
    return await prisma.barberProfile.findMany({
      where: { tenantId: tenant.id, active: true },
      include: { user: true },
      orderBy: { rating: "desc" },
    });
  } catch {
    return [];
  }
});

export const getPublicBarber = cache(async (id: string) => {
  const tenant = await getPrimaryTenant();
  if (!tenant) return null;
  try {
    return await prisma.barberProfile.findFirst({
      where: { id, tenantId: tenant.id, active: true },
      include: {
        user: true,
        reviews: {
          where: { approved: true },
          include: { author: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  } catch {
    return null;
  }
});

export const getApprovedReviews = cache(async (limit = 6) => {
  const tenant = await getPrimaryTenant();
  if (!tenant) return [];
  try {
    return await prisma.review.findMany({
      where: { tenantId: tenant.id, approved: true },
      include: { author: true, barber: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
});
