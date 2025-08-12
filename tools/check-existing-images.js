#!/usr/bin/env node

/**
 * Script to check existing images in the database for moderation violations
 * This helps identify images that were uploaded before moderation was implemented
 */

import { PrismaClient } from '@prisma/client';
import { moderateImageFromUrl } from '../apps/api/services/imageModerationService.js';

const prisma = new PrismaClient();

async function checkExistingImages() {
  try {
    console.log('🔍 Checking existing images in database for moderation violations...\n');

    // Get all jobs with images
    const jobsWithImages = await prisma.job.findMany({
      where: {
        imageUrl: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        createdAt: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });

    console.log(`📊 Found ${jobsWithImages.length} jobs with images\n`);

    if (jobsWithImages.length === 0) {
      console.log('✅ No images found in database');
      return;
    }

    // Check each image for moderation violations
    const violations = [];
    const approved = [];
    const failed = [];

    for (let i = 0; i < jobsWithImages.length; i++) {
      const job = jobsWithImages[i];
      console.log(`🔍 Checking image ${i + 1}/${jobsWithImages.length}: Job #${job.id} - "${job.title}"`);
      
      try {
        const moderationResult = await moderateImageFromUrl(job.imageUrl);
        
        if (moderationResult.isApproved) {
          approved.push({
            jobId: job.id,
            title: job.title,
            imageUrl: job.imageUrl,
            userEmail: job.user?.email,
            createdAt: job.createdAt,
            moderationResult
          });
          console.log(`   ✅ APPROVED - Safe for job platform`);
        } else {
          violations.push({
            jobId: job.id,
            title: job.title,
            imageUrl: job.imageUrl,
            userEmail: job.user?.email,
            createdAt: job.createdAt,
            moderationResult
          });
          console.log(`   ❌ VIOLATION - ${moderationResult.detectedIssues.criticalViolations.map(v => v.name).join(', ')}`);
        }
        
        // Add delay to avoid overwhelming the AWS service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        failed.push({
          jobId: job.id,
          title: job.title,
          imageUrl: job.imageUrl,
          userEmail: job.user?.email,
          createdAt: job.createdAt,
          error: error.message
        });
        console.log(`   ⚠️ FAILED - ${error.message}`);
      }
    }

    // Summary report
    console.log('\n📋 MODERATION SUMMARY REPORT');
    console.log('=' .repeat(50));
    console.log(`Total images checked: ${jobsWithImages.length}`);
    console.log(`✅ Approved: ${approved.length}`);
    console.log(`❌ Violations: ${violations.length}`);
    console.log(`⚠️ Failed checks: ${failed.length}`);

    if (violations.length > 0) {
      console.log('\n🚫 VIOLATIONS FOUND:');
      console.log('=' .repeat(50));
      violations.forEach(violation => {
        console.log(`Job #${violation.jobId}: "${violation.title}"`);
        console.log(`User: ${violation.userEmail || 'Unknown'}`);
        console.log(`Created: ${violation.createdAt.toISOString()}`);
        console.log(`Image: ${violation.imageUrl}`);
        console.log(`Violations: ${violation.moderationResult.detectedIssues.criticalViolations.map(v => `${v.name} (${v.confidence}%)`).join(', ')}`);
        console.log('');
      });
    }

    if (failed.length > 0) {
      console.log('\n⚠️ FAILED CHECKS:');
      console.log('=' .repeat(50));
      failed.forEach(fail => {
        console.log(`Job #${fail.jobId}: "${fail.title}"`);
        console.log(`User: ${fail.userEmail || 'Unknown'}`);
        console.log(`Error: ${fail.error}`);
        console.log('');
      });
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('=' .repeat(50));
    
    if (violations.length > 0) {
      console.log('1. Review and remove violating images immediately');
      console.log('2. Contact users to replace inappropriate content');
      console.log('3. Consider temporary suspension for repeat violations');
    }
    
    if (failed.length > 0) {
      console.log('4. Investigate failed moderation checks');
      console.log('5. Check AWS Rekognition service status');
      console.log('6. Verify image URLs are accessible');
    }
    
    console.log('7. Implement regular image moderation checks');
    console.log('8. Add moderation to image update workflows');

    console.log('\n✅ Image moderation check completed');

  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkExistingImages().catch(console.error);

