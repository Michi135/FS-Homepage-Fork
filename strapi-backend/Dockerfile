FROM node:18.15-buster-slim
# Installing libvips-dev for sharp compatability
RUN apt-get update && apt-get install -y libvips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./patches ./patches
ENV PATH /opt/node_modules/.bin:$PATH
RUN npm i
WORKDIR /opt/app
COPY ./ .
RUN npm run build
EXPOSE 1337
CMD ["yarn", "strapi", "start"]
