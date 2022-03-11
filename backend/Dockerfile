FROM node:16.13.2-buster-slim

RUN apt-get update && apt-get -y install --no-install-recommends \
  unzip \
  bzip2 && \
  apt-get install -y libssl1.1 && \
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
#RUN ["npx", "keystone", "prisma", "migrate", "deploy"]
CMD ["npx", "keystone", "start"]

#ENV NODE_ENV development
#CMD ["npx", "keystone", "dev"]
#CMD ["tail", "-f", "/dev/null"]
#sudo docker-compose exec keystone /bin/bash