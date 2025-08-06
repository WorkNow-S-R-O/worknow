import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

async function checkCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        
        console.log('📋 Available categories:');
        categories.forEach(cat => {
            console.log(`   - ${cat.name} (ID: ${cat.id})`);
        });
        
        console.log(`\n📊 Total categories: ${categories.length}`);
        
    } catch (error) {
        console.error('❌ Error checking categories:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCategories().catch(console.error); 