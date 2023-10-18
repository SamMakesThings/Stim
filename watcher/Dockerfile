FROM node:latest

WORKDIR /app

# Copy the package.json and package-lock.json (if available) into the container
# COPY ./package*.json /app/

# Copy the rest of the project files into the container
COPY ./ /app/

# Install project dependencies
RUN npm install

CMD ["node", "app.mjs"]
