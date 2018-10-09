FROM node:10-alpine

WORKDIR /hex

COPY . .

RUN apk add --update \
&& apk add --no-cache --virtual .build-deps git \
&& yarn install \
&& apk del .build-deps

CMD ["npm", "start"]