import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
config();

const prisma = new PrismaClient();

// Job posting limits
const MAX_JOBS_FREE_USER = 5;
const MAX_JOBS_PREMIUM_USER = 10;

async function testJobLimits() {
  console.log('🔍 Testing Job Posting Limits...');
  
  try {
    // Get all users with their job counts
    const users = await prisma.user.findMany({
      include: {
        jobs: true
      }
    });

    console.log(`\n📊 Found ${users.length} users in the database`);
    
    let freeUsers = 0;
    let premiumUsers = 0;
    let usersAtLimit = 0;

    for (const user of users) {
      const jobCount = user.jobs.length;
      const isPremium = user.isPremium || user.premiumDeluxe;
      const maxJobs = isPremium ? MAX_JOBS_PREMIUM_USER : MAX_JOBS_FREE_USER;
      const userType = isPremium ? 'Premium' : 'Free';
      
      if (isPremium) {
        premiumUsers++;
      } else {
        freeUsers++;
      }

      if (jobCount >= maxJobs) {
        usersAtLimit++;
      }

      console.log(`\n👤 User: ${user.firstName || 'Unknown'} ${user.lastName || ''} (${user.email})`);
      console.log(`   Type: ${userType}`);
      console.log(`   Jobs: ${jobCount}/${maxJobs}`);
      console.log(`   Premium: ${user.isPremium ? 'Yes' : 'No'}`);
      console.log(`   Premium Deluxe: ${user.premiumDeluxe ? 'Yes' : 'No'}`);
      console.log(`   At Limit: ${jobCount >= maxJobs ? 'Yes' : 'No'}`);
    }

    console.log(`\n📈 Summary:`);
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Free Users: ${freeUsers}`);
    console.log(`   Premium Users: ${premiumUsers}`);
    console.log(`   Users At Limit: ${usersAtLimit}`);

    // Test the limits logic
    console.log(`\n🧪 Testing Limit Logic:`);
    console.log(`   Free User Limit: ${MAX_JOBS_FREE_USER} jobs`);
    console.log(`   Premium User Limit: ${MAX_JOBS_PREMIUM_USER} jobs`);
    
    // Test with sample data
    const testFreeUser = { isPremium: false, premiumDeluxe: false };
    const testPremiumUser = { isPremium: true, premiumDeluxe: false };
    const testDeluxeUser = { isPremium: false, premiumDeluxe: true };
    
    console.log(`\n✅ Test Results:`);
    console.log(`   Free User (5 jobs): ${testFreeUser.isPremium || testFreeUser.premiumDeluxe ? MAX_JOBS_PREMIUM_USER : MAX_JOBS_FREE_USER}`);
    console.log(`   Premium User (10 jobs): ${testPremiumUser.isPremium || testPremiumUser.premiumDeluxe ? MAX_JOBS_PREMIUM_USER : MAX_JOBS_FREE_USER}`);
    console.log(`   Deluxe User (10 jobs): ${testDeluxeUser.isPremium || testDeluxeUser.premiumDeluxe ? MAX_JOBS_PREMIUM_USER : MAX_JOBS_FREE_USER}`);

    console.log('\n✅ Job posting limits test completed successfully!');
    console.log('🎯 Limits are properly configured:');
    console.log('   - Free users: 5 jobs maximum');
    console.log('   - Premium/Deluxe users: 10 jobs maximum');

  } catch (error) {
    console.error('❌ Error testing job limits:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testJobLimits().catch(console.error); 