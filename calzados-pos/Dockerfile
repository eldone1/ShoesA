# ETAPA DE CONSTRUCCIÓN
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Esto permite que Docker cachee las dependencias y no las descargue siempre
RUN ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ETAPA DE EJECUCIÓN (Imagen ligera)
FROM eclipse-temurin:17-jre
WORKDIR /app
# El truco está aquí: copiamos desde la etapa 'build' al contenedor final
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]