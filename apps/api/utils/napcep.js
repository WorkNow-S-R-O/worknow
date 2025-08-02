import puppeteer from 'puppeteer';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { fakerRU as faker } from '@faker-js/faker';
import AIJobTitleService from '../services/aiJobTitleService.js';

const prisma = new PrismaClient();
const MAX_JOBS = 200;

// Очистка старых данных перед загрузкой новых
async function clearOldData() {
    console.log("🗑 Удаляем старые данные...");
    await prisma.job.deleteMany({});
    await prisma.user.deleteMany({
        where: { clerkUserId: { startsWith: "user_" } }
    });
    console.log("✅ Очистка завершена!");
}

// Парсинг вакансий с сайта
async function fetchJobDescriptions() {
    console.log("🔍 Запускаем Puppeteer для парсинга Orbita...");

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://doska.orbita.co.il/jobs/required/', { waitUntil: 'networkidle2' });

    let jobs = [];
    let currentPage = 1;

    while (jobs.length < MAX_JOBS) {
        console.log(`📄 Парсим страницу ${currentPage}...`);

        const newJobs = await page.evaluate(() => {
            const jobElements = document.querySelectorAll('.message');
            const jobData = [];

            jobElements.forEach((job) => {
                let description = job.querySelector('.information')?.innerText.trim() || 'Описание отсутствует';
                let title = job.querySelector('.caption .cap')?.innerText.trim() || null;
                let city = job.querySelector('.hidden-xs a')?.innerText.trim() || 'Не указан';

                // 🔍 Проверяем наличие номера телефона в описании
                let phoneMatch = description.match(/\+972[-\s]?\d{1,2}[-\s]?\d{3}[-\s]?\d{4,6}/);
                let phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : null;

                if (!title) {
                    title = "Без названия";
                }

                // ✅ Только добавляем вакансии с телефонными номерами
                if (phone) {
                    jobData.push({ title, description, city, phone });
                }
            });

            return jobData;
        });

        console.log(`   📊 Найдено ${newJobs.length} вакансий на странице ${currentPage}`);
        jobs = [...jobs, ...newJobs];
        console.log(`   📈 Всего собрано: ${jobs.length} вакансий`);

        if (jobs.length >= MAX_JOBS) {
            console.log("✅ Достигли лимита вакансий.");
            break;
        }

        // Поиск ссылки "Следующая страница"
        const nextPageUrl = await page.evaluate(() => {
            const nextLink = Array.from(document.querySelectorAll('a')).find(a => a.title === "Следующая");
            return nextLink ? nextLink.href : null;
        });

        if (!nextPageUrl) {
            console.log("✅ Больше страниц нет.");
            break;
        }

        // Переход на следующую страницу
        await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
        currentPage++;
    }

    await browser.close();
    console.log(`✅ Найдено ${jobs.length} вакансий`);
    return jobs.slice(0, MAX_JOBS);
}

// Генерация заголовков для вакансий с использованием fallback системы
async function generateJobTitles(jobs) {
    console.log("🤖 Генерируем заголовки для вакансий...");
    console.log("💡 Используем надежную fallback систему (rule-based)");
    console.log("✅ Нет ограничений по rate limits или quota");
    console.log("⚡ Мгновенная обработка без задержек");
    
    let successCount = 0;
    let fallbackCount = 0;
    let totalTime = 0;
    
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        
        try {
            if (job.title === "Без названия") {
                console.log(`   🔄 Генерируем заголовок для вакансии ${i + 1}/${jobs.length}...`);
                
                const startTime = Date.now();
                
                // Используем fallback систему напрямую для надежности
                const titleData = AIJobTitleService.fallbackTitleGeneration(job.description);
                const endTime = Date.now();
                
                job.title = titleData.title;
                const processingTime = endTime - startTime;
                totalTime += processingTime;
                
                console.log(`   ✅ Успех: "${titleData.title}" (${titleData.method}, ${processingTime}ms)`);
                console.log(`   🎯 Confidence: ${titleData.confidence.toFixed(2)}`);
                
                successCount++;
                fallbackCount++;
                
                // Небольшая задержка для логирования (не для rate limiting)
                if (i % 10 === 0) {
                    console.log(`   📊 Прогресс: ${i + 1}/${jobs.length} (${((i + 1) / jobs.length * 100).toFixed(1)}%)`);
                }
            }
        } catch (error) {
            console.error(`   ❌ Ошибка генерации заголовка для вакансии ${i + 1}:`, error.message);
            
            // Используем базовый fallback заголовок
            job.title = "Общая вакансия";
            fallbackCount++;
        }
    }
    
    console.log(`\n📊 Генерация заголовков завершена:`);
    console.log(`   Успешно обработано: ${successCount}`);
    console.log(`   Использовано fallback: ${fallbackCount}`);
    console.log(`   Среднее время обработки: ${(totalTime / successCount).toFixed(0)}ms`);
    console.log(`   Общее время: ${totalTime}ms`);
    
    console.log(`\n💡 Преимущества fallback системы:`);
    console.log(`   ✅ Нет API затрат`);
    console.log(`   ✅ Нет rate limits`);
    console.log(`   ✅ Нет quota проблем`);
    console.log(`   ✅ Мгновенная обработка`);
    console.log(`   ✅ Надежные результаты`);
    console.log(`   ✅ Всегда доступна`);
    
    return jobs;
}

// Создание фейковых пользователей и прикрепление вакансий
async function createFakeUsersWithJobs(jobs) {
    console.log(`👥 Создаем фейковых пользователей и привязываем вакансии...`);

    const defaultCategory = await prisma.category.findUnique({
        where: { name: 'Разное' },
    });

    if (!defaultCategory) {
        console.error('❌ Категория "Разное" не найдена. Пожалуйста, запустите `prisma db seed`');
        return;
    }

    for (const job of jobs) {
        const city = await prisma.city.findUnique({ where: { name: job.city } });

        if (!city) {
            console.log(`⚠️ Город "${job.city}" не найден в базе. Пропускаем вакансию.`);
            continue;
        }

        // Генерация русско-еврейских имен
        const firstName = Math.random() < 0.5 ? faker.person.firstName() : faker.helpers.arrayElement([
            "Авраам", "Ицхак", "Яков", "Моше", "Шломо", "Давид", "Элиэзер", "Менахем", "Иехуда", "Шимон",
            "Сара", "Рахель", "Лея", "Мириам", "Хана", "Батшева", "Ада", "Эстер", "Тамар", "Наоми"
        ]);
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        const clerkUserId = `user_${faker.string.uuid()}`;

        // ✅ Используем только реальный номер телефона из объявления
        const phone = job.phone;

        // Генерация реалистичной зарплаты
        const salary = `${faker.number.int({ min: 35, max: 50 })}`;

        // 🟢 Генерация URL аватарки с инициалами
        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=128`;

        await prisma.user.create({
            data: {
                clerkUserId,
                firstName,
                lastName,
                email,
                imageUrl, // Используем аватарку с инициалами
                jobs: {
                    create: {
                        title: job.title,
                        description: job.description,
                        salary: salary,
                        phone: phone,
                        city: { connect: { id: city.id } },
                        category: { connect: { id: defaultCategory.id } },
                    },
                },
            },
        });
    }

    console.log("🎉 Все фейковые пользователи и вакансии успешно созданы!");
}

// Основная функция
async function main() {
    try {
        console.log("🚀 Запуск скрипта с надежной fallback системой...\n");
        console.log("💡 Используем rule-based генерацию заголовков");
        console.log("✅ Нет зависимости от OpenAI API");
        console.log("⚡ Быстрая и надежная обработка\n");
        
        await clearOldData();
        const jobs = await fetchJobDescriptions();
        
        // Генерируем заголовки с надежной fallback системой
        const jobsWithTitles = await generateJobTitles(jobs);
        
        await createFakeUsersWithJobs(jobsWithTitles);
        
        console.log("\n✅ Скрипт успешно завершен!");
        console.log("📊 Статистика:");
        console.log(`   - Всего вакансий: ${jobs.length}`);
        console.log(`   - Успешно обработано: ${jobs.filter(j => j.title !== "Без названия").length}`);
        console.log(`   - Использовано fallback: ${jobs.filter(j => j.title !== "Без названия").length}`);
        
        console.log("\n💡 Преимущества обновленной системы:");
        console.log("   - Нет API затрат");
        console.log("   - Нет rate limits или quota проблем");
        console.log("   - Мгновенная обработка");
        console.log("   - 100% надежность");
        console.log("   - Подходящие заголовки для израильского рынка");
        
    } catch (error) {
        console.error("❌ Критическая ошибка в скрипте:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
