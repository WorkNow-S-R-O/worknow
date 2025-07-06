# --- Stage 1: Build frontend ---
    FROM node:20-slim AS frontend-build
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN apt-get update && apt-get install -y openssl
    
    # Accept Vite env vars as build args
    ARG VITE_CLERK_PUBLISHABLE_KEY
    ARG VITE_API_URL
    ARG VITE_STRIPE_PUBLISHABLE_KEY
    
    # Set them as environment variables for the build
    ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
    ENV VITE_API_URL=$VITE_API_URL
    ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
    
    RUN npm ci --ignore-scripts
    COPY ./src ./src
    COPY ./public ./public
    COPY index.html ./
    COPY vite.config.js ./
    COPY tailwind.config.js ./
    COPY postcss.config.js ./
    RUN npm run build
    
    # --- Stage 2: Prepare backend (no build needed) ---
    FROM node:20-slim AS backend-build
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN apt-get update && apt-get install -y openssl
    RUN npm ci --ignore-scripts
    COPY ./server ./server
    COPY ./src ./src
    COPY ./prisma ./prisma
    COPY tsconfig.server.json ./
    # No backend build step needed for JavaScript backend
    
    # --- Stage 3: Production image ---
    FROM node:20-slim AS production
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Install OpenSSL for Prisma compatibility
    RUN apt-get update && apt-get install -y openssl
    # Install only production dependencies
    COPY package.json package-lock.json ./
    RUN npm ci --only=production --ignore-scripts
    
    # Copy built frontend
    COPY --from=frontend-build /app/dist ./dist
    # Copy backend source
    COPY --from=backend-build /app/server ./server
    COPY --from=backend-build /app/prisma ./prisma
    COPY --from=backend-build /app/tsconfig.server.json ./
    
    # Prisma: generate client
    RUN npx prisma generate
    
    # Copy any other needed files (e.g., static assets)
    COPY public ./public
    
    # Use a non-root user for security
    RUN useradd -m appuser
    USER appuser
    
    # Expose Express port
    EXPOSE 3001
    
    # Start the server
    CMD ["node", "server/index.js"] 