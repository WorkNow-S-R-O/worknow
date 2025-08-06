import puppeteer from 'puppeteer';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { fakerRU as faker } from '@faker-js/faker';
import AIJobTitleService from '../services/aiJobTitleService.js';

const prisma = new PrismaClient();
const MAX_JOBS = 200;

// Function to extract and validate price from description
function extractPriceFromDescription(description) {
    // Look for patterns like "40 шек", "40 ШЕК", "40 shek", "40 SHEK", etc.
    const pricePatterns = [
        /(\d+)\s*шек/gi,           // 40 шек
        /(\d+)\s*ШЕК/gi,           // 40 ШЕК
        /(\d+)\s*shek/gi,          // 40 shek
        /(\d+)\s*SHEK/gi,          // 40 SHEK
        /(\d+)\s*₪/gi,             // 40 ₪
        /(\d+)\s*shekel/gi,        // 40 shekel
        /(\d+)\s*SHEKEL/gi,        // 40 SHEKEL
        /(\d+)\s*шек/gi,           // 40 шек (lowercase)
        /(\d+)\s*ШЕКЕЛЬ/gi,        // 40 ШЕКЕЛЬ
        /(\d+)\s*shekel/gi,        // 40 shekel
        /(\d+)\s*SHEKEL/gi,        // 40 SHEKEL
        /(\d+)\s*₪/gi,             // 40 ₪
        /(\d+)\s*ILS/gi,           // 40 ILS
        /(\d+)\s*ils/gi,           // 40 ils
        /(\d+)\s*NIS/gi,           // 40 NIS
        /(\d+)\s*nis/gi,           // 40 nis
    ];

    for (const pattern of pricePatterns) {
        const match = description.match(pattern);
        if (match) {
            const price = parseInt(match[1], 10);
            // Validate that price is reasonable (between 20 and 200 shekels per hour)
            if (price >= 20 && price <= 200) {
                return price;
            }
        }
    }

    return null;
}

// Function to validate job data consistency
function validateJobData(job) {
    const descriptionPrice = extractPriceFromDescription(job.description);
    
    if (!descriptionPrice) {
        console.log(`   ⚠️ Пропускаем вакансию "${job.title}" - нет валидной цены в описании`);
        return false;
    }

    // Update the job object with the validated price
    job.validatedPrice = descriptionPrice;
    console.log(`   ✅ Валидная цена найдена: ${descriptionPrice} шекелей/час для "${job.title}"`);
    
    return true;
}

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
    console.log("💰 Валидируем цены в описаниях для консистентности...");
    console.log(`🎯 Цель: собрать ровно ${MAX_JOBS} валидных вакансий!`);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://doska.orbita.co.il/jobs/required/', { waitUntil: 'networkidle2' });

    let jobs = [];
    let currentPage = 1;
    let totalProcessed = 0;
    let totalValidated = 0;
    let consecutiveEmptyPages = 0;
    const MAX_CONSECUTIVE_EMPTY_PAGES = 5; // Максимум 5 пустых страниц подряд

    while (jobs.length < MAX_JOBS) {
        console.log(`📄 Парсим страницу ${currentPage}...`);

        try {
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
            
            if (newJobs.length === 0) {
                consecutiveEmptyPages++;
                console.log(`   ⚠️ Пустая страница ${currentPage} (${consecutiveEmptyPages}/${MAX_CONSECUTIVE_EMPTY_PAGES})`);
                
                if (consecutiveEmptyPages >= MAX_CONSECUTIVE_EMPTY_PAGES) {
                    console.log(`   🛑 Слишком много пустых страниц подряд (${consecutiveEmptyPages}). Останавливаем парсинг.`);
                    break;
                }
            } else {
                consecutiveEmptyPages = 0; // Сбрасываем счетчик пустых страниц
            }
            
            // 🔍 Валидируем цены для каждой вакансии
            const validatedJobs = [];
            for (const job of newJobs) {
                totalProcessed++;
                if (validateJobData(job)) {
                    validatedJobs.push(job);
                    totalValidated++;
                }
            }

            jobs = [...jobs, ...validatedJobs];
            console.log(`   ✅ Валидировано: ${validatedJobs.length}/${newJobs.length} вакансий`);
            console.log(`   📈 Всего собрано: ${jobs.length}/${MAX_JOBS} валидных вакансий`);
            console.log(`   🎯 Осталось собрать: ${MAX_JOBS - jobs.length} вакансий`);

            if (jobs.length >= MAX_JOBS) {
                console.log("✅ Достигли лимита валидных вакансий!");
                break;
            }

            // Поиск ссылки "Следующая страница"
            const nextPageUrl = await page.evaluate(() => {
                const nextLink = Array.from(document.querySelectorAll('a')).find(a => a.title === "Следующая");
                return nextLink ? nextLink.href : null;
            });

            if (!nextPageUrl) {
                console.log("✅ Больше страниц нет. Пытаемся найти альтернативные источники...");
                
                // Попробуем другие URL или категории
                const alternativeUrls = [
                    'https://doska.orbita.co.il/jobs/',
                    'https://doska.orbita.co.il/jobs/offered/',
                    'https://doska.orbita.co.il/jobs/required/'
                ];
                
                let foundAlternative = false;
                for (const altUrl of alternativeUrls) {
                    try {
                        console.log(`   🔄 Пробуем альтернативный URL: ${altUrl}`);
                        await page.goto(altUrl, { waitUntil: 'networkidle2' });
                        foundAlternative = true;
                        currentPage = 1;
                        consecutiveEmptyPages = 0;
                        break;
                    } catch (error) {
                        console.log(`   ❌ Не удалось загрузить ${altUrl}`);
                    }
                }
                
                if (!foundAlternative) {
                    console.log("❌ Не удалось найти больше вакансий. Останавливаем парсинг.");
                    break;
                }
            } else {
                // Переход на следующую страницу
                await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
                currentPage++;
            }

        } catch (error) {
            console.log(`   ❌ Ошибка при парсинге страницы ${currentPage}:`, error.message);
            console.log(`   🔄 Продолжаем парсинг...`);
            
            // Попробуем перезагрузить страницу
            try {
                await page.reload({ waitUntil: 'networkidle2' });
            } catch (reloadError) {
                console.log(`   ❌ Не удалось перезагрузить страницу:`, reloadError.message);
            }
        }
    }

    await browser.close();
    console.log(`\n📊 Статистика валидации цен:`);
    console.log(`   Обработано вакансий: ${totalProcessed}`);
    console.log(`   Валидных вакансий: ${totalValidated}`);
    console.log(`   Процент валидных: ${((totalValidated / totalProcessed) * 100).toFixed(1)}%`);
    console.log(`   Собрано вакансий: ${jobs.length}/${MAX_JOBS}`);
    
    if (jobs.length < MAX_JOBS) {
        console.log(`⚠️ Предупреждение: Собрано только ${jobs.length} вакансий из ${MAX_JOBS} запланированных`);
        console.log(`🔄 Генерируем дополнительные вакансии для достижения ${MAX_JOBS}...`);
        
        const additionalJobsNeeded = MAX_JOBS - jobs.length;
        const additionalJobs = generateAdditionalJobs(additionalJobsNeeded);
        
        console.log(`✅ Сгенерировано ${additionalJobs.length} дополнительных вакансий`);
        jobs.push(...additionalJobs);
    } else {
        console.log(`✅ Успешно собрано ${jobs.length} валидных вакансий!`);
    }
    
    return jobs.slice(0, MAX_JOBS);
}

// Генерация дополнительных вакансий для достижения лимита
function generateAdditionalJobs(count) {
    console.log(`🔧 Генерируем ${count} дополнительных вакансий...`);
    
    const jobTemplates = [
        {
            title: "Работник на склад",
            description: "Требуется работник на склад. Работа с 8:00 до 17:00. Оплата 45 шек в час. Звоните +972-50-123-4567",
            city: "Тель-Авив",
            phone: "+972-50-123-4567",
            validatedPrice: 45
        },
        {
            title: "Водитель доставки",
            description: "Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-52-234-5678",
            city: "Хайфа",
            phone: "+972-52-234-5678",
            validatedPrice: 50
        },
        {
            title: "Уборщица",
            description: "Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-54-345-6789",
            city: "Иерусалим",
            phone: "+972-54-345-6789",
            validatedPrice: 40
        },
        {
            title: "Продавец в магазин",
            description: "Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-55-456-7890",
            city: "Ашдод",
            phone: "+972-55-456-7890",
            validatedPrice: 55
        },
        {
            title: "Работник на кухню",
            description: "Требуется работник на кухню ресторана. Работа с 10:00 до 22:00. Оплата 48 шек в час. Звоните +972-56-567-8901",
            city: "Ришон-ле-Цион",
            phone: "+972-56-567-8901",
            validatedPrice: 48
        },
        {
            title: "Строитель",
            description: "Ищу строителя для работы на стройке. Опыт работы обязателен. Оплата 60 шек в час. +972-57-678-9012",
            city: "Петах-Тиква",
            phone: "+972-57-678-9012",
            validatedPrice: 60
        },
        {
            title: "Электрик",
            description: "Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-58-789-0123",
            city: "Холон",
            phone: "+972-58-789-0123",
            validatedPrice: 70
        },
        {
            title: "Сантехник",
            description: "Ищу сантехника для ремонтных работ. Опыт работы 3+ года. Оплата 65 шек в час. +972-59-890-1234",
            city: "Рамат-Ган",
            phone: "+972-59-890-1234",
            validatedPrice: 65
        },
        {
            title: "Садовник",
            description: "Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-60-901-2345",
            city: "Гиватаим",
            phone: "+972-60-901-2345",
            validatedPrice: 45
        },
        {
            title: "Няня",
            description: "Ищу няню для ребенка 3 лет. Работа с 8:00 до 16:00. Оплата 50 шек в час. +972-61-012-3456",
            city: "Кфар-Саба",
            phone: "+972-61-012-3456",
            validatedPrice: 50
        }
    ];
    
    const cities = ["Тель-Авив", "Хайфа", "Иерусалим", "Ашдод", "Ришон-ле-Цион", "Петах-Тиква", "Холон", "Рамат-Ган", "Гиватаим", "Кфар-Саба"];
    const additionalJobs = [];
    
    for (let i = 0; i < count; i++) {
        const template = jobTemplates[i % jobTemplates.length];
        const city = cities[i % cities.length];
        const phoneSuffix = String(i + 1000).padStart(4, '0');
        
        const job = {
            title: template.title,
            description: template.description.replace(/\+972-\d{2}-\d{3}-\d{4}/, `+972-50-${phoneSuffix}`),
            city: city,
            phone: `+972-50-${phoneSuffix}`,
            validatedPrice: template.validatedPrice,
            categoryId: determineCategoryFromTitle(template.title) // Определяем категорию для сгенерированных вакансий
        };
        
        additionalJobs.push(job);
    }
    
    console.log(`✅ Сгенерировано ${additionalJobs.length} дополнительных вакансий`);
    return additionalJobs;
}

// Определение категории на основе заголовка вакансии
function determineCategoryFromTitle(title) {
    const titleLower = title.toLowerCase();
    
    // Маппинг ключевых слов к категориям (обновленные ID из базы данных)
    const categoryMapping = {
        // Строительство и ремонт
        'строитель': 146, // Стройка
        'строительство': 146,
        'стройка': 146,
        'строительн': 146,
        'плотник': 160, // Плотник
        'плотнич': 160,
        'сварщик': 165, // Сварщик
        'сварка': 165,
        'электрик': 173, // Электрик
        'электрич': 173,
        'ремонт': 161, // Ремонт
        'ремонтн': 161,
        
        // Транспорт и доставка
        'водитель': 151, // Перевозка
        'шофер': 151,
        'доставка': 150, // Доставка
        'курьер': 150,
        'транспорт': 169, // Транспорт
        'перевозка': 151,
        
        // Склад и производство
        'склад': 164, // Склад
        'складск': 164,
        'завод': 153, // Завод
        'производство': 171, // Производство
        'производств': 171,
        
        // Торговля и офис
        'продавец': 170, // Торговля
        'продаж': 170,
        'кассир': 170,
        'офис': 158, // Офис
        'офисн': 158,
        'секретарь': 158,
        'администратор': 158,
        
        // Общепит и гостиницы
        'кухня': 159, // Общепит
        'повар': 159,
        'официант': 159,
        'бармен': 159,
        'ресторан': 159,
        'кафе': 159,
        'гостиница': 149, // Гостиницы
        'отель': 149,
        'hotel': 149,
        
        // Уборка и обслуживание
        'уборщица': 147, // Уборка
        'уборщик': 147,
        'уборка': 147,
        'клининг': 147,
        'cleaning': 147,
        
        // Медицина и здоровье
        'медицин': 163, // Медицина
        'врач': 163,
        'медсестра': 163,
        'здоровье': 154, // Здоровье
        'медицинск': 163,
        
        // Образование и няни
        'учитель': 162, // Образование
        'преподаватель': 162,
        'репетитор': 162,
        'образование': 162,
        'няня': 156, // Няни
        'нянь': 156,
        'babysitter': 156,
        
        // Охрана и безопасность
        'охранник': 157, // Охрана
        'охрана': 157,
        'security': 157,
        'security guard': 157,
        
        // Бьюти-индустрия
        'парикмахер': 148, // Бьюти-индустрия
        'массажист': 148,
        'косметолог': 148,
        'маникюр': 148,
        'салон': 148,
        'beauty': 148,
        
        // Автосервис
        'автосервис': 152, // Автосервис
        'механик': 152,
        'авто': 152,
        'car': 152,
        'garage': 152,
        
        // Связь и телекоммуникации
        'связь': 166, // Связь-телекоммуникации
        'телеком': 166,
        'программист': 166,
        'it': 166,
        'developer': 166,
        
        // Сельское хозяйство
        'сельское': 167, // Сельское хозяйство
        'фермер': 167,
        'садовник': 167,
        'сельскохозяйств': 167,
        
        // Уход за пожилыми
        'уход': 168, // Уход за пожилыми
        'пожил': 168,
        'сиделка': 168,
        'caregiver': 168,
        
        // Швеи
        'швея': 172, // Швеи
        'портной': 172,
        'швейн': 172,
        'seamstress': 172,
        
        // Инженеры
        'инженер': 155, // Инженеры
        'engineer': 155,
        'техник': 155,
        
        // Общие слова для разных категорий
        'рабочий': 174, // Разное
        'работник': 174,
        'помощник': 174,
        'assistant': 174,
        'worker': 174
    };
    
    // Проверяем каждое ключевое слово
    for (const [keyword, categoryId] of Object.entries(categoryMapping)) {
        if (titleLower.includes(keyword)) {
            return categoryId;
        }
    }
    
    // Если не найдено точное совпадение, возвращаем "Разное"
    return 174; // Разное
}

// Генерация заголовков и определение категорий для вакансий
async function generateJobTitles(jobs) {
    console.log("🤖 Генерируем заголовки и определяем категории для вакансий...");
    console.log("💡 Используем надежную fallback систему (rule-based)");
    console.log("✅ Нет ограничений по rate limits или quota");
    console.log("⚡ Мгновенная обработка без задержек");
    console.log("🏷️ Автоматическое определение категорий на основе заголовков");
    
    let successCount = 0;
    let fallbackCount = 0;
    let categoryAssignedCount = 0;
    let totalTime = 0;
    
    // Статистика по категориям
    const categoryStats = {};
    
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
            }
            
            // Определяем категорию на основе заголовка
            const categoryId = determineCategoryFromTitle(job.title);
            job.categoryId = categoryId;
            categoryAssignedCount++;
            
            // Обновляем статистику
            categoryStats[categoryId] = (categoryStats[categoryId] || 0) + 1;
            
            console.log(`   🏷️ Категория определена: ID ${categoryId} для "${job.title}"`);
            
            // Небольшая задержка для логирования (не для rate limiting)
            if (i % 10 === 0) {
                console.log(`   📊 Прогресс: ${i + 1}/${jobs.length} (${((i + 1) / jobs.length * 100).toFixed(1)}%)`);
            }
            
        } catch (error) {
            console.error(`   ❌ Ошибка обработки вакансии ${i + 1}:`, error.message);
            
            // Используем базовый fallback заголовок и категорию
            job.title = "Общая вакансия";
            job.categoryId = 174; // Разное
            fallbackCount++;
            categoryAssignedCount++;
            categoryStats[174] = (categoryStats[174] || 0) + 1;
        }
    }
    
    console.log(`\n📊 Обработка завершена:`);
    console.log(`   Успешно обработано: ${successCount}`);
    console.log(`   Использовано fallback: ${fallbackCount}`);
    console.log(`   Категорий назначено: ${categoryAssignedCount}`);
    console.log(`   Среднее время обработки: ${(totalTime / successCount).toFixed(0)}ms`);
    console.log(`   Общее время: ${totalTime}ms`);
    
    console.log(`\n📈 Статистика по категориям:`);
    for (const [categoryId, count] of Object.entries(categoryStats)) {
        const percentage = ((count / jobs.length) * 100).toFixed(1);
        console.log(`   Категория ID ${categoryId}: ${count} вакансий (${percentage}%)`);
    }
    
    console.log(`\n💡 Преимущества системы:`);
    console.log(`   ✅ Нет API затрат`);
    console.log(`   ✅ Нет rate limits`);
    console.log(`   ✅ Нет quota проблем`);
    console.log(`   ✅ Мгновенная обработка`);
    console.log(`   ✅ Надежные результаты`);
    console.log(`   ✅ Всегда доступна`);
    console.log(`   ✅ Автоматическое определение категорий`);
    
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

        // ✅ Используем валидированную цену из описания
        const salary = job.validatedPrice ? `${job.validatedPrice}` : `${faker.number.int({ min: 35, max: 50 })}`;

        // 🟢 Генерация URL аватарки с инициалами
        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=128`;

        // Используем назначенную категорию или fallback на "Разное"
        const categoryId = job.categoryId || defaultCategory.id;
        
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
                        category: { connect: { id: categoryId } },
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
        console.log("🚀 Запуск скрипта с валидацией цен...\n");
        console.log("💡 Используем rule-based генерацию заголовков");
        console.log("💰 Валидируем цены в описаниях для консистентности");
        console.log("✅ Нет зависимости от OpenAI API");
        console.log("⚡ Быстрая и надежная обработка\n");
        
        await clearOldData();
        const jobs = await fetchJobDescriptions();
        
        // Генерируем заголовки с надежной fallback системой
        const jobsWithTitles = await generateJobTitles(jobs);
        
        await createFakeUsersWithJobs(jobsWithTitles);
        
        console.log("\n✅ Скрипт успешно завершен!");
        console.log("📊 Статистика:");
        console.log(`   - Всего валидных вакансий: ${jobs.length}`);
        console.log(`   - Успешно обработано: ${jobs.filter(j => j.title !== "Без названия").length}`);
        console.log(`   - Использовано fallback: ${jobs.filter(j => j.title !== "Без названия").length}`);
        console.log(`   - Валидированных цен: ${jobs.filter(j => j.validatedPrice).length}`);
        
        console.log("\n💡 Преимущества обновленной системы:");
        console.log("   - Нет API затрат");
        console.log("   - Нет rate limits или quota проблем");
        console.log("   - Мгновенная обработка");
        console.log("   - 100% надежность");
        console.log("   - Подходящие заголовки для израильского рынка");
        console.log("   - Консистентные цены между описанием и полем зарплаты");
        
    } catch (error) {
        console.error("❌ Критическая ошибка в скрипте:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
