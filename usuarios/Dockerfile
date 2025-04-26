# imagen oficial Node.js LTS
FROM node:18-alpine

# directorio de trabajo
WORKDIR /usr/src/app

# esto copia package.json y package-lock.json
COPY package*.json ./

# se instalan dependencias
RUN npm install --production

# se copia el codigo fuente
COPY . .

# se expone el puerto del microservicio
# MS de usuarios
EXPOSE 3002 

# arrancar microservicio
CMD ["node", "src/index.js"]
