import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function generateSlug(name, description) {
  return (name + '-' + description.split('\\n')[0])
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAllSeekers() {
  return prisma.seeker.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createSeeker(data) {
  const { name, contact, city, description, gender, isDemanded, facebook, languages, nativeLanguage, category, employment, documents, announcement, note } = data;
  return prisma.seeker.create({
    data: {
      name,
      contact,
      city,
      description,
      gender,
      isDemanded,
      facebook,
      languages,
      nativeLanguage,
      category,
      employment,
      documents,
      announcement,
      note,
      slug: generateSlug(name, description)
    }
  });
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