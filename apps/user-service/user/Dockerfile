# Stage 1: Build
FROM eclipse-temurin:17-jre
EXPOSE 8081
ADD target/userapp.jar userapp.jar
ENTRYPOINT ["java", "-jar", "userapp.jar"]