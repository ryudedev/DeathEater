# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package manager files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm
# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app filesı
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Expose the necessary port for the API (change if needed)
EXPOSE 3001

# Start the API application
CMD ["pnpm", "dev"]
