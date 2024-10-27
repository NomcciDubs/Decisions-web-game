# Utiliza una imagen de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el proyecto al directorio de trabajo
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Establece la variable de entorno para producción
ENV NODE_ENV=production

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
