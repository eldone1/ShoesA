# Plantilla de configuracion para Kinetic

Este archivo resume la configuracion reutilizable del proyecto actual para montarla en un nuevo sistema, por ejemplo un centro de rehabilitacion llamado Kinetic.

La idea es conservar el mismo patron:

- Backend Spring Boot con JWT.
- Frontend Angular con interceptor y guards.
- Base de datos MySQL.
- Dockerfiles separados para backend y frontend.
- Compose para desarrollo y produccion.

## 1. Flujo de auth

El auth actual funciona asi:

1. El frontend llama `POST /api/auth/login`.
2. El backend valida email y password.
3. El backend responde con un `token` JWT y los datos basicos del usuario.
4. El frontend guarda token y usuario en `localStorage`.
5. El interceptor agrega `Authorization: Bearer <token>` a cada request.
6. Los guards bloquean rutas si el usuario no esta autenticado o no tiene el rol correcto.

En el backend, el acceso publico queda reducido a:

- `/api/auth/**`
- `/actuator/health`

Y el resto se protege por rol, por ejemplo `ADMIN` y `CAJERO`.

## 2. Variables que conviene mantener

Estas son las variables que hoy sostienen la configuracion:

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_PORT`
- `TIME_ZONE`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `LOG_LEVEL_APP`
- `LOG_LEVEL_SQL`
- `SPRING_PROFILES_ACTIVE`

## 3. Archivo de entorno ejemplo

Usa el archivo `.env.example` de este repositorio como base. Ahí quedan los secretos y nombres que Docker Compose necesita.

Si quieres un nombre mas generico para Kinetic, cambia como minimo:

- Base de datos: `kinetic_pos` o `kinetic_db`.
- Usuario inicial: `admin@kinetic.local`.
- Secret JWT: una cadena base64 larga y unica.
- Zona horaria: la que use el centro.

## 4. Backend Spring Boot

### `application-dev.yml`

Usa variables separadas para desarrollo local con contenedores:

```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&serverTimezone=${TIME_ZONE}&allowPublicKeyRetrieval=true
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jackson:
    time-zone: ${TIME_ZONE}

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
        jdbc:
          time_zone: ${TIME_ZONE}

server:
  port: ${SPRING_PORT}

app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXPIRATION}

logging:
  level:
    com.pos.calzados: ${LOG_LEVEL_APP:INFO}
    org.hibernate.SQL: ${LOG_LEVEL_SQL:WARN}
```

### `application-prod.yml`

Usa la URL completa de datasource para produccion:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jackson:
    time-zone: ${TIME_ZONE}

  jpa:
    hibernate:
      ddl-auto: validate
      show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
        jdbc:
          time_zone: ${TIME_ZONE}

management:
  endpoints:
    web:
      exposure:
        include: health

server:
  port: ${SPRING_PORT}

app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXPIRATION}

logging:
  level:
    com.pos.calzados: ${LOG_LEVEL_APP:INFO}
    org.hibernate.SQL: ${LOG_LEVEL_SQL:WARN}
```

## 5. Seguridad y auth backend

La configuracion actual del backend deja este patron para reutilizar:

- `SecurityConfig` con sesion stateless.
- `JwtAuthFilter` antes de `UsernamePasswordAuthenticationFilter`.
- `PasswordEncoder` con `BCryptPasswordEncoder`.
- `AuthController` publico en `/api/auth/login`.
- `JwtUtil` leyendo `app.jwt.secret` y `app.jwt.expiration`.
- `AdminUserSeeder` creando el primer usuario ADMIN por variables de entorno.

Para Kinetic, solo cambia el nombre del paquete, las entidades y los roles si el negocio los necesita, pero conserva la forma del flujo.

## 6. Frontend Angular

### `environment.ts`

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### `environment.prod.ts`

```ts
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

### Auth frontend

El frontend actual usa esta estructura:

- `AuthService` llama a `/auth/login`.
- `JwtInterceptor` agrega el token a todas las peticiones.
- `AuthGuard` protege las rutas privadas.
- `NoAuthGuard` evita entrar al login si ya hay sesion.
- `RoleGuard` valida acceso por rol.

Si lo vas a reutilizar en Kinetic, renombra tambien las claves de `localStorage` para que no dependan de Calzados, por ejemplo:

- `kinetic_token`
- `kinetic_user`

## 7. Dockerfile backend

La plantilla recomendada para Spring Boot es multi-stage:

```dockerfile
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 8. Dockerfile frontend

La plantilla recomendada para Angular es construir y servir con Nginx:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/calzados-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 9. Nginx del frontend

La idea es esta:

- Servir Angular desde `/usr/share/nginx/html`.
- Resolver rutas SPA con `try_files ... /index.html`.
- Proxyear `/api/` al backend para evitar CORS.

Ejemplo base:

```nginx
location /api/ {
    proxy_pass http://backend:8080/api/;
}
```

## 10. Docker Compose

### Desarrollo

Servicios recomendados:

- `mysql`
- `backend`
- `frontend`

Puntos clave:

- Backend usa `SPRING_PROFILES_ACTIVE=dev`.
- Backend toma `DB_HOST=mysql` y variables por entorno.
- Frontend expone `4200:80`.
- MySQL expone `3306:3306` solo si lo necesitas localmente.

### Produccion

Puntos clave:

- Backend usa `SPRING_PROFILES_ACTIVE=prod`.
- Backend toma `SPRING_DATASOURCE_URL` completa.
- Frontend expone `80:80`.
- Nginx del frontend proxyea a `backend:8080`.

## 11. Checklist de migracion a Kinetic

1. Cambiar nombre de proyecto, artifact y descripciones en Maven.
2. Cambiar esquema de base de datos y semillas iniciales.
3. Renombrar variables de entorno en `.env.example`.
4. Cambiar claves de `localStorage` en el frontend.
5. Ajustar nombres visibles en Nginx, Docker Compose y README.
6. Revisar roles si Kinetic necesita mas de `ADMIN` y `CAJERO`.
7. Revisar dominios, puertos y time zone antes de desplegar.

## 12. Regla practica para reutilizar

Si quieres que esta base sirva para otro proyecto, conserva la arquitectura y cambia solo estos grupos de nombres:

- Marca del proyecto: Calzados -> Kinetic.
- Base de datos y usuario MySQL.
- Secretos JWT y admin inicial.
- Claves locales del frontend.
- Rutas o roles especificos del negocio.
