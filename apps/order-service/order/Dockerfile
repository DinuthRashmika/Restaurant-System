# Stage 1: Build
FROM eclipse-temurin:17-jre
EXPOSE 8083
ADD target/orderapp.jar orderapp.jar
ENTRYPOINT ["java", "-jar", "orderapp.jar"]
