# Linux distro with node.js pre-installed
FROM node:10-alpine
# My credentials
LABEL maintainer "ShayBox <shayneehartford@gmail.com>"
# Workdir
WORKDIR /usr/src/Shaybot
# Copy package.json
COPY package.json ./
# Install dependencies 
RUN apk add --update \
&& apk add --no-cache ca-certificates \
&& apk add --no-cache --virtual .build-deps git curl build-base python g++ make \
# Install node.js dependencies
&& yarn install \
# Clean up build dependencies
&& apk del .build-deps
# Add project source
COPY . .
# Enviroment variables
ENV token=\
    database=\
    dbl_api=\
    dbots_api=
# Run command
CMD ["node", "."]