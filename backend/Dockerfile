FROM node:16.13.2-buster-slim

RUN apt-get update && apt-get -y install --no-install-recommends \
  unzip \
  bzip2 && \
  apt-get -y autoremove && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /var/keystone
WORKDIR /var/keystone

COPY . .

RUN npm i

EXPOSE 4000

RUN chown -R node:node /var/keystone
USER node

ENV NODE_ENV production

RUN ["npx", "keystone", "build"]
CMD ["npx", "keystone", "start"]