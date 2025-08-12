# WorkNow Database Schema Documentation

## Overview

The WorkNow database uses **PostgreSQL** as the primary database with **Prisma ORM** for data access. The schema is designed to support a multilingual job platform with user management, job postings, payments, and comprehensive internationalization.

## Database Technology

### Core Components
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Migrations**: Prisma Migrate
- **Seeding**: Custom seed scripts
- **Extensions**: UUID, Full-text search, Trigram matching

### Key Features
- **UUID primary keys** for users and messages
- **Auto-increment IDs** for jobs, categories, and cities
- **Soft deletion** via activity flags
- **Audit trails** with created/updated timestamps
- **Multilingual support** via translation tables
- **Optimized indexes** for search and filtering

## Schema Overview

### Core Tables
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Users      │    │      Jobs       │    │    Categories   │
│                 │    │                 │    │                 │
│ • Authentication│    │ • Job listings  │    │ • Job types     │
│ • Premium status│    │ • User relation │    │ • Translations │
│ • Profile data  │    │ • Categories    │    │ • Hierarchical  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │      Cities     │
                    │                 │
                    │ • Locations     │
                    │ • Translations  │
                    │ • Geographic    │
                    └─────────────────┘
```

### Supporting Tables
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Seekers     │    │    Messages     │    │    Payments     │
│                 │    │                 │    │                 │
│ • Job seekers   │    │ • User messages │    │ • Stripe data   │
│ • Profiles      │    │ • Notifications │    │ • Subscriptions │
│ • Contact info  │    │ • Admin comms   │    │ • Billing       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Tables

### 1. Users Table

The central user management table storing authentication, profile, and subscription data.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    image_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    is_auto_renewal BOOLEAN DEFAULT TRUE,
    premium_ends_at TIMESTAMP,
    stripe_subscription_id VARCHAR(255),
    premium_deluxe BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Unique user identifier | Primary key, auto-generated |
| `email` | VARCHAR(255) | User's email address | Unique, required |
| `clerk_user_id` | VARCHAR(255) | Clerk authentication ID | Unique, required |
| `first_name` | VARCHAR(255) | User's first name | Optional |
| `last_name` | VARCHAR(255) | User's last name | Optional |
| `image_url` | TEXT | Profile image URL | Optional |
| `is_premium` | BOOLEAN | Premium subscription status | Default: false |
| `is_auto_renewal` | BOOLEAN | Auto-renewal preference | Default: true |
| `premium_ends_at` | TIMESTAMP | Premium expiration date | Optional |
| `stripe_subscription_id` | VARCHAR(255) | Stripe subscription ID | Optional |
| `premium_deluxe` | BOOLEAN | Deluxe premium status | Default: false |
| `is_admin` | BOOLEAN | Administrator privileges | Default: false |
| `created_at` | TIMESTAMP | Account creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_clerk_user_id ON users(clerk_user_id);

-- Performance indexes
CREATE INDEX idx_users_premium ON users(is_premium);
CREATE INDEX idx_users_premium_deluxe ON users(premium_deluxe);
CREATE INDEX idx_users_admin ON users(is_admin);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_premium_ends_at ON users(premium_ends_at);
```

#### Relationships

```sql
-- Users have many jobs
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_user 
    FOREIGN KEY (user_id) REFERENCES users(clerk_user_id);

-- Users have many messages
ALTER TABLE messages ADD CONSTRAINT fk_messages_user 
    FOREIGN KEY (clerk_user_id) REFERENCES users(clerk_user_id);
```

### 2. Jobs Table

The main job listings table containing all job postings with metadata and relationships.

```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    salary VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    city_id INTEGER NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    shuttle BOOLEAN DEFAULT FALSE,
    meals BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    boosted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique job identifier | Primary key, auto-increment |
| `title` | VARCHAR(255) | Job title | Required |
| `salary` | VARCHAR(255) | Salary information | Required |
| `phone` | VARCHAR(255) | Contact phone number | Required |
| `description` | TEXT | Job description | Required |
| `city_id` | INTEGER | City location ID | Foreign key to cities |
| `user_id` | VARCHAR(255) | Job poster ID | Foreign key to users |
| `category_id` | INTEGER | Job category ID | Foreign key to categories |
| `shuttle` | BOOLEAN | Shuttle service provided | Default: false |
| `meals` | BOOLEAN | Meals provided | Default: false |
| `image_url` | TEXT | Job image URL | Optional |
| `boosted_at` | TIMESTAMP | Job boost timestamp | Optional |
| `is_active` | BOOLEAN | Job active status | Default: true |
| `created_at` | TIMESTAMP | Job creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Foreign key indexes
CREATE INDEX idx_jobs_city_id ON jobs(city_id);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_category_id ON jobs(category_id);

-- Performance indexes
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_boosted ON jobs(boosted_at);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_updated_at ON jobs(updated_at);

-- Search indexes
CREATE INDEX idx_jobs_title_gin ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX idx_jobs_description_gin ON jobs USING gin(to_tsvector('english', description));

-- Composite indexes
CREATE INDEX idx_jobs_city_category ON jobs(city_id, category_id);
CREATE INDEX idx_jobs_user_active ON jobs(user_id, is_active);
```

#### Relationships

```sql
-- Jobs belong to a city
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_city 
    FOREIGN KEY (city_id) REFERENCES cities(id);

-- Jobs belong to a user
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_user 
    FOREIGN KEY (user_id) REFERENCES users(clerk_user_id);

-- Jobs belong to a category
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_category 
    FOREIGN KEY (category_id) REFERENCES categories(id);
```

### 3. Categories Table

Job categories with hierarchical structure and multilingual support.

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique category identifier | Primary key, auto-increment |
| `name` | VARCHAR(255) | Category name | Required |
| `slug` | VARCHAR(255) | URL-friendly identifier | Unique, required |
| `parent_id` | INTEGER | Parent category ID | Self-referencing foreign key |
| `is_active` | BOOLEAN | Category active status | Default: true |
| `sort_order` | INTEGER | Display order | Default: 0 |
| `created_at` | TIMESTAMP | Category creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique indexes
CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);

-- Performance indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
```

#### Self-Referencing Relationship

```sql
-- Categories can have parent categories
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent 
    FOREIGN KEY (parent_id) REFERENCES categories(id);
```

### 4. Cities Table

Geographic locations with multilingual support for the Israeli market.

```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique city identifier | Primary key, auto-increment |
| `name` | VARCHAR(255) | City name | Required |
| `slug` | VARCHAR(255) | URL-friendly identifier | Unique, required |
| `region` | VARCHAR(255) | Geographic region | Optional |
| `latitude` | DECIMAL(10,8) | GPS latitude | Optional |
| `longitude` | DECIMAL(11,8) | GPS longitude | Optional |
| `is_active` | BOOLEAN | City active status | Default: true |
| `sort_order` | INTEGER | Display order | Default: 0 |
| `created_at` | TIMESTAMP | City creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique indexes
CREATE UNIQUE INDEX idx_cities_slug ON cities(slug);

-- Performance indexes
CREATE INDEX idx_cities_active ON cities(is_active);
CREATE INDEX idx_cities_region ON cities(region);
CREATE INDEX idx_cities_sort_order ON cities(sort_order);

-- Geographic indexes
CREATE INDEX idx_cities_coordinates ON cities(latitude, longitude);
CREATE INDEX idx_cities_name_gin ON cities USING gin(to_tsvector('english', name));
```

## Translation Tables

### 1. Category Translations

Multilingual support for job categories.

```sql
CREATE TABLE category_translations (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    lang VARCHAR(2) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, lang)
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique translation identifier | Primary key, auto-increment |
| `category_id` | INTEGER | Category reference | Foreign key to categories |
| `lang` | VARCHAR(2) | Language code | ISO 639-1 format |
| `name` | VARCHAR(255) | Translated category name | Required |
| `description` | TEXT | Translated description | Optional |
| `created_at` | TIMESTAMP | Translation creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique constraint index
CREATE UNIQUE INDEX idx_category_translations_unique ON category_translations(category_id, lang);

-- Performance indexes
CREATE INDEX idx_category_translations_lang ON category_translations(lang);
CREATE INDEX idx_category_translations_name ON category_translations(name);
```

#### Relationships

```sql
-- Translations belong to a category
ALTER TABLE category_translations ADD CONSTRAINT fk_category_translations_category 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
```

### 2. City Translations

Multilingual support for city names.

```sql
CREATE TABLE city_translations (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL,
    lang VARCHAR(2) NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city_id, lang)
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique translation identifier | Primary key, auto-increment |
| `city_id` | INTEGER | City reference | Foreign key to cities |
| `lang` | VARCHAR(2) | Language code | ISO 639-1 format |
| `name` | VARCHAR(255) | Translated city name | Required |
| `region` | VARCHAR(255) | Translated region name | Optional |
| `created_at` | TIMESTAMP | Translation creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique constraint index
CREATE UNIQUE INDEX idx_city_translations_unique ON city_translations(city_id, lang);

-- Performance indexes
CREATE INDEX idx_city_translations_lang ON city_translations(lang);
CREATE INDEX idx_city_translations_name ON city_translations(name);
```

#### Relationships

```sql
-- Translations belong to a city
ALTER TABLE city_translations ADD CONSTRAINT fk_city_translations_city 
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE;
```

## Supporting Tables

### 1. Seekers Table

Job seekers looking for employment opportunities.

```sql
CREATE TABLE seekers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_demanded BOOLEAN DEFAULT FALSE,
    gender VARCHAR(50),
    facebook VARCHAR(255),
    languages TEXT[],
    native_language VARCHAR(100),
    employment VARCHAR(100),
    category VARCHAR(100),
    documents VARCHAR(255),
    note TEXT,
    announcement TEXT,
    document_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique seeker identifier | Primary key, auto-increment |
| `name` | VARCHAR(255) | Seeker's full name | Required |
| `contact` | VARCHAR(255) | Contact information | Required |
| `city` | VARCHAR(255) | City of residence | Required |
| `description` | TEXT | Seeker description | Required |
| `slug` | VARCHAR(255) | URL-friendly identifier | Unique, required |
| `is_active` | BOOLEAN | Seeker active status | Default: true |
| `is_demanded` | BOOLEAN | High demand status | Default: false |
| `gender` | VARCHAR(50) | Gender identification | Optional |
| `facebook` | VARCHAR(255) | Facebook profile | Optional |
| `languages` | TEXT[] | Spoken languages | Array of languages |
| `native_language` | VARCHAR(100) | Native language | Optional |
| `employment` | VARCHAR(100) | Employment type | Optional |
| `category` | VARCHAR(100) | Job category preference | Optional |
| `documents` | VARCHAR(255) | Available documents | Optional |
| `note` | TEXT | Additional notes | Optional |
| `announcement` | TEXT | Public announcement | Optional |
| `document_type` | VARCHAR(100) | Document types | Optional |
| `created_at` | TIMESTAMP | Profile creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique indexes
CREATE UNIQUE INDEX idx_seekers_slug ON seekers(slug);

-- Performance indexes
CREATE INDEX idx_seekers_active ON seekers(is_active);
CREATE INDEX idx_seekers_demanded ON seekers(is_demanded);
CREATE INDEX idx_seekers_city ON seekers(city);
CREATE INDEX idx_seekers_category ON seekers(category);
CREATE INDEX idx_seekers_employment ON seekers(employment);
CREATE INDEX idx_seekers_created_at ON seekers(created_at);

-- Search indexes
CREATE INDEX idx_seekers_name_gin ON seekers USING gin(to_tsvector('english', name));
CREATE INDEX idx_seekers_description_gin ON seekers USING gin(to_tsvector('english', description));
```

### 2. Messages Table

User messaging and notification system.

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) NOT NULL,
    from_admin_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Unique message identifier | Primary key, auto-generated |
| `clerk_user_id` | VARCHAR(255) | Recipient user ID | Foreign key to users |
| `title` | VARCHAR(255) | Message title | Required |
| `body` | TEXT | Message content | Required |
| `is_read` | BOOLEAN | Read status | Default: false |
| `type` | VARCHAR(50) | Message type | 'system', 'admin', 'notification' |
| `from_admin_id` | VARCHAR(255) | Admin sender ID | Optional |
| `created_at` | TIMESTAMP | Message creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Performance indexes
CREATE INDEX idx_messages_user_id ON messages(clerk_user_id);
CREATE INDEX idx_messages_type ON messages(type);
CREATE INDEX idx_messages_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_admin_id ON messages(from_admin_id);
```

#### Relationships

```sql
-- Messages belong to a user
ALTER TABLE messages ADD CONSTRAINT fk_messages_user 
    FOREIGN KEY (clerk_user_id) REFERENCES users(clerk_user_id) ON DELETE CASCADE;

-- Messages can be from an admin
ALTER TABLE messages ADD CONSTRAINT fk_messages_admin 
    FOREIGN KEY (from_admin_id) REFERENCES users(clerk_user_id) ON DELETE SET NULL;
```

### 3. Payments Table

Payment and subscription tracking.

```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_subscription_id VARCHAR(255),
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique payment identifier | Primary key, auto-increment |
| `user_id` | VARCHAR(255) | User reference | Foreign key to users |
| `stripe_payment_intent_id` | VARCHAR(255) | Stripe payment intent | Unique, required |
| `stripe_subscription_id` | VARCHAR(255) | Stripe subscription ID | Optional |
| `amount` | INTEGER | Payment amount in cents | Required |
| `currency` | VARCHAR(3) | Payment currency | Default: USD |
| `status` | VARCHAR(50) | Payment status | Required |
| `payment_method` | VARCHAR(50) | Payment method used | Optional |
| `description` | TEXT | Payment description | Optional |
| `metadata` | JSONB | Additional payment data | Optional |
| `created_at` | TIMESTAMP | Payment creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique indexes
CREATE UNIQUE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);

-- Performance indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(stripe_subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_currency ON payments(currency);

-- JSONB indexes
CREATE INDEX idx_payments_metadata_gin ON payments USING gin(metadata);
```

#### Relationships

```sql
-- Payments belong to a user
ALTER TABLE payments ADD CONSTRAINT fk_payments_user 
    FOREIGN KEY (user_id) REFERENCES users(clerk_user_id) ON DELETE CASCADE;
```

## Newsletter System

### 1. Newsletter Subscribers

Email newsletter subscription management.

```sql
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(255),
    verification_expires_at TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields Description

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | SERIAL | Unique subscriber identifier | Primary key, auto-increment |
| `email` | VARCHAR(255) | Subscriber email | Unique, required |
| `is_verified` | BOOLEAN | Email verification status | Default: false |
| `verification_code` | VARCHAR(255) | Email verification code | Optional |
| `verification_expires_at` | TIMESTAMP | Verification code expiry | Optional |
| `preferences` | JSONB | Newsletter preferences | Default: empty object |
| `is_active` | BOOLEAN | Subscription active status | Default: true |
| `subscribed_at` | TIMESTAMP | Subscription date | Auto-generated |
| `verified_at` | TIMESTAMP | Email verification date | Optional |
| `unsubscribed_at` | TIMESTAMP | Unsubscription date | Optional |
| `created_at` | TIMESTAMP | Record creation date | Auto-generated |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto-updated |

#### Indexes

```sql
-- Primary key index (automatic)
-- Unique indexes
CREATE UNIQUE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Performance indexes
CREATE INDEX idx_newsletter_subscribers_verified ON newsletter_subscribers(is_verified);
CREATE INDEX idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);
CREATE INDEX idx_newsletter_subscribers_verification_code ON newsletter_subscribers(verification_code);
CREATE INDEX idx_newsletter_subscribers_verification_expires ON newsletter_subscribers(verification_expires_at);

-- JSONB indexes
CREATE INDEX idx_newsletter_subscribers_preferences_gin ON newsletter_subscribers USING gin(preferences);
```

## Database Extensions

### 1. Required Extensions

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable case-insensitive text search
CREATE EXTENSION IF NOT EXISTS "citext";

-- Enable JSON operations
CREATE EXTENSION IF NOT EXISTS "jsquery";
```

### 2. Custom Functions

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ language 'plpgsql';
```

## Triggers

### 1. Updated At Triggers

```sql
-- Automatically update updated_at column
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cities_updated_at 
    BEFORE UPDATE ON cities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Slug Generation Triggers

```sql
-- Automatically generate slugs for categories
CREATE TRIGGER generate_category_slug 
    BEFORE INSERT OR UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION generate_slug();

-- Automatically generate slugs for cities
CREATE TRIGGER generate_city_slug 
    BEFORE INSERT OR UPDATE ON cities 
    FOR EACH ROW EXECUTE FUNCTION generate_slug();
```

## Views

### 1. Active Jobs View

```sql
CREATE VIEW active_jobs_view AS
SELECT 
    j.id,
    j.title,
    j.salary,
    j.phone,
    j.description,
    j.shuttle,
    j.meals,
    j.boosted_at,
    j.created_at,
    c.name as city_name,
    cat.name as category_name,
    u.first_name,
    u.last_name,
    u.is_premium
FROM jobs j
JOIN cities c ON j.city_id = c.id
JOIN categories cat ON j.category_id = cat.id
JOIN users u ON j.user_id = u.clerk_user_id
WHERE j.is_active = TRUE
ORDER BY 
    j.boosted_at DESC NULLS LAST,
    j.created_at DESC;
```

### 2. Premium Users View

```sql
CREATE VIEW premium_users_view AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_premium,
    u.premium_deluxe,
    u.premium_ends_at,
    u.is_auto_renewal,
    COUNT(j.id) as job_count,
    MAX(j.created_at) as last_job_date
FROM users u
LEFT JOIN jobs j ON u.clerk_user_id = j.user_id AND j.is_active = TRUE
WHERE u.is_premium = TRUE
GROUP BY u.id, u.email, u.first_name, u.last_name, u.is_premium, u.premium_deluxe, u.premium_ends_at, u.is_auto_renewal;
```

## Data Seeding

### 1. Seed Scripts

```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed cities
  const cities = [
    { name: 'Tel Aviv', region: 'Central' },
    { name: 'Jerusalem', region: 'Jerusalem' },
    { name: 'Haifa', region: 'Northern' },
    { name: 'Beer Sheva', region: 'Southern' }
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city
    });
  }

  // Seed categories
  const categories = [
    { name: 'Construction', slug: 'construction' },
    { name: 'Kitchen', slug: 'kitchen' },
    { name: 'Office', slug: 'office' },
    { name: 'Cleaning', slug: 'cleaning' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  // Seed translations
  const translations = [
    { cityName: 'Tel Aviv', lang: 'he', name: 'תל אביב' },
    { cityName: 'Jerusalem', lang: 'he', name: 'ירושלים' },
    { cityName: 'Tel Aviv', lang: 'ru', name: 'Тель-Авив' },
    { cityName: 'Jerusalem', lang: 'ru', name: 'Иерусалим' }
  ];

  for (const translation of translations) {
    const city = await prisma.city.findUnique({
      where: { name: translation.cityName }
    });

    if (city) {
      await prisma.cityTranslation.upsert({
        where: {
          cityId_lang: {
            cityId: city.id,
            lang: translation.lang
          }
        },
        update: { name: translation.name },
        create: {
          cityId: city.id,
          lang: translation.lang,
          name: translation.name
        }
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Performance Optimization

### 1. Query Optimization

```sql
-- Analyze table statistics
ANALYZE users;
ANALYZE jobs;
ANALYZE categories;
ANALYZE cities;

-- Update table statistics
VACUUM ANALYZE;

-- Optimize specific queries
EXPLAIN (ANALYZE, BUFFERS) 
SELECT j.*, c.name as city_name, cat.name as category_name
FROM jobs j
JOIN cities c ON j.city_id = c.id
JOIN categories cat ON j.category_id = cat.id
WHERE j.is_active = TRUE
ORDER BY j.created_at DESC
LIMIT 20;
```

### 2. Connection Pooling

```javascript
// libs/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Connection pooling configuration
  connectionLimit: 10,
  pool: {
    min: 2,
    max: 10
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Backup and Recovery

### 1. Backup Scripts

```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="worknow_db"
DB_USER="worknow"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -U $DB_USER -h localhost -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: backup_$DATE.sql.gz"
```

### 2. Recovery Scripts

```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE=$1
DB_NAME="worknow_db"
DB_USER="worknow"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Stop application
docker-compose stop backend

# Drop and recreate database
psql -U $DB_USER -h localhost -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;"

# Restore from backup
gunzip -c $BACKUP_FILE | psql -U $DB_USER -h localhost -d $DB_NAME

# Start application
docker-compose start backend

echo "Database restoration completed"
```

## Monitoring and Maintenance

### 1. Database Health Checks

```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check table statistics
SELECT 
    schemaname,
    tablename,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

### 2. Maintenance Tasks

```sql
-- Regular maintenance
VACUUM ANALYZE;
REINDEX DATABASE worknow_db;

-- Update statistics
ANALYZE VERBOSE;

-- Check for bloat
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    n_live_tup,
    round(100.0 * n_dead_tup / (n_live_tup + n_dead_tup), 2) as bloat_percent
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY bloat_percent DESC;
```

## Conclusion

The WorkNow database schema is designed for scalability, performance, and maintainability. Key features include:

- **Efficient indexing** for fast queries and searches
- **Multilingual support** through translation tables
- **Soft deletion** for data integrity
- **Audit trails** for tracking changes
- **Optimized relationships** for complex queries
- **Performance monitoring** and maintenance tools

The schema supports the platform's core functionality while maintaining flexibility for future enhancements and scaling requirements.
