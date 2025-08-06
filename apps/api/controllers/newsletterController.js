import { PrismaClient } from '@prisma/client';
import { sendCandidatesToNewSubscriber } from '../services/newsletterService.js';
import { sendVerificationCode, storeVerificationCode, verifyCode } from '../services/snsService.js';

const prisma = new PrismaClient();

/**
 * Subscribe a user to the newsletter
 */
export async function subscribeToNewsletter(req, res) {
  try {
    const { 
      email, 
      firstName, 
      lastName, 
      language = 'ru', 
      preferences = {},
      // Filter preferences
      preferredCities = [],
      preferredCategories = [],
      preferredEmployment = [],
      preferredLanguages = [],
      preferredGender = null,
      preferredDocumentTypes = [],
      onlyDemanded = false
    } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingSubscriber) {
      return res.status(409).json({ 
        success: false, 
        message: 'This email is already subscribed to the newsletter' 
      });
    }

    // Create new subscriber with filter preferences
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: email.trim().toLowerCase(),
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        language,
        preferences,
        isActive: true,
        // Filter preferences
        preferredCities,
        preferredCategories,
        preferredEmployment,
        preferredLanguages,
        preferredGender,
        preferredDocumentTypes,
        onlyDemanded
      }
    });

    console.log('✅ New newsletter subscriber:', subscriber.email);

    // Send candidates to new subscriber
    try {
      await sendCandidatesToNewSubscriber(subscriber);
    } catch (emailError) {
      console.error('❌ Failed to send candidates email:', emailError);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        preferredCities: subscriber.preferredCities,
        preferredCategories: subscriber.preferredCategories,
        preferredEmployment: subscriber.preferredEmployment,
        preferredLanguages: subscriber.preferredLanguages,
        preferredGender: subscriber.preferredGender,
        preferredDocumentTypes: subscriber.preferredDocumentTypes,
        onlyDemanded: subscriber.onlyDemanded
      }
    });

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    });
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    // Delete subscriber from database
    await prisma.newsletterSubscriber.delete({
      where: { id: subscriber.id }
    });

    console.log('✅ Successfully deleted subscriber:', subscriber.email);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('❌ Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter'
    });
  }
}

/**
 * Get all newsletter subscribers (admin only)
 */
export async function getNewsletterSubscribers(req, res) {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        language: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      subscribers,
      total: subscribers.length
    });

  } catch (error) {
    console.error('❌ Error getting newsletter subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get newsletter subscribers'
    });
  }
}

/**
 * Check if email is already subscribed to newsletter
 */
export async function checkSubscriptionStatus(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        language: true,
        createdAt: true,
        // Filter preferences
        preferredCities: true,
        preferredCategories: true,
        preferredEmployment: true,
        preferredLanguages: true,
        preferredGender: true,
        preferredDocumentTypes: true,
        onlyDemanded: true
      }
    });

    if (subscriber) {
      res.json({
        success: true,
        isSubscribed: true,
        subscriber
      });
    } else {
      res.json({
        success: true,
        isSubscribed: false,
        subscriber: null
      });
    }

  } catch (error) {
    console.error('❌ Error checking subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check subscription status'
    });
  }
}

/**
 * Update newsletter subscription preferences
 */
export async function updateNewsletterPreferences(req, res) {
  try {
    const { email } = req.params;
    const {
      preferredCities = [],
      preferredCategories = [],
      preferredEmployment = [],
      preferredLanguages = [],
      preferredGender = null,
      preferredDocumentTypes = [],
      onlyDemanded = false
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    // Update subscriber preferences
    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        preferredCities,
        preferredCategories,
        preferredEmployment,
        preferredLanguages,
        preferredGender,
        preferredDocumentTypes,
        onlyDemanded
      }
    });

    console.log('✅ Updated newsletter preferences for:', updatedSubscriber.email);

    res.json({
      success: true,
      message: 'Newsletter preferences updated successfully',
      subscriber: {
        id: updatedSubscriber.id,
        email: updatedSubscriber.email,
        firstName: updatedSubscriber.firstName,
        lastName: updatedSubscriber.lastName,
        preferredCities: updatedSubscriber.preferredCities,
        preferredCategories: updatedSubscriber.preferredCategories,
        preferredEmployment: updatedSubscriber.preferredEmployment,
        preferredLanguages: updatedSubscriber.preferredLanguages,
        preferredGender: updatedSubscriber.preferredGender,
        preferredDocumentTypes: updatedSubscriber.preferredDocumentTypes,
        onlyDemanded: updatedSubscriber.onlyDemanded
      }
    });

  } catch (error) {
    console.error('❌ Error updating newsletter preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update newsletter preferences'
    });
  }
}

/**
 * Send verification code for newsletter subscription
 */
export async function sendNewsletterVerificationCode(req, res) {
  try {
    const { 
      email, 
      firstName, 
      lastName, 
      language = 'ru', 
      preferences = {},
      preferredCities = [],
      preferredCategories = [],
      preferredEmployment = [],
      preferredLanguages = [],
      preferredGender = null,
      preferredDocumentTypes = [],
      onlyDemanded = false
    } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Check if already subscribed (only active subscribers)
    const existingSubscriber = await prisma.newsletterSubscriber.findFirst({
      where: { 
        email: email.trim().toLowerCase(),
        isActive: true
      }
    });

    if (existingSubscriber) {
      return res.status(409).json({ 
        success: false, 
        message: 'This email is already subscribed to the newsletter' 
      });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated verification code:', verificationCode);

    try {
      // Store verification code
      console.log('💾 Storing verification code...');
      await storeVerificationCode(email.trim().toLowerCase(), verificationCode);
      console.log('✅ Verification code stored successfully');

      // Send verification code via SNS
      console.log('📧 Sending verification code...');
      await sendVerificationCode(email.trim().toLowerCase(), verificationCode);
      console.log('✅ Verification code sent successfully');
    } catch (error) {
      console.error('❌ Error in verification process:', error);
      throw error;
    }

    console.log('✅ Verification code sent to:', email);

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      email: email.trim().toLowerCase(),
      // Store subscription data temporarily for verification
      subscriptionData: {
        email: email.trim().toLowerCase(),
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        language,
        preferences,
        preferredCities,
        preferredCategories,
        preferredEmployment,
        preferredLanguages,
        preferredGender,
        preferredDocumentTypes,
        onlyDemanded
      }
    });

  } catch (error) {
    console.error('❌ Error sending verification code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code'
    });
  }
}

/**
 * Verify code and complete newsletter subscription
 */
export async function verifyNewsletterCode(req, res) {
  try {
    const { email, code, subscriptionData } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Verify the code
    const verificationResult = await verifyCode(email.trim().toLowerCase(), code);

    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message
      });
    }

    // Create subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: email.trim().toLowerCase(),
        firstName: subscriptionData?.firstName || null,
        lastName: subscriptionData?.lastName || null,
        language: subscriptionData?.language || 'ru',
        preferences: subscriptionData?.preferences || {},
        isActive: true,
        preferredCities: subscriptionData?.preferredCities || [],
        preferredCategories: subscriptionData?.preferredCategories || [],
        preferredEmployment: subscriptionData?.preferredEmployment || [],
        preferredLanguages: subscriptionData?.preferredLanguages || [],
        preferredGender: subscriptionData?.preferredGender || null,
        preferredDocumentTypes: subscriptionData?.preferredDocumentTypes || [],
        onlyDemanded: subscriptionData?.onlyDemanded || false
      }
    });

    console.log('✅ Newsletter subscription verified and completed:', subscriber.email);

    // Send candidates to new subscriber
    try {
      await sendCandidatesToNewSubscriber(subscriber);
    } catch (emailError) {
      console.error('❌ Failed to send candidates email:', emailError);
      // Don't fail the subscription if email fails
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        preferredCities: subscriber.preferredCities,
        preferredCategories: subscriber.preferredCategories,
        preferredEmployment: subscriber.preferredEmployment,
        preferredLanguages: subscriber.preferredLanguages,
        preferredGender: subscriber.preferredGender,
        preferredDocumentTypes: subscriber.preferredDocumentTypes,
        onlyDemanded: subscriber.onlyDemanded
      }
    });

  } catch (error) {
    console.error('❌ Error verifying newsletter code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code and complete subscription'
    });
  }
}

 