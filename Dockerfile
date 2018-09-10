FROM node:10-alpine

LABEL maintainer "ShayBox <shayneehartford@gmail.com>"

WORKDIR /src

COPY package.json ./

RUN apk add --update \
&& apk add --no-cache --virtual .build-deps git \
&& npm install --production=true \
&& apk del .build-deps

COPY . .

ENV TS_NODE_FILES=TRUE \
	TOKEN= \
	DATABASE= \
	DBL_API= \
	DBOTS_API=

CMD ["npm", "start"]