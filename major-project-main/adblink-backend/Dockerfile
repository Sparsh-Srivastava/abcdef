#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:12.13.0 AS builder

WORKDIR /usr/src/app

COPY . .
RUN npm install && npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:12.13.0-alpine

WORKDIR /app
# ENV NODE_ENV=production

COPY package*.json ./
COPY .env ./

RUN npm install --only=prod

## We just need the build to execute the command
COPY --from=builder /usr/src/app/build ./build

CMD ["node", "/app/build/index.js"]