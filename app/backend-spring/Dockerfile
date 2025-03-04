# TODO: Add build step and then use JRE to run compiled app in production
FROM localhost/microservice-java-build
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 3004
ENTRYPOINT ["java","-jar","app.jar", "--spring.profiles.active=production"]
