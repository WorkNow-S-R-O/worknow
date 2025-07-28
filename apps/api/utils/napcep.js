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

        // Генерация заголовков для вакансий без названия
        for (const job of newJobs) {
            if (job.title === "Без названия") {
                const titleData = await AIJobTitleService.generateAITitle(job.description);
                job.title = titleData.title;
            }
        }

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
    await clearOldData();
    const jobs = await fetchJobDescriptions();
    await createFakeUsersWithJobs(jobs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
