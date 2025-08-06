import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
config();

const prisma = new PrismaClient();

async function testNewsletterDB() {
  console.log('🔍 Testing newsletter database...');
  
  try {
    // Check all newsletter subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany();
    console.log('📧 All newsletter subscribers:', subscribers);
    
    // Check verification codes
    const verifications = await prisma.newsletterVerification.findMany();
    console.log('🔢 All verification codes:', verifications);
    
    // Test specific email
    const testEmail = 'newtest@example.com';
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: testEmail.trim().toLowerCase() }
    });
    
    console.log(`📧 Checking for email: ${testEmail}`);
    console.log('📧 Existing subscriber:', existingSubscriber);
    
    // Test with peterbaikov12@gmail.com
    const peterEmail = 'peterbaikov12@gmail.com';
    const peterSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: peterEmail.trim().toLowerCase() }
    });
    
    console.log(`📧 Checking for email: ${peterEmail}`);
    console.log('📧 Existing subscriber:', peterSubscriber);
    
  } catch (error) {
    console.error('❌ Error testing newsletter database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewsletterDB().catch(console.error); 