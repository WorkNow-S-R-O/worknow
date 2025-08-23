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
    
    // Увеличиваем timeout для лучшей стабильности
    page.setDefaultTimeout(60000); // 60 seconds
    page.setDefaultNavigationTimeout(60000);
    
    await page.goto('https://doska.orbita.co.il/jobs/required/', { waitUntil: 'networkidle2' });

    let jobs = [];
    let currentPage = 1;
    let totalProcessed = 0;
    let totalValidated = 0;
    let consecutiveEmptyPages = 0;
    let consecutiveTimeouts = 0;
    const MAX_CONSECUTIVE_EMPTY_PAGES = 5; // Максимум 5 пустых страниц подряд
    const MAX_CONSECUTIVE_TIMEOUTS = 3; // Максимум 3 таймаута подряд

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
                consecutiveTimeouts = 0; // Сбрасываем счетчик таймаутов
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
                        consecutiveTimeouts = 0;
                        break;
                    } catch {
                        console.log(`   ❌ Не удалось загрузить ${altUrl}`);
                    }
                }
                
                if (!foundAlternative) {
                    console.log("❌ Не удалось найти больше вакансий. Останавливаем парсинг.");
                    break;
                }
            } else {
                // Переход на следующую страницу
                try {
                    await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
                    currentPage++;
                } catch (error) {
                    if (error.message.includes('Navigation timeout')) {
                        consecutiveTimeouts++;
                        console.log(`   ⏰ Таймаут навигации на странице ${currentPage}: ${error.message}`);
                        console.log(`   🔄 Пропускаем страницу ${currentPage} и продолжаем...`);
                        
                        if (consecutiveTimeouts >= MAX_CONSECUTIVE_TIMEOUTS) {
                            console.log(`   🛑 Слишком много таймаутов подряд (${consecutiveTimeouts}). Останавливаем парсинг.`);
                            console.log(`   💡 Продолжаем с уже собранными ${jobs.length} вакансиями`);
                            break;
                        }
                        
                        // Пытаемся продолжить с текущей страницы
                        try {
                            await page.reload({ waitUntil: 'networkidle2' });
                        } catch (reloadError) {
                            console.log(`   ❌ Не удалось перезагрузить страницу: ${reloadError.message}`);
                            currentPage++; // Переходим к следующей странице
                        }
                    } else {
                        console.log(`   ❌ Ошибка при переходе на страницу ${currentPage}: ${error.message}`);
                        currentPage++; // Переходим к следующей странице
                    }
                }
            }

        } catch (error) {
            if (error.message.includes('Navigation timeout')) {
                consecutiveTimeouts++;
                console.log(`   ⏰ Таймаут при парсинге страницы ${currentPage}: ${error.message}`);
                
                if (consecutiveTimeouts >= MAX_CONSECUTIVE_TIMEOUTS) {
                    console.log(`   🛑 Слишком много таймаутов подряд (${consecutiveTimeouts}). Останавливаем парсинг.`);
                    console.log(`   💡 Продолжаем с уже собранными ${jobs.length} вакансиями`);
                    break;
                }
                
                console.log(`   🔄 Продолжаем парсинг... (таймаут ${consecutiveTimeouts}/${MAX_CONSECUTIVE_TIMEOUTS})`);
                
                // Попробуем перезагрузить страницу
                try {
                    await page.reload({ waitUntil: 'networkidle2' });
                } catch (reloadError) {
                    console.log(`   ❌ Не удалось перезагрузить страницу: ${reloadError.message}`);
                    console.log(`   ⏭️ Переходим к следующей странице...`);
                    currentPage++;
                }
            } else {
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
    }

    await browser.close();
    console.log(`\n📊 Статистика валидации цен:`);
    console.log(`   Обработано вакансий: ${totalProcessed}`);
    console.log(`   Валидных вакансий: ${totalValidated}`);
    console.log(`   Процент валидных: ${((totalValidated / totalProcessed) * 100).toFixed(1)}%`);
    console.log(`   Собрано вакансий: ${jobs.length}/${MAX_JOBS}`);
    
    if (jobs.length < MAX_JOBS) {
        console.log(`⚠️ Предупреждение: Собрано только ${jobs.length} вакансий из ${MAX_JOBS} запланированных`);
        
        // Проверяем, была ли остановка из-за таймаутов
        if (consecutiveTimeouts >= MAX_CONSECUTIVE_TIMEOUTS) {
            console.log(`💡 Остановка из-за таймаутов. Используем ${jobs.length} собранных вакансий без генерации дополнительных.`);
            return jobs; // Возвращаем только реальные вакансии
        } else {
            console.log(`🔄 Генерируем дополнительные вакансии для достижения ${MAX_JOBS}...`);
            
            const additionalJobsNeeded = MAX_JOBS - jobs.length;
            const additionalJobs = generateAdditionalJobs(additionalJobsNeeded);
            
            console.log(`✅ Сгенерировано ${additionalJobs.length} дополнительных вакансий`);
            jobs.push(...additionalJobs);
        }
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
        'строитель': 30, // Стройка
        'строительство': 30,
        'стройка': 30,
        'строительн': 30,
        'плотник': 44, // Плотник
        'плотнич': 44,
        'сварщик': 49, // Сварщик
        'сварка': 49,
        'электрик': 57, // Электрик
        'электрич': 57,
        'ремонт': 45, // Ремонт
        'ремонтн': 45,
        
        // Транспорт и доставка
        'водитель': 35, // Перевозка
        'шофер': 35,
        'доставка': 34, // Доставка
        'курьер': 34,
        'транспорт': 53, // Транспорт
        'перевозка': 35,
        
        // Склад и производство
        'склад': 48, // Склад
        'складск': 48,
        'завод': 37, // Завод
        'производство': 55, // Производство
        'производств': 55,
        
        // Торговля и офис
        'продавец': 54, // Торговля
        'продаж': 54,
        'кассир': 54,
        'офис': 42, // Офис
        'офисн': 42,
        'секретарь': 42,
        'администратор': 42,
        
        // Общепит и гостиницы
        'кухня': 43, // Общепит
        'повар': 43,
        'официант': 43,
        'бармен': 43,
        'ресторан': 43,
        'кафе': 43,
        'гостиница': 33, // Гостиницы
        'отель': 33,
        'hotel': 33,
        
        // Уборка и обслуживание
        'уборщица': 31, // Уборка
        'уборщик': 31,
        'уборка': 31,
        'клининг': 31,
        'cleaning': 31,
        
        // Медицина и здоровье
        'медицин': 47, // Медицина
        'врач': 47,
        'медсестра': 47,
        'здоровье': 38, // Здоровье
        'медицинск': 47,
        
        // Образование и няни
        'учитель': 46, // Образование
        'преподаватель': 46,
        'репетитор': 46,
        'образование': 46,
        'няня': 40, // Няни
        'нянь': 40,
        'babysitter': 40,
        
        // Охрана и безопасность
        'охранник': 41, // Охрана
        'охрана': 41,
        'security': 41,
        'security guard': 41,
        
        // Бьюти-индустрия
        'парикмахер': 32, // Бьюти-индустрия
        'массажист': 32,
        'косметолог': 32,
        'маникюр': 32,
        'салон': 32,
        'beauty': 32,
        
        // Автосервис
        'автосервис': 36, // Автосервис
        'механик': 36,
        'авто': 36,
        'car': 36,
        'garage': 36,
        
        // Связь и телекоммуникации
        'связь': 50, // Связь-телекоммуникации
        'телеком': 50,
        'программист': 50,
        'it': 50,
        'developer': 50,
        
        // Сельское хозяйство
        'сельское': 51, // Сельское хозяйство
        'фермер': 51,
        'садовник': 51,
        'сельскохозяйств': 51,
        
        // Уход за пожилыми
        'уход': 52, // Уход за пожилыми
        'пожил': 52,
        'сиделка': 52,
        'caregiver': 52,
        
        // Швеи
        'швея': 56, // Швеи
        'портной': 56,
        'швейн': 56,
        'seamstress': 56,
        
        // Инженеры
        'инженер': 39, // Инженеры
        'engineer': 39,
        'техник': 39,
        
        // Общие слова для разных категорий
        'рабочий': 58, // Разное
        'работник': 58,
        'помощник': 58,
        'assistant': 58,
        'worker': 58
    };
    
    // Проверяем каждое ключевое слово
    for (const [keyword, categoryId] of Object.entries(categoryMapping)) {
        if (titleLower.includes(keyword)) {
            return categoryId;
        }
    }
    
    // Если не найдено точное совпадение, возвращаем "Разное"
    return 58; // Разное - новый ID
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
            job.categoryId = 58; // Разное - новый ID
            fallbackCount++;
            categoryAssignedCount++;
            categoryStats[58] = (categoryStats[58] || 0) + 1;
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
        console.log("   - Умная обработка таймаутов - используем реальные вакансии при ошибках");
        
    } catch (error) {
        console.error("❌ Критическая ошибка в скрипте:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
