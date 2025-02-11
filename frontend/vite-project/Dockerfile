# Use Node.js as base image
FROM node:18

# Set correct working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend project
COPY . .

# Expose the Vite development port
EXPOSE 5173

# Run Vite in development mode and make it accessible
CMD ["npm", "run", "dev", "--", "--host"]
