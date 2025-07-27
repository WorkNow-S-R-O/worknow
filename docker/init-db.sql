-- Initialize WorkNow Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE worknow'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'worknow')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE worknow TO worknow;

-- Connect to the worknow database
\c worknow;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql'; 