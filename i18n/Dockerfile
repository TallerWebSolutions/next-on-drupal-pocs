FROM node:8.5

ENV HOME=/i18n

WORKDIR $HOME

COPY ./react-app $HOME

RUN yarn install --progress=false

EXPOSE 80

ENV PORT=80

CMD yarn build:start
