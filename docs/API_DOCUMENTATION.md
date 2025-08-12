# WorkNow API Documentation

## Overview

The WorkNow API provides a comprehensive REST API for job management, user authentication, payments, and platform administration. Built with Node.js, Express, and Prisma, it offers secure, scalable endpoints for the job search platform.

## Base URL

```
Production: https://api.worknow.com
Development: http://localhost:3001
```

## Authentication

All protected endpoints require a valid Clerk JWT token in the Authorization header:

```http
Authorization: Bearer <clerk_jwt_token>
```

### Token Verification

The API automatically verifies tokens using Clerk's verification service. Invalid or expired tokens will return a 401 Unauthorized response.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## Job Management

### Get All Jobs

```http
GET /api/jobs
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (number): Filter by category ID
- `city` (number): Filter by city ID
- `search` (string): Search term for job title/description
- `boosted` (boolean): Filter by boosted jobs only

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "Construction Worker",
        "salary": "25-30 NIS/hour",
        "phone": "+972-50-123-4567",
        "description": "Looking for experienced construction worker...",
        "cityId": 1,
        "userId": "user_123",
        "categoryId": 2,
        "shuttle": true,
        "meals": false,
        "boostedAt": "2024-01-15T10:00:00Z",
        "createdAt": "2024-01-15T09:00:00Z",
        "city": {
          "id": 1,
          "name": "Tel Aviv"
        },
        "user": {
          "id": "user_123",
          "firstName": "John",
          "lastName": "Doe"
        },
        "category": {
          "id": 2,
          "name": "Construction"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

### Create Job

```http
POST /api/jobs
```

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Job Title",
  "salary": "Salary Range",
  "phone": "Phone Number",
  "description": "Job Description",
  "cityId": 1,
  "categoryId": 2,
  "shuttle": true,
  "meals": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Job Title",
    "salary": "Salary Range",
    "phone": "Phone Number",
    "description": "Job Description",
    "cityId": 1,
    "userId": "user_123",
    "categoryId": 2,
    "shuttle": true,
    "meals": false,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Update Job

```http
PUT /api/jobs/:id
```

**Authentication:** Required (owner only)

**Request Body:** Same as create job

**Response:** Updated job object

### Delete Job

```http
DELETE /api/jobs/:id
```

**Authentication:** Required (owner only)

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### Boost Job

```http
POST /api/jobs/:id/boost
```

**Authentication:** Required (premium user)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "boostedAt": "2024-01-15T10:00:00Z"
  }
}
```

## User Management

### Get User Profile

```http
GET /api/users
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "clerkUserId": "user_2abc123",
    "firstName": "John",
    "lastName": "Doe",
    "imageUrl": "https://example.com/avatar.jpg",
    "isPremium": true,
    "isAutoRenewal": true,
    "premiumEndsAt": "2024-12-31T23:59:59Z",
    "stripeSubscriptionId": "sub_123456",
    "premiumDeluxe": false,
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Update User Profile

```http
PUT /api/users
```

**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "imageUrl": "https://example.com/avatar.jpg"
}
```

**Response:** Updated user object

### Sync Clerk Profile

```http
POST /api/users/sync
```

**Authentication:** Required

**Response:** Synchronized user data

## Payment System

### Create Checkout Session

```http
POST /api/payments/create-checkout-session
```

**Authentication:** Required

**Request Body:**
```json
{
  "priceId": "price_123456",
  "successUrl": "https://worknow.com/success",
  "cancelUrl": "https://worknow.com/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_123456",
    "url": "https://checkout.stripe.com/pay/cs_123456"
  }
}
```

### Cancel Subscription

```http
POST /api/payments/cancel-subscription
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully"
}
```

### Cancel Auto-Renewal

```http
POST /api/payments/cancel-auto-renewal
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Auto-renewal disabled"
}
```

## Job Seekers

### Get All Seekers

```http
GET /api/seekers
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Filter by category
- `city` (string): Filter by city
- `gender` (string): Filter by gender
- `employment` (string): Filter by employment type

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Jane Smith",
        "contact": "+972-50-987-6543",
        "city": "Jerusalem",
        "description": "Experienced worker looking for...",
        "slug": "jane-smith",
        "isActive": true,
        "isDemanded": false,
        "gender": "Female",
        "facebook": "jane.smith",
        "languages": ["Hebrew", "English"],
        "nativeLanguage": "Hebrew",
        "employment": "Full-time",
        "category": "Construction",
        "documents": "Available",
        "note": "Reliable and hardworking",
        "announcement": "Looking for construction work",
        "documentType": "Work permit",
        "createdAt": "2024-01-15T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 75,
      "totalPages": 8
    }
  }
}
```

### Create Seeker

```http
POST /api/seekers
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "contact": "+972-50-987-6543",
  "city": "Jerusalem",
  "description": "Experienced worker looking for...",
  "gender": "Female",
  "facebook": "jane.smith",
  "languages": ["Hebrew", "English"],
  "nativeLanguage": "Hebrew",
  "employment": "Full-time",
  "category": "Construction",
  "documents": "Available",
  "note": "Reliable and hardworking",
  "announcement": "Looking for construction work",
  "documentType": "Work permit"
}
```

**Response:** Created seeker object

### Get Seeker by ID

```http
GET /api/seekers/:id
```

**Response:** Detailed seeker information

## Categories and Cities

### Get All Categories

```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Construction",
      "translations": [
        {
          "lang": "en",
          "name": "Construction"
        },
        {
          "lang": "he",
          "name": "בנייה"
        },
        {
          "lang": "ru",
          "name": "Строительство"
        },
        {
          "lang": "ar",
          "name": "بناء"
        }
      ]
    }
  ]
}
```

### Get All Cities

```http
GET /api/cities
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Tel Aviv",
      "translations": [
        {
          "lang": "en",
          "name": "Tel Aviv"
        },
        {
          "lang": "he",
          "name": "תל אביב"
        },
        {
          "lang": "ru",
          "name": "Тель-Авив"
        },
        {
          "lang": "ar",
          "name": "تل أبيب"
        }
      ]
    }
  ]
}
```

## Messaging System

### Get User Messages

```http
GET /api/messages
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_123",
      "clerkUserId": "user_123",
      "title": "Welcome to WorkNow",
      "body": "Thank you for joining our platform...",
      "isRead": false,
      "type": "system",
      "fromAdminId": null,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

### Send Message (Admin Only)

```http
POST /api/messages
```

**Authentication:** Required (admin)

**Request Body:**
```json
{
  "clerkUserId": "user_123",
  "title": "Message Title",
  "body": "Message content",
  "type": "admin"
}
```

**Response:** Created message object

## Newsletter System

### Subscribe to Newsletter

```http
POST /api/newsletter/subscribe
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "categories": ["Construction", "Kitchen"],
    "cities": ["Tel Aviv", "Jerusalem"],
    "frequency": "daily"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

### Verify Newsletter Subscription

```http
POST /api/newsletter/verify
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

## File Upload

### Upload Job Image

```http
POST /api/upload
```

**Authentication:** Required

**Request Body:** FormData with image file

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://worknow.com/images/jobs/job-123.jpg",
    "filename": "job-123.jpg"
  }
}
```

## Webhooks

### Stripe Webhook

```http
POST /webhook
```

**Headers:**
- `stripe-signature`: Stripe webhook signature

**Body:** Stripe webhook payload

**Response:** Success confirmation

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing authentication token |
| `FORBIDDEN` | User doesn't have permission for the action |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request data validation failed |
| `PAYMENT_REQUIRED` | Premium feature requires payment |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server internal error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints:** 100 requests per minute per IP
- **Authentication endpoints:** 10 requests per minute per IP
- **File uploads:** 20 uploads per hour per user

## Pagination

All list endpoints support pagination with the following parameters:

- `page`: Page number (starts from 1)
- `limit`: Items per page (default: 10, max: 100)

## Filtering and Search

Most list endpoints support filtering and search:

- **Text search:** Searches across relevant text fields
- **Category filtering:** Filter by job category
- **City filtering:** Filter by location
- **Date filtering:** Filter by creation date
- **Status filtering:** Filter by active/inactive status

## File Upload Limits

- **Maximum file size:** 5MB
- **Allowed formats:** JPG, PNG, GIF
- **Image dimensions:** Minimum 200x200px, maximum 4000x4000px

## Testing

Use the provided test scripts to verify API functionality:

```bash
# Test job creation
node tools/test-job-creation.js

# Test payment flow
node tools/test-frontend-flow.js

# Test image moderation
node tools/test-image-moderation.js
```

## Support

For API support and questions:

- Check the server logs for detailed error information
- Review the authentication setup
- Verify environment variable configuration
- Use the test scripts to isolate issues
