# Candidate Notification System

## Overview

The WorkNow platform now includes an intelligent candidate notification system that automatically notifies newsletter subscribers about new candidates based on their preferences. The system implements two main notification types:

1. **Initial Welcome Email** - Sent only once when a user first subscribes
2. **Periodic Updates** - Sent every third candidate added to the system

## How It Works

### 1. Initial Welcome Email (One-time)

When a new user subscribes to the newsletter:
- The system automatically sends an email with the 3 most recent active candidates
- This email is sent **only once** per subscriber
- It serves as a welcome message and introduction to the platform

**Email Content:**
- Welcome message with subscriber's name
- 3 most recent candidates with full details
- Explanation that future notifications will be sent every 3 new candidates
- Unsubscribe link

### 2. Periodic Updates (Every 3rd Candidate)

The system automatically triggers notifications when:
- The total number of active candidates is divisible by 3
- This means notifications are sent at candidate counts: 3, 6, 9, 12, 15, etc.

**Email Content:**
- Notification about new candidates added to the platform
- Up to 3 most recent candidates (filtered by subscriber preferences)
- Different subject line and content from the initial email
- Unsubscribe link

## Smart Filtering

Each notification is personalized based on subscriber preferences:

- **Cities** - Only candidates from preferred cities
- **Categories** - Only candidates from preferred job categories  
- **Employment Type** - Full-time, part-time, etc.
- **Languages** - Candidates speaking preferred languages
- **Gender** - Specific gender preference
- **Document Types** - Specific document requirements
- **Demand Status** - Only highly demanded candidates

If no candidates match a subscriber's preferences, no email is sent.

## Technical Implementation

### Service Files

- **`candidateNotificationService.js`** - Main notification logic
- **`newsletterService.js`** - Newsletter subscription management

### Key Functions

```javascript
// Send initial candidates to new subscriber (only once)
sendInitialCandidatesToNewSubscriber(subscriber)

// Check if notifications should be sent (every 3rd candidate)
checkAndSendNewCandidatesNotification()

// Filter candidates based on subscriber preferences
filterCandidatesByPreferences(candidates, subscriber)
```

### Integration Points

- **Newsletter Subscription** - Triggers initial welcome email
- **Candidate Addition** - Triggers periodic notification check
- **Seeker Controller** - Calls notification service after adding candidates

## Email Templates

### Initial Welcome Email
- Subject: "Добро пожаловать! Ваши первые кандидаты с WorkNow"
- Content: Welcome message + 3 latest candidates + explanation of future notifications

### Periodic Update Email  
- Subject: "Новые соискатели добавлены на WorkNow"
- Content: Notification about new candidates + filtered candidate list

## Configuration

### Environment Variables
- `RESEND_API_KEY` - Primary email service (Resend)
- `EMAIL_USER` & `EMAIL_PASS` - Gmail fallback service

### Email Service Fallback
1. **Primary**: Resend API for reliable delivery
2. **Fallback**: Gmail SMTP if Resend fails
3. **Error Handling**: Graceful degradation without breaking candidate creation

## Testing

Use the test script to verify the system:

```bash
node tools/test-candidate-notifications.js
```

This script will:
- Check current candidate count
- Test notification trigger logic
- Simulate initial candidate emails
- Show notification schedule

## Benefits

1. **Engagement** - Keeps subscribers informed about new opportunities
2. **Efficiency** - Notifications only when there's meaningful content (3+ candidates)
3. **Personalization** - Each subscriber receives relevant candidates
4. **Scalability** - System works with any number of candidates and subscribers
5. **Reliability** - Multiple email service fallbacks

## Future Enhancements

- **Real-time Notifications** - WebSocket-based instant updates
- **Advanced Scheduling** - Configurable notification frequencies
- **Analytics** - Track email open rates and engagement
- **A/B Testing** - Different email templates and timing
- **Mobile Push** - Push notifications for mobile users

## Monitoring

The system logs all activities:
- ✅ Successful email deliveries
- ❌ Failed email attempts
- 📧 Notification triggers and counts
- 👤 Subscriber filtering results

Check server logs for detailed notification activity.

