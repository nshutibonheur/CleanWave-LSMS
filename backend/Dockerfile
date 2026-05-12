# ── Stage 1: Base image ───────────────────────────────────────────────────────
# Use official Node.js LTS (Long Term Support) image on Alpine Linux
# Alpine is a minimal OS (~5MB) — keeps the container small and secure
FROM node:18-alpine

# ── Stage 2: Set working directory ────────────────────────────────────────────
# All subsequent commands run from /app inside the container
WORKDIR /app

# ── Stage 3: Install dependencies ─────────────────────────────────────────────
# Copy package files FIRST (before source code)
# This uses Docker's layer cache — if package.json hasn't changed,
# Docker reuses the cached node_modules layer (faster rebuilds)
COPY package*.json ./
RUN npm install --omit=dev

# ── Stage 4: Copy application source ──────────────────────────────────────────
COPY . .

# ── Stage 5: Expose port ───────────────────────────────────────────────────────
# Tell Docker this container listens on port 3000
# (does not actually publish it — docker-compose handles that)
EXPOSE 3000

# ── Stage 6: Start the application ────────────────────────────────────────────
CMD ["node", "server.js"]
