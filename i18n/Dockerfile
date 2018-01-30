FROM node:8.5

ENV HOME=/i18n

COPY package.json /i18n/

WORKDIR $HOME

RUN yarn install --progress=false

COPY . $HOME

CMD [ "yarn", "run", "build" ]
