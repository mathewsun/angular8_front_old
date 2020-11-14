FROM node:10.16-alpine as builder

ARG API_HOST
ARG ROUTER_HOST
ARG TARGET_BRANCH

ENV API_HOST $API_HOST
ENV ROUTER_HOST $ROUTER_HOST
ENV TARGET_BRANCH $TARGET_BRANCH

WORKDIR /app
COPY package.json package-lock.json ./
RUN NODE_ENV=development BLUEBIRD_DEBUG=0 npm ci
COPY . .
RUN npm run ng build -- --prod --configuration=ru --output-hashing=all
RUN npm run ng build -- --prod --configuration=en --output-hashing=all


FROM nginx:1.14-alpine
LABEL maintainer="Mikhail Shumilov <ms@click2.money>"

WORKDIR /usr/share/nginx/html
RUN rm -rf * *.* && rm -f /etc/nginx.conf && rm -rf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/nginx.conf
COPY src/robots.txt .
COPY src/favicon.ico .
COPY --from=builder /app/dist .

EXPOSE 80


