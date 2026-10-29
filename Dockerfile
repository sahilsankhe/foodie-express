# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .

# Go into the nested backend directory where pom.xml is located
WORKDIR /app/food-ordering-backend/food-ordering-backend

# Make mvnw executable and build the project
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/food-ordering-backend/food-ordering-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]