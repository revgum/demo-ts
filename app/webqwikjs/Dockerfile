# Build
FROM localhost/microservice-build as build
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json .
RUN npm ci

COPY . .
RUN  npm run build

# Run
FROM localhost/microservice-build

COPY --from=build /app/dist /app/dist
COPY --from=build /app/server /app/server
EXPOSE 3000
CMD [ "node", "/app/server/entry.express.js" ]
