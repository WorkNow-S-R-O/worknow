import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addMissingCategories() {
  const existingIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
  const neededIds = [146, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200];
  
  for (const id of neededIds) {
    if (!existingIds.includes(id)) {
      await prisma.category.create({
        data: {
          id: id,
          name: `Category ${id}`,
          translations: {
            create: [
              { lang: 'ru', name: `Категория ${id}` },
              { lang: 'en', name: `Category ${id}` },
              { lang: 'he', name: `קטגוריה ${id}` },
              { lang: 'ar', name: `فئة ${id}` }
            ]
          }
        }
      });
      console.log(`Created category ${id}`);
    }
  }
  await prisma.$disconnect();
}

addMissingCategories().catch(console.error);
