FROM node:10-alpine

WORKDIR /hex

COPY . .

RUN apk add --update \
&& apk add --no-cache --virtual .build-deps git \
&& npm install --production=true \
&& apk del .build-deps

CMD ["npm", "start"]