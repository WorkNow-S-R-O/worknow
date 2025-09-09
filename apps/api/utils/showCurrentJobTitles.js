import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function showCurrentJobTitles() {
	console.log('📋 Current Job Titles in Database\n');

	try {
		const jobs = await prisma.job.findMany({
			include: {
				city: true,
				category: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
		});

		console.log(`📊 Showing ${jobs.length} recent jobs:\n`);

		jobs.forEach((job, index) => {
			console.log(`${index + 1}. Title: "${job.title}"`);
			console.log(`   City: ${job.city?.name || 'Unknown'}`);
			console.log(`   Salary: ${job.salary} шек/час`);
			console.log(`   Description: ${job.description.substring(0, 100)}...`);
			console.log('─'.repeat(60));
		});

		// Count title types
		const titleCounts = {};
		jobs.forEach((job) => {
			titleCounts[job.title] = (titleCounts[job.title] || 0) + 1;
		});

		console.log('\n📈 Title Distribution:');
		Object.entries(titleCounts)
			.sort(([, a], [, b]) => b - a)
			.forEach(([title, count]) => {
				console.log(`   "${title}": ${count} jobs`);
			});

		// Count specific vs generic titles
		const specificTitles = jobs.filter(
			(job) =>
				job.title !== 'Общая вакансия' &&
				!job.title.includes('Работник') &&
				job.title.length < 30,
		);

		const genericTitles = jobs.filter(
			(job) =>
				job.title === 'Общая вакансия' ||
				job.title.includes('Работник') ||
				job.title.length >= 30,
		);

		console.log(`\n📊 Summary:`);
		console.log(`   Total jobs shown: ${jobs.length}`);
		console.log(
			`   Specific titles: ${specificTitles.length} (${((specificTitles.length / jobs.length) * 100).toFixed(1)}%)`,
		);
		console.log(
			`   Generic titles: ${genericTitles.length} (${((genericTitles.length / jobs.length) * 100).toFixed(1)}%)`,
		);
	} catch (error) {
		console.error('❌ Error showing job titles:', error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the script
showCurrentJobTitles().catch(console.error);
