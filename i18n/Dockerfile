FROM node:8.5

ENV HOME=/i18n

WORKDIR $HOME

COPY ./react-app $HOME

RUN yarn install --progress=false

CMD [ "yarn", "run", "build:start" ]
