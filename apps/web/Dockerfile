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

# Copy the rest of the app files
COPY . .

# Install project dependencies
RUN pnpm install --frozen-lockfile

# Expose the necessary port for the Web app (change if needed)
EXPOSE 3000

# Start the Web application
CMD ["pnpm", "dev"]
