import express from 'express';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscribers,
  checkSubscriptionStatus,
  updateNewsletterPreferences
} from '../controllers/newsletterController.js';
import { sendCandidatesToSubscribers, sendFilteredCandidatesToSubscribers } from '../services/newsletterService.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', subscribeToNewsletter);

// Unsubscribe from newsletter
router.post('/unsubscribe', unsubscribeFromNewsletter);

// Get all newsletter subscribers (admin only)
router.get('/subscribers', getNewsletterSubscribers);

// Check subscription status
router.get('/check-subscription', checkSubscriptionStatus);

// Update newsletter preferences
router.put('/preferences/:email', updateNewsletterPreferences);

// Manual trigger to send candidates to subscribers (for testing)
router.post('/send-candidates', async (req, res) => {
  try {
    const { subscriberIds } = req.body; // Optional: specific subscriber IDs
    
    await sendCandidatesToSubscribers(subscriberIds);
    
    res.json({
      success: true,
      message: 'Candidates sent to subscribers successfully'
    });
  } catch (error) {
    console.error('❌ Error sending candidates to subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send candidates to subscribers'
    });
  }
});

// Manual trigger to send filtered candidates to subscribers (for testing)
router.post('/send-filtered-candidates', async (req, res) => {
  try {
    await sendFilteredCandidatesToSubscribers();
    
    res.json({
      success: true,
      message: 'Filtered candidates sent to subscribers successfully'
    });
  } catch (error) {
    console.error('❌ Error sending filtered candidates to subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send filtered candidates to subscribers'
    });
  }
});

export default router; 