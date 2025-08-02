import { PrismaClient } from '@prisma/client';
import { sendNewCandidatesNotification, sendSingleCandidateNotification } from '../apps/api/services/notificationService.js';

const prisma = new PrismaClient();

// Test data for new candidates
const testCandidates = [
  {
    name: 'Анна Петрова',
    city: 'Тель-Авив',
    description: 'Ищу работу няней с опытом 5 лет. Люблю детей, ответственная, пунктуальная.',
    category: 'няни',
    employment: 'полная',
    languages: ['русский', 'иврит'],
    isDemanded: true,
    contact: '050-123-4567',
    gender: 'женщина',
    nativeLanguage: 'русский',
    documents: 'Теудат Зеут',
    announcement: 'Опытная няня ищет работу',
    note: 'Готова к работе с детьми от 1 года',
    documentType: 'Теудат Зеут'
  },
  {
    name: 'Михаил Козлов',
    city: 'Хайфа',
    description: 'Водитель с правами категории B, C. Опыт работы 8 лет. Ищу работу водителем.',
    category: 'транспорт',
    employment: 'полная',
    languages: ['русский', 'английский'],
    isDemanded: false,
    contact: '050-234-5678',
    gender: 'мужчина',
    nativeLanguage: 'русский',
    documents: 'Рабочая виза',
    announcement: 'Опытный водитель ищет работу',
    note: 'Готов к работе в любом городе',
    documentType: 'Рабочая виза'
  },
  {
    name: 'Елена Сидорова',
    city: 'Иерусалим',
    description: 'Уборщица с опытом 3 года. Тщательная, аккуратная, работаю качественно.',
    category: 'уборка',
    employment: 'частичная',
    languages: ['русский', 'украинский'],
    isDemanded: true,
    contact: '050-345-6789',
    gender: 'женщина',
    nativeLanguage: 'русский',
    documents: 'Виза Б1',
    announcement: 'Уборщица ищет работу',
    note: 'Готова к работе в частных домах и офисах',
    documentType: 'Виза Б1'
  },
  {
    name: 'Дмитрий Волков',
    city: 'Ашдод',
    description: 'Строитель, опыт 6 лет. Работаю с бетоном, кирпичом, отделочные работы.',
    category: 'строительство',
    employment: 'полная',
    languages: ['русский', 'иврит'],
    isDemanded: false,
    contact: '050-456-7890',
    gender: 'мужчина',
    nativeLanguage: 'русский',
    documents: 'Теудат Зеут',
    announcement: 'Строитель ищет работу',
    note: 'Готов к командировкам',
    documentType: 'Теудат Зеут'
  },
  {
    name: 'Ольга Морозова',
    city: 'Нетания',
    description: 'Повар с опытом 4 года. Готовлю русскую, израильскую кухню. Ищу работу поваром.',
    category: 'общепит',
    employment: 'полная',
    languages: ['русский', 'иврит', 'английский'],
    isDemanded: true,
    contact: '050-567-8901',
    gender: 'женщина',
    nativeLanguage: 'русский',
    documents: 'Рабочая виза',
    announcement: 'Повар ищет работу',
    note: 'Специализация: горячий цех',
    documentType: 'Рабочая виза'
  }
];

/**
 * Test function to simulate adding new candidates and sending notifications
 */
async function testCandidateNotifications() {
  try {
    console.log('🧪 Starting candidate notification test...');
    
    // Test 1: Send notification for single candidate
    console.log('\n📧 Test 1: Single candidate notification');
    const singleCandidate = testCandidates[0];
    const singleResult = await sendSingleCandidateNotification(singleCandidate);
    console.log('Single candidate result:', singleResult);
    
    // Test 2: Send notification for multiple candidates
    console.log('\n📧 Test 2: Multiple candidates notification');
    const multipleCandidates = testCandidates.slice(0, 3);
    const multipleResult = await sendNewCandidatesNotification(multipleCandidates);
    console.log('Multiple candidates result:', multipleResult);
    
    // Test 3: Send notification for all 5 candidates
    console.log('\n📧 Test 3: All 5 candidates notification');
    const allCandidatesResult = await sendNewCandidatesNotification(testCandidates);
    console.log('All candidates result:', allCandidatesResult);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Test function to check if users exist in the database
 */
async function checkUsers() {
  try {
    console.log('👥 Checking users in database...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });
    
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName || 'N/A'} ${user.lastName || 'N/A'} (${user.email})`);
    });
    
    if (users.length === 0) {
      console.log('⚠️ No users found. Please add some users to test notifications.');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Test function to create test users if none exist
 */
async function createTestUsers() {
  try {
    console.log('👥 Creating test users...');
    
    const existingUsers = await prisma.user.count();
    
    if (existingUsers === 0) {
      const testUsers = [
        {
          email: 'test1@worknow.com',
          firstName: 'Тестовый',
          lastName: 'Пользователь 1',
          clerkUserId: 'test_clerk_user_1'
        },
        {
          email: 'test2@worknow.com',
          firstName: 'Тестовый',
          lastName: 'Пользователь 2',
          clerkUserId: 'test_clerk_user_2'
        },
        {
          email: 'test3@worknow.com',
          firstName: 'Test',
          lastName: 'User 3',
          clerkUserId: 'test_clerk_user_3'
        }
      ];
      
      for (const userData of testUsers) {
        await prisma.user.create({
          data: userData
        });
        console.log(`✅ Created test user: ${userData.email}`);
      }
      
      console.log('✅ All test users created successfully!');
    } else {
      console.log(`ℹ️ Found ${existingUsers} existing users, skipping test user creation.`);
    }
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'test-notifications':
      await testCandidateNotifications();
      break;
    case 'check-users':
      await checkUsers();
      break;
    case 'create-test-users':
      await createTestUsers();
      break;
    default:
      console.log('Usage:');
      console.log('  node test-candidate-notifications.js test-notifications  - Test notification sending');
      console.log('  node test-candidate-notifications.js check-users        - Check existing users');
      console.log('  node test-candidate-notifications.js create-test-users  - Create test users');
      break;
  }
}

// Run the main function
main().catch(console.error); 