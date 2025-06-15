import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllSeekers() {
  return prisma.seeker.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createSeeker(data) {
  return prisma.seeker.create({ data });
}

export async function getSeekerBySlug(slug) {
  return prisma.seeker.findUnique({ where: { slug } });
}

export async function deleteSeeker(id) {
  return prisma.seeker.delete({ where: { id: Number(id) } });
}

export async function getSeekerById(id) {
  return prisma.seeker.findUnique({ where: { id: Number(id) } });
}