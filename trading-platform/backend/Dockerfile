# Trading Platform Backend Dockerfile
# Multi-stage build for production optimization

# =============================================================================
# BUILD STAGE
# =============================================================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/videos uploads/images uploads/documents logs

# =============================================================================
# PRODUCTION STAGE
# =============================================================================
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S tradingapp -u 1001

# Set working directory
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=tradingapp:nodejs /app/src ./src
COPY --from=builder --chown=tradingapp:nodejs /app/scripts ./scripts
COPY --from=builder --chown=tradingapp:nodejs /app/uploads ./uploads
COPY --from=builder --chown=tradingapp:nodejs /app/logs ./logs

# Set proper permissions
RUN chown -R tradingapp:nodejs /app && \
    chmod -R 755 /app && \
    chmod -R 777 /app/uploads /app/logs

# Switch to non-root user
USER tradingapp

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node scripts/health-check.js || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]

# =============================================================================
# DEVELOPMENT STAGE
# =============================================================================
FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# Install development dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p uploads/videos uploads/images uploads/documents logs && \
    chmod -R 777 uploads logs

# Expose port
EXPOSE 3001

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# =============================================================================
# METADATA
# =============================================================================
LABEL maintainer="Trading Platform Team"
LABEL description="Backend API for Trading Learning Platform"
LABEL version="1.0.0"