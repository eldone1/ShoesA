# ETAPA 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código y compilamos
COPY . .
RUN npm run build -- --configuration production

# ETAPA 2: Servidor de producción (Nginx)
FROM nginx:alpine

# Copiamos los archivos compilados desde la etapa de build
# Nota: Angular 17+ suele guardar en dist/nombre/browser
COPY --from=build /app/dist/calzados-frontend/browser /usr/share/nginx/html

# Copiamos una configuración especial para que las rutas de Angular funcionen
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]