FROM node:20-slim

WORKDIR /app

# Copy the package.json and package-lock.json (if available) into the container
# COPY ./package*.json /app/

# Copy the rest of the project files into the container
COPY ./ /app/

# Install project dependencies
RUN npm install

# Make port 3000 available to the world outside the container
EXPOSE 3000

CMD ["npx", "next", "dev"]
