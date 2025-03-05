import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateSitemap = async () => {
  const jobs = await prisma.job.findMany();
  const baseUrl = 'https://worknowjob.com';

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  jobs.forEach((job) => {
    sitemap += `<url>\n<loc>${baseUrl}/jobs/${job.id}</loc>\n<lastmod>${new Date(job.updatedAt).toISOString()}</lastmod>\n</url>\n`;
  });

  sitemap += '</urlset>';

  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log("✅ Sitemap создан!");
};

generateSitemap();
