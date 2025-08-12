# Image Moderation Configuration Guide

## Overview

The WorkNow platform now includes a **simplified and job-focused image moderation system** that only blocks the most serious violations while allowing normal job advertisements and work-related content to upload freely. The system is designed to trust users and minimize false positives for legitimate work content.

## What Gets Blocked vs. What Gets Allowed

### 🚫 **ALWAYS BLOCKED (Critical Violations)**
Only these three categories are blocked, and only with 90%+ confidence:

- **Explicit Nudity** - Clear pornographic content
- **Violence** - Clear violent content (fighting, weapons in violent context)
- **Hate Symbols** - Hate speech symbols and content

### ✅ **ALWAYS ALLOWED (Never Blocked)**
These categories are monitored but never blocked:

- **Tools & Equipment**: Hammers, drills, saws, construction tools
- **Kitchen Items**: Knives, scissors, utensils, cooking equipment
- **Work Vehicles**: Cars, trucks, machinery, construction vehicles
- **Office Supplies**: Scissors, staplers, office equipment
- **Alcohol & Tobacco**: For restaurant, bar, and hospitality jobs
- **Gambling Content**: For casino and entertainment jobs
- **Medical Equipment**: For healthcare and scientific jobs
- **Any Work-Related Content**: Tools, equipment, and materials

## How It Works

### 1. **High Confidence Threshold**
- **90% confidence required** to block any content
- This prevents false positives and overly strict blocking
- Only blocks content when AWS Rekognition is very confident

### 2. **Smart Content Detection**
- Detects all types of content for monitoring purposes
- Only blocks the three critical violation categories
- Everything else is allowed to pass through

### 3. **User-Friendly Fallback**
- If moderation fails (AWS service unavailable), **trusts the user**
- Images are allowed to upload when technical issues occur
- Prevents technical failures from blocking legitimate job content

## Configuration

### Current Settings
```javascript
// These are the current settings - no environment variables needed
MODE: 'job-focused'
CONFIDENCE_THRESHOLD: 90
ALWAYS_BLOCK: ['Explicit Nudity', 'Violence', 'Hate Symbols']
```

### No Environment Variables Required
The system is now pre-configured for job advertisements. You don't need to set any environment variables.

## Examples

### ✅ **Content That Gets Allowed**
```
🏗️  Construction tools (hammers, drills, saws)
🍳 Kitchen equipment (knives, scissors, utensils)
🚗 Work vehicles and machinery
🏢 Office supplies and equipment
🍺 Alcohol and tobacco (for restaurant/bar jobs)
🎰 Gambling content (for casino jobs)
💊 Medical/scientific equipment
🔧 Any work-related tools and equipment
```

### ❌ **Content That Gets Blocked**
```
🚫 Explicit pornographic content (90%+ confidence)
🚫 Clear violent content (90%+ confidence)
🚫 Hate speech symbols (90%+ confidence)
```

## Benefits

### 1. **User-Friendly**
- Users can upload legitimate work-related images without issues
- No false positives for tools, equipment, or work materials
- Trusts users for job-related content

### 2. **Job-Platform Focused**
- Designed specifically for job advertisements
- Allows construction, kitchen, office, and industrial content
- Supports all types of legitimate work

### 3. **Minimal False Positives**
- 90% confidence threshold prevents over-blocking
- Only blocks very clear violations
- Monitors but doesn't block borderline content

### 4. **Reliable Uploads**
- Technical failures don't block legitimate content
- Fallback behavior trusts users
- Consistent user experience

## Testing

Use the test script to verify the system:

```bash
node tools/test-moderation-modes.js
```

This script will show:
- Current configuration
- What gets blocked vs. monitored
- Examples of allowed content
- System behavior

## Monitoring and Logging

The system provides comprehensive logging:

- **Approved Images**: Optionally logged
- **Rejected Images**: Always logged with details
- **Moderation Failures**: Always logged
- **Detected Content**: Logged for monitoring (even when allowed)

### Log Examples

```
✅ Image Moderation - Content approved (safe for job platform)
📝 Image Moderation - Allowing content (monitoring only):
  labels: [
    { name: 'Alcohol', confidence: 87.5 },
    { name: 'Knife', confidence: 92.1 },
    { name: 'Tool', confidence: 89.3 }
  ]

❌ Image Moderation - Content rejected (critical violation):
  criticalViolations: [
    { name: 'Explicit Nudity', confidence: 95.2 }
  ]
```

## Troubleshooting

### Common Issues

1. **Images being blocked unexpectedly**
   - Check if content contains explicit nudity, violence, or hate symbols
   - Verify confidence is above 90%
   - Check logs for specific rejection reasons

2. **Moderation system not working**
   - Verify AWS credentials
   - Check AWS region configuration
   - Review error logs

3. **Too many false positives**
   - The system is already very permissive
   - 90% confidence threshold prevents most false positives
   - Only blocks very clear violations

### Getting Help

- Check server logs for detailed error messages
- Use the test script to verify configuration
- Review AWS Rekognition service status
- Check environment variable configuration

## Best Practices

### For Job Platforms
- This system is already optimized for job advertisements
- No additional configuration needed
- Trusts users for legitimate work content

### For Development/Testing
- System works out of the box
- No special environment variables required
- Test with various work-related images

## Result

Your image moderation system is now:

- **✅ Much more user-friendly** - Allows normal job ads and work content
- **✅ Job-platform focused** - Designed for legitimate work content
- **✅ Minimal false positives** - Only blocks very clear violations
- **✅ Trusts users** - Allows work-related tools and equipment
- **✅ Simple configuration** - No complex modes or settings

Users can now upload:
- Construction tools and equipment
- Kitchen knives and utensils
- Work vehicles and machinery
- Office supplies and equipment
- Alcohol and tobacco for hospitality jobs
- Gambling content for casino jobs
- Any legitimate work-related materials

While the system still protects against:
- Pornographic content
- Violent content
- Hate speech

This creates the perfect balance for a job platform - protecting against truly inappropriate content while allowing all legitimate work-related images to upload without issues.
