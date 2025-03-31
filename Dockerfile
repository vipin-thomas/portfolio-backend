FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy app files
COPY . .

# Expose port and run app
EXPOSE 5000
CMD ["npm", "start"]
