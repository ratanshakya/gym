# ==========================================
# STAGE 1: Build the React/Vite Frontend
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (all dependencies are needed to build React)
RUN npm install

# Copy all source files
COPY . .

# Build the Vite React app for production
RUN npm run build


# ==========================================
# STAGE 2: Setup Node Express Backend Server
# ==========================================
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files again
COPY package.json package-lock.json* ./

# Install ONLY production dependencies for a lighter final image
RUN npm install --omit=dev

# Copy the backend files
COPY server.js ./
COPY .env ./

# Copy the built frontend static files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose backend port (Ensure it matches the one in server.js or .env)
EXPOSE 5000

# Start the Node.js Express server
CMD ["node", "server.js"]
