import AIJobTitleService from '../services/aiJobTitleService.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function updateJobsWithAITitles() {
    console.log("🤖 Updating Jobs with AI-Generated Titles\n");
    
    try {
        // Get all jobs that need title updates
        const jobs = await prisma.job.findMany({
            include: {
                city: true,
                category: true
            }
        });
        
        console.log(`📊 Found ${jobs.length} jobs to process\n`);
        
        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        for (const job of jobs) {
            try {
                console.log(`\n🔍 Processing job ${job.id}: "${job.title}"`);
                console.log(`   Description: ${job.description.substring(0, 80)}...`);
                
                const context = {
                    city: job.city?.name,
                    salary: job.salary,
                    requirements: AIJobTitleService.extractRequirements(job.description)
                };
                
                const titleData = await AIJobTitleService.generateAITitle(job.description, context);
                
                console.log(`   Generated: "${titleData.title}" (${titleData.method}, confidence: ${titleData.confidence.toFixed(2)})`);
                
                // Only update if the new title is better
                if (titleData.confidence > 0.6 && titleData.title !== job.title) {
                    await prisma.job.update({
                        where: { id: job.id },
                        data: { title: titleData.title }
                    });
                    
                    console.log(`   ✅ Updated: "${job.title}" → "${titleData.title}"`);
                    updatedCount++;
                } else {
                    console.log(`   ⏭️  Skipped - confidence too low or same title`);
                    skippedCount++;
                }
                
                // Add delay to avoid overwhelming the system
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`   ❌ Error processing job ${job.id}:`, error.message);
                errorCount++;
            }
        }
        
        console.log(`\n📈 AI Update Summary:`);
        console.log(`   Total jobs processed: ${jobs.length}`);
        console.log(`   Jobs updated: ${updatedCount}`);
        console.log(`   Jobs skipped: ${skippedCount}`);
        console.log(`   Errors: ${errorCount}`);
        
        // Show some examples of updated titles
        const updatedJobs = await prisma.job.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });
        
        console.log(`\n✅ Examples of Current Job Titles:`);
        updatedJobs.forEach((job, index) => {
            console.log(`   ${index + 1}. "${job.title}"`);
            console.log(`      Description: ${job.description.substring(0, 60)}...`);
        });
        
        return {
            total: jobs.length,
            updated: updatedCount,
            skipped: skippedCount,
            errors: errorCount
        };
        
    } catch (error) {
        console.error('❌ Error updating jobs with AI titles:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the update
updateJobsWithAITitles().catch(console.error); 