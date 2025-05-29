# Build
FROM localhost/microservice-build as build
ENV NODE_ENV=production
WORKDIR /app
COPY package.json .
RUN npm ci

# Run
FROM localhost/microservice-build
WORKDIR /app
COPY --from=build /app /app
COPY /src /app/src
EXPOSE 3000
CMD [ "npm", "run", "start" ]
