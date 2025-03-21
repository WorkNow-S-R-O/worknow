import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();
const baseUrl = 'https://worknowjob.com';
const maxUrlsPerSitemap = 10000; // Максимальное количество URL в одном файле

const generateSitemap = async () => {
  try {
    console.log("🔄 Генерация Sitemap...");

    const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' }, take: maxUrlsPerSitemap });
    const users = await prisma.user.findMany({ take: maxUrlsPerSitemap });
    
    const sitemapIndex = [];
    let sitemapCount = 1;
    let urlCount = 0;
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 📌 Проверяем, существует ли папка public, если нет — создаем
    const publicPath = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath);
      console.log("📂 Папка 'public/' создана");
    }

    // ✅ Главная страница
    sitemapContent += `<url>\n<loc>${baseUrl}/</loc>\n<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n<priority>1.0</priority>\n</url>\n`;

    // ✅ Страница вакансий
    sitemapContent += `<url>\n<loc>${baseUrl}/jobs</loc>\n<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n<priority>0.9</priority>\n</url>\n`;

    urlCount += 2;

    // ✅ Вакансии
    for (const job of jobs) {
      if (!job.id) continue; // Пропускаем плохие данные

      if (urlCount >= maxUrlsPerSitemap) {
        fs.writeFileSync(`public/sitemap${sitemapCount}.xml`, sitemapContent + '</urlset>\n');
        sitemapIndex.push(`${baseUrl}/sitemap${sitemapCount}.xml`);
        sitemapCount++;
        sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        urlCount = 0;
      }

      const lastModDate = job.updatedAt ? new Date(job.updatedAt).toISOString().split('T')[0] : new Date(job.createdAt || Date.now()).toISOString().split('T')[0];

      sitemapContent += `<url>\n<loc>${baseUrl}/jobs/${job.id}</loc>\n<lastmod>${lastModDate}</lastmod>\n<priority>0.8</priority>\n</url>\n`;
      urlCount++;
    }

    // ✅ Профили пользователей (убираем fake_)
    for (const user of users) {
      if (!user.clerkUserId || user.clerkUserId.startsWith("fake_")) continue;

      if (urlCount >= maxUrlsPerSitemap) {
        fs.writeFileSync(`public/sitemap${sitemapCount}.xml`, sitemapContent + '</urlset>\n');
        sitemapIndex.push(`${baseUrl}/sitemap${sitemapCount}.xml`);
        sitemapCount++;
        sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        urlCount = 0;
      }

      sitemapContent += `<url>\n<loc>${baseUrl}/profile/${user.clerkUserId}</loc>\n<priority>0.6</priority>\n</url>\n`;
      urlCount++;
    }

    // ✅ Закрываем последний `sitemapX.xml`
    if (urlCount > 0) {
      sitemapContent += '</urlset>\n';
      fs.writeFileSync(`public/sitemap${sitemapCount}.xml`, sitemapContent);
      sitemapIndex.push(`${baseUrl}/sitemap${sitemapCount}.xml`);
    }

    // ✅ Создаем `sitemap-index.xml`
    let sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const sitemap of sitemapIndex) {
      sitemapIndexContent += `<sitemap>\n<loc>${sitemap}</loc>\n<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n</sitemap>\n`;
    }
    sitemapIndexContent += '</sitemapindex>\n';
    fs.writeFileSync(`public/sitemap-index.xml`, sitemapIndexContent);

    console.log(`✅ Sitemap готов: ${sitemapIndex.length} файлов.`);
  } catch (error) {
    console.error("❌ Ошибка при создании Sitemap:", error);
  }
};

// 🚀 Запуск генерации Sitemap
generateSitemap();
