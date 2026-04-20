# ──────────────────────────────────────────────────
# Stage 1: Build the React application
# ──────────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Build the application
ENV CI=false
RUN npm run build

# ──────────────────────────────────────────────────
# Stage 2: Serve with Nginx (production)
# ──────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
