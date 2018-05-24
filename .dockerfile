# Linux distro with node.js pre-installed
FROM node:10-alpine
# My credentials
LABEL maintainer "ShayBox <shayneehartford@gmail.com>"
# Workdir
WORKDIR /usr/src/Shaybot
# Copy package.json and yarn.lock for Yarn
COPY package.json yarn.lock ./
# Install dependencies 
RUN apk add --update \
&& apk add --no-cache ffmpeg opus pixman cairo pango giflib ca-certificates \
&& apk add --no-cache --virtual .build-deps git curl build-base jpeg-dev pixman-dev \
cairo-dev pango-dev pangomm-dev libjpeg-turbo-dev giflib-dev freetype-dev python g++ make \
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