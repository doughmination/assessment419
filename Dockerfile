FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install && npm i -g nodemon

# Copy the rest of the application
COPY . .

# Expose the dev server port
EXPOSE 3030

# Run the dev server
CMD ["npm", "run", "dev"]