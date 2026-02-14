FROM node:22-alpine

WORKDIR /app

# Instalar dependencias primero (mejor caché)
COPY package*.json ./
RUN npm install

COPY . .

# Exponer el puerto de desarrollo
EXPOSE 3000

CMD ["npm", "run", "dev"]