# Ideally we use this with gradle fully installed
# FROM docker.io/eclipse-temurin:21-jdk-alpine
FROM docker.io/gradle:8-jdk21-corretto

COPY zscaler_chain_root-int.pem /usr/local/share/ca-certificates/zscaler.crt
# update-ca-certificates not installed on base image
# RUN chmod 644 /usr/local/share/ca-certificates/zscaler.crt && update-ca-certificates

RUN keytool -import -file /usr/local/share/ca-certificates/zscaler.crt -cacerts -alias zscaler -storepass changeit --noprompt
