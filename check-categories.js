import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' }
    });
    
    console.log('All available categories:', categories.map(c => c.id));
    console.log('Total categories:', categories.length);
    console.log('Highest category ID:', Math.max(...categories.map(c => c.id)));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
