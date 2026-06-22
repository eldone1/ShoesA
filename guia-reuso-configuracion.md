# Guia de reuso de configuracion del proyecto

Este documento resume como esta armado el proyecto para que puedas llevar la misma base a otro sistema.

## 1. Seguridad del backend

La clase `SecurityConfig` define una aplicacion Spring Security con JWT y sesiones stateless.

### Flujo principal

- Habilita `@EnableWebSecurity` y `@EnableMethodSecurity`.
- Usa `SessionCreationPolicy.STATELESS`, asi que no depende de sesiones HTTP.
- Inserta `JwtAuthFilter` antes de `UsernamePasswordAuthenticationFilter`.
- Configura un `DaoAuthenticationProvider` con `UserDetailsService` y `BCryptPasswordEncoder`.

### Rutas permitidas o protegidas

- Permite sin autenticacion:
  - `/actuator/health`
  - `/api/auth/**`
  - todas las peticiones `OPTIONS`.
- Permite `GET` sobre `/api/productos/**` y `/api/marcas/**` para `ADMIN` y `CAJERO`.
- Permite escritura sobre `/api/productos/**`, `/api/marcas/**`, `/api/users/**` y `/api/proveedores/**` solo para `ADMIN`.
- Permite `/api/cajas/**` y `/api/ventas/**` para `ADMIN` y `CAJERO`.
- Permite `/api/gastos/**` y `/api/reportes/**` solo para `ADMIN`.
- Todo lo demas requiere autenticacion.

### Idea para reutilizarlo

Si vas a copiar esta base a otro proyecto, la parte que realmente debes adaptar es la matriz de permisos por ruta y rol. El patron general ya esta resuelto: JWT + filtro + provider + encoder + sesiones estateless.

## 2. CORS por entorno

La clase `CorsConfigDev` esta limitada al perfil `dev`.

### Comportamiento

- Solo existe cuando el perfil activo es `dev`.
- Permite origen `http://localhost:4200`.
- Permite metodos `GET`, `POST`, `PUT`, `DELETE`, `PATCH` y `OPTIONS`.
- Acepta todos los headers.
- Permite credenciales.

### Idea para reutilizarlo

En otro proyecto conviene copiar esta misma estrategia:

- CORS abierto solo en desarrollo.
- En produccion, dejar que el frontend hable al backend mediante proxy o dominio controlado.

## 3. Properties por perfil

El proyecto separa configuracion en `application-dev.yml` y `application-prod.yml`.

### `application-dev.yml`

- La base de datos usa variables separadas:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASSWORD`
- La URL JDBC se arma con `jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}`.
- El huso horario sale de `TIME_ZONE`.
- Hibernate usa `ddl-auto: validate`.
- `show-sql` esta en `true` para desarrollo.
- El puerto del servidor sale de `SPRING_PORT`.
- JWT usa:
  - `JWT_SECRET`
  - `JWT_EXPIRATION`
- Los logs se controlan con:
  - `LOG_LEVEL_APP`
  - `LOG_LEVEL_SQL`

### `application-prod.yml`

- La conexion usa variables completas de Spring:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
- Tambien usa `TIME_ZONE`.
- Hibernate sigue con `ddl-auto: validate`.
- `show-sql` queda en `false`.
- Expone solo `management.endpoints.web.exposure.include=health`.
- Mantiene el puerto con `SPRING_PORT`.
- JWT y logs siguen el mismo esquema de variables.

### Idea para reutilizarlo

La clave es que el proyecto no hardcodea credenciales ni hostnames en el YAML. Todo sale de variables de entorno, asi que al moverlo a otro entorno solo cambias el orquestador o el archivo `.env`.

## 4. Dockerfile del backend

El backend usa un build multi-stage.

### Etapa de build

- Base: `eclipse-temurin:17-jdk`.
- Copia el wrapper de Maven y el `pom.xml`.
- Ejecuta `./mvnw dependency:go-offline -B` para cachear dependencias.
- Copia `src`.
- Compila con `./mvnw clean package -DskipTests`.

### Etapa final

- Base: `eclipse-temurin:17-jre`.
- Copia el JAR generado desde la etapa de build.
- Expone el puerto `8080`.
- Arranca con `java -jar app.jar`.

### Idea para reutilizarlo

Este patron sirve bien para proyectos Spring Boot porque separa compilacion y ejecucion. Si lo llevas a otro proyecto, solo cambia la version de Java y la estrategia de build si tu backend no usa Maven o no genera un unico JAR.

## 5. Dockerfile del frontend

El frontend Angular tambien usa multi-stage.

### Etapa de build

- Base: `node:20-alpine`.
- Instala dependencias con `npm install`.
- Compila con `npm run build -- --configuration production`.

### Etapa final

- Base: `nginx:alpine`.
- Copia el resultado compilado desde `dist/calzados-frontend/browser`.
- Copia un `nginx.conf` propio para servir la SPA.
- Expone `80`.

### Idea para reutilizarlo

La logica importante es que Angular no se sirve con `ng serve` en produccion. Se compila a archivos estaticos y Nginx se encarga de servirlos, incluyendo el fallback de SPA.

## 6. Nginx para frontend y reverse proxy

### `calzados-frontend/nginx.conf`

- Sirve Angular desde `/usr/share/nginx/html`.
- Redirige rutas SPA a `index.html` con `try_files`.
- Agrega un proxy para `/api/` hacia `http://backend:8080/api/`.
- Con eso el frontend puede consumir al backend sin exponer el puerto 8080 al navegador.

### `nginx.conf` de la raiz

- Mantiene la misma idea de SPA routing.
- Agrega headers basicos de seguridad.
- Oculta archivos sensibles con una regla para rutas que empiezan con punto.

### Idea para reutilizarlo

Si vas a copiar esta arquitectura, este es el punto que mas simplifica CORS en produccion: el navegador habla con el mismo origen y Nginx redirige internamente a backend.

## 7. Docker Compose de desarrollo

El archivo `docker-compose.dev.yml` arma tres servicios: MySQL, backend y frontend.

### MySQL

- Usa `mysql:8.0`.
- Expone `3306`.
- Persiste datos en el volumen `calzados_mysql_data`.
- Inicializa esquema y datos con:
  - `schema.sql`
  - `data.sql`

### Backend

- Se construye desde `./calzados-pos`.
- Usa `SPRING_PROFILES_ACTIVE=dev`.
- En vez de una sola URL JDBC, usa variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`.
- Expone `8080:8080`.
- Tiene healthcheck contra `/actuator/health`.

### Frontend

- Se construye desde `./calzados-frontend`.
- Expone `4200:80`.
- Espera a que el backend este sano.

### Idea para reutilizarlo

Este compose esta pensado para levantar todo local con una red interna (`calzados_net`) y una base de datos persistente. Es una buena plantilla si quieres un entorno de desarrollo reproducible.

## 8. Docker Compose de produccion

El archivo `docker-compose.prod.yml` conserva la misma topologia, pero con variables mas orientadas a despliegue.

### Diferencias principales

- El backend usa `SPRING_PROFILES_ACTIVE=prod`.
- La conexion a base de datos se inyecta con `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD`.
- El backend cambia `show-sql` a `true` en el compose, asi que conviene revisar si eso es intencional antes de copiarlo a otro proyecto.
- El frontend expone `80:80` en lugar de `4200:80`.
- El healthcheck del backend usa `curl` en lugar de `wget`.

### Idea para reutilizarlo

En produccion, el valor mas importante es que el backend ya no arma la URL por partes, sino que recibe la cadena completa. Eso simplifica despliegue en Docker o en un orquestador.

## 9. Variables que debes llevar a otro proyecto

Si replicas esta estructura, normalmente necesitas definir estas variables:

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `TIME_ZONE`
- `SPRING_PORT`
- `LOG_LEVEL_APP`
- `LOG_LEVEL_SQL`

## 10. Orden recomendado para copiar esta arquitectura

1. Copia la configuracion de seguridad JWT del backend.
2. Separa CORS por perfil, dejando `dev` para localhost.
3. Define `application-dev.yml` y `application-prod.yml` con variables de entorno.
4. Crea Dockerfiles multi-stage para backend y frontend.
5. Arma Compose por entorno y conecta todo por una red interna.
6. Usa Nginx para servir Angular y hacer proxy a `/api/`.

## 11. Resumen corto

La idea del proyecto es esta:

- Backend Spring Boot con JWT, roles y sesiones estateless.
- CORS solo en desarrollo.
- Configuracion por perfil y por variables de entorno.
- Backend y frontend empaquetados con Docker multi-stage.
- Nginx sirve la SPA y hace proxy al backend.
- Docker Compose une MySQL, backend y frontend con una red interna y volumen persistente.
