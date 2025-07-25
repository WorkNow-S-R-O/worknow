#!/bin/sh

echo "🚀 Starting WorkNow application..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; do
  echo "Database not ready yet, waiting..."
  sleep 2
done
echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy
echo "✅ Migrations completed!"

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed
echo "✅ Database seeded!"

# Start the application
echo "🚀 Starting the application..."
exec node apps/api/index.js 