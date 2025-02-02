FROM docker.io/node:22-alpine
WORKDIR /app
COPY . .
RUN npm install -g tsx
EXPOSE 3000
CMD [ "tsx", "main.ts" ]
