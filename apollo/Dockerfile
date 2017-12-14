FROM node:8.5

ENV HOME=/pwa_apollo_offline

COPY package.json /pwa_apollo_offline

WORKDIR $HOME

RUN yarn install --progress=false

COPY . $HOME

CMD [ "yarn", "run", "build" ]
