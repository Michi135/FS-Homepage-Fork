FROM node:14.13.1-buster-slim

RUN apt-get update && apt-get -y install --no-install-recommends \
  unzip \
  bzip2 && \
  apt-get -y autoremove && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /var/factor
WORKDIR /var/factor

COPY . .

RUN yarn install
RUN yarn factor build

EXPOSE 3000

RUN chown -R node:node /var/factor
USER node

CMD ["yarn", "factor", "serve"]
