FROM node:20.14.0 AS build

ARG DEPLOY_ENV

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
RUN if [ "$DEPLOY_ENV" = "prod" ]; then \
      yarn build:prod; \
    elif [ "$DEPLOY_ENV" = "develop" ]; then \
      yarn build:sit; \
    else \
      yarn build:staging; \
    fi

FROM nginx:stable-alpine
COPY --from=build ./build /usr/share/nginx/html

RUN echo 'pong' > /usr/share/nginx/html/health_check

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
