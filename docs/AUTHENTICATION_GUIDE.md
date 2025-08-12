# WorkNow Authentication Guide

## Overview

WorkNow uses **Clerk** as its authentication provider, offering a secure, scalable authentication solution with multi-factor authentication, social logins, and comprehensive user management. This guide covers setup, configuration, and best practices for authentication in the WorkNow platform.

## Clerk Integration

### What is Clerk?

Clerk is a complete authentication solution that provides:
- **User Management**: Registration, login, profile management
- **Multi-Factor Authentication**: SMS, email, authenticator apps
- **Social Logins**: Google, Facebook, GitHub, and more
- **JWT Tokens**: Secure token-based authentication
- **Webhooks**: Real-time user data synchronization
- **Dashboard**: User management interface

### Why Clerk for WorkNow?

- **Security**: Enterprise-grade security with SOC 2 compliance
- **Scalability**: Handles millions of users efficiently
- **Developer Experience**: Easy integration with React and Node.js
- **Multi-language Support**: Built-in internationalization
- **Customization**: Flexible UI components and branding

## Setup and Configuration

### 1. Clerk Account Setup

1. **Create Account**: Sign up at [clerk.com](https://clerk.com)
2. **Create Application**: Create a new application for WorkNow
3. **Configure Domains**: Add your domain(s) to allowed origins
4. **Get API Keys**: Copy your publishable and secret keys

### 2. Environment Variables

```env
# Frontend (Client)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend (Server)
CLERK_SECRET_KEY=sk_test_...
WEBHOOK_SECRET=whsec_...
```

### 3. Frontend Configuration

#### ClerkProvider Setup

```jsx
// src/App.jsx
import { ClerkProvider } from '@clerk/clerk-react';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {/* Your app components */}
    </ClerkProvider>
  );
}
```

#### Language Configuration

```jsx
import { ClerkProvider } from '@clerk/clerk-react';
import { he, ar, ru, enUS } from '@clerk/localizations';

const localizations = {
  he,
  ar,
  ru,
  en: enUS
};

function App() {
  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      localization={localizations}
    >
      {/* Your app components */}
    </ClerkProvider>
  );
}
```

### 4. Backend Configuration

#### Clerk SDK Setup

```javascript
// server/config/clerkConfig.js
import { clerkClient } from '@clerk/clerk-sdk-node';

const clerkConfig = {
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY
};

export { clerkClient, clerkConfig };
```

#### Authentication Middleware

```javascript
// server/middlewares/auth.js
import { verifyToken } from '@clerk/backend';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};
```

## Authentication Flow

### 1. User Registration

```jsx
import { SignUp } from '@clerk/clerk-react';

function SignUpPage() {
  return (
    <div className="signup-container">
      <SignUp 
        routing="path" 
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}
```

### 2. User Login

```jsx
import { SignIn } from '@clerk/clerk-react';

function SignInPage() {
  return (
    <div className="signin-container">
      <SignIn 
        routing="path" 
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
```

### 3. Protected Routes

```jsx
// src/components/routes/ProtectedRoute.jsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
```

### 4. User Profile Management

```jsx
import { UserProfile } from '@clerk/clerk-react';

function ProfilePage() {
  return (
    <div className="profile-container">
      <UserProfile 
        routing="path" 
        path="/profile"
        appearance={{
          elements: {
            formButtonPrimary: 'btn btn-primary',
            card: 'card'
          }
        }}
      />
    </div>
  );
}
```

## JWT Token Management

### 1. Token Structure

Clerk JWT tokens contain:

```json
{
  "iss": "https://clerk.your-domain.com",
  "sub": "user_2abc123",
  "aud": "your-app",
  "iat": 1640995200,
  "exp": 1641081600,
  "nbf": 1640995200,
  "jti": "jwt_123",
  "azp": "your-app",
  "org_id": "org_123",
  "org_slug": "your-org",
  "org_role": "basic_member",
  "user": {
    "id": "user_2abc123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### 2. Token Storage

```javascript
// Store token in localStorage (or secure storage)
const storeToken = (token) => {
  localStorage.setItem('worknow_token', token);
};

// Retrieve token for API calls
const getToken = () => {
  return localStorage.getItem('worknow_token');
};

// Remove token on logout
const removeToken = () => {
  localStorage.removeItem('worknow_token');
};
```

### 3. API Request with Token

```javascript
// src/hooks/useJobs.js
import { useAuth } from '@clerk/clerk-react';

export const useJobs = () => {
  const { getToken } = useAuth();

  const fetchJobs = async () => {
    const token = await getToken();
    
    const response = await fetch('/api/jobs', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
  };

  return { fetchJobs };
};
```

## User Synchronization

### 1. Webhook Handler

```javascript
// server/controllers/webhookController.js
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export const handleClerkWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const webhook = new Webhook(webhookSecret);
    
    const payload = await webhook.verify(
      JSON.stringify(req.body),
      req.headers
    );

    const { type, data } = payload;

    switch (type) {
      case 'user.created':
        await createUserInDatabase(data);
        break;
      case 'user.updated':
        await updateUserInDatabase(data);
        break;
      case 'user.deleted':
        await deleteUserFromDatabase(data);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

### 2. User Service

```javascript
// server/services/userSyncService.js
import { prisma } from '../lib/prisma';

export const createUserInDatabase = async (clerkUser) => {
  return await prisma.user.create({
    data: {
      clerkUserId: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      imageUrl: clerkUser.image_url
    }
  });
};

export const updateUserInDatabase = async (clerkUser) => {
  return await prisma.user.update({
    where: { clerkUserId: clerkUser.id },
    data: {
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      imageUrl: clerkUser.image_url
    }
  });
};
```

## Security Best Practices

### 1. Token Validation

```javascript
// Always verify tokens on the server
export const verifyToken = async (token) => {
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      issuer: process.env.CLERK_ISSUER_URL,
      audience: process.env.CLERK_AUDIENCE
    });
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

### 2. Role-Based Access Control

```javascript
// server/middlewares/auth.js
export const requireAdmin = async (req, res, next) => {
  try {
    await requireAuth(req, res, () => {});
    
    const user = await getUserById(req.user.sub);
    
    if (!user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
};
```

### 3. Rate Limiting

```javascript
// server/middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts'
  }
});
```

### 4. CORS Configuration

```javascript
// server/index.js
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://worknow.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Multi-Factor Authentication

### 1. MFA Setup

```jsx
import { useUser } from '@clerk/clerk-react';

function MFASetup() {
  const { user } = useUser();

  const enableMFA = async () => {
    try {
      await user.createMfaFactor({
        strategy: 'totp',
        friendlyName: 'Authenticator App'
      });
    } catch (error) {
      console.error('MFA setup failed:', error);
    }
  };

  return (
    <button onClick={enableMFA}>
      Enable Two-Factor Authentication
    </button>
  );
}
```

### 2. MFA Verification

```jsx
import { useUser } from '@clerk/clerk-react';

function MFAVerification() {
  const { user } = useUser();

  const verifyMFA = async (code) => {
    try {
      await user.verifyMfaFactor({
        strategy: 'totp',
        code: code
      });
    } catch (error) {
      console.error('MFA verification failed:', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter 6-digit code"
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={() => verifyMFA(code)}>
        Verify
      </button>
    </div>
  );
}
```

## Social Login Integration

### 1. Configure Social Providers

In your Clerk dashboard:

1. **Go to**: Social Connections
2. **Enable**: Google, Facebook, GitHub
3. **Configure**: OAuth credentials
4. **Set**: Redirect URLs

### 2. Social Login Components

```jsx
import { SignIn } from '@clerk/clerk-react';

function SocialSignIn() {
  return (
    <SignIn 
      routing="path" 
      path="/sign-in"
      appearance={{
        elements: {
          socialButtonsBlockButton: 'btn btn-social',
          socialButtonsBlockButtonText: 'Continue with'
        }
      }}
    />
  );
}
```

## Error Handling

### 1. Authentication Errors

```javascript
// Handle common authentication errors
const handleAuthError = (error) => {
  switch (error.errors[0]?.code) {
    case 'form_identifier_not_found':
      return 'User not found';
    case 'form_password_incorrect':
      return 'Incorrect password';
    case 'form_identifier_exists':
      return 'User already exists';
    case 'form_code_incorrect':
      return 'Invalid verification code';
    default:
      return 'Authentication failed';
  }
};
```

### 2. Token Expiration

```javascript
// Handle token expiration
const handleTokenExpiration = () => {
  // Clear stored token
  localStorage.removeItem('worknow_token');
  
  // Redirect to login
  window.location.href = '/sign-in';
  
  // Show notification
  toast.error('Session expired. Please sign in again.');
};
```

## Testing Authentication

### 1. Test Scripts

```bash
# Test authentication flow
node tools/test-auth-flow.js

# Test token validation
node tools/test-token-validation.js

# Test webhook handling
node tools/test-webhook.js
```

### 2. Test Environment

```javascript
// tools/test-auth-flow.js
import { clerkClient } from '@clerk/clerk-sdk-node';

const testAuthFlow = async () => {
  try {
    // Test user creation
    const user = await clerkClient.users.createUser({
      emailAddress: ['test@example.com'],
      password: 'testpassword123'
    });
    
    console.log('✅ User created:', user.id);
    
    // Test token generation
    const token = await clerkClient.sessions.createSession({
      userId: user.id,
      duration: 3600
    });
    
    console.log('✅ Token generated:', token.id);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testAuthFlow();
```

## Monitoring and Logging

### 1. Authentication Logs

```javascript
// Log authentication events
const logAuthEvent = (event, userId, details) => {
  console.log(`🔐 Auth Event: ${event}`, {
    userId,
    timestamp: new Date().toISOString(),
    details
  });
};

// Usage
logAuthEvent('login_success', user.id, { ip: req.ip });
logAuthEvent('login_failed', null, { email, reason: 'invalid_password' });
```

### 2. Security Monitoring

```javascript
// Monitor suspicious activity
const monitorAuthActivity = (req, res, next) => {
  const { ip, userAgent } = req;
  
  // Log authentication attempts
  console.log(`🔍 Auth Attempt:`, {
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    endpoint: req.path
  });
  
  next();
};
```

## Troubleshooting

### Common Issues

1. **Token Validation Fails**
   - Check `CLERK_SECRET_KEY` environment variable
   - Verify token format and expiration
   - Check Clerk service status

2. **Webhook Not Working**
   - Verify `WEBHOOK_SECRET` matches Clerk dashboard
   - Check webhook endpoint accessibility
   - Review webhook logs

3. **User Sync Issues**
   - Check database connection
   - Verify webhook payload format
   - Review error logs

4. **MFA Not Working**
   - Check authenticator app configuration
   - Verify time synchronization
   - Check MFA factor setup

### Getting Help

- **Clerk Documentation**: [docs.clerk.com](https://docs.clerk.com)
- **Clerk Support**: Available in dashboard
- **Community**: Clerk Discord and forums
- **Logs**: Check server and browser console logs

## Best Practices Summary

1. **Always verify tokens server-side**
2. **Use HTTPS in production**
3. **Implement proper error handling**
4. **Log authentication events**
5. **Monitor for suspicious activity**
6. **Keep dependencies updated**
7. **Use environment variables for secrets**
8. **Implement rate limiting**
9. **Handle token expiration gracefully**
10. **Test authentication flows thoroughly**

## Conclusion

Clerk provides a robust, secure authentication foundation for WorkNow. By following this guide and implementing the security best practices, you'll have a production-ready authentication system that scales with your platform's growth while maintaining the highest security standards.
