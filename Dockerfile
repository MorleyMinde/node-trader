FROM node:12.18.4-buster-slim

# ENV PYTHONUNBUFFERED=1

# RUN apk add --no-cache python2 && \
#     python -m ensurepip && \
#     rm -r /usr/lib/python*/ensurepip && \
#     pip install --upgrade pip setuptools && \
#     rm -r /root/.cache
RUN mkdir /home/app
COPY package.json /home/app/
WORKDIR /home/app
COPY tsconfig.base.json tslint.json angular.json nx.json /home/app/

RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y wget
RUN apt-get install -y python3
RUN apt-get install -y make
RUN apt-get install -y gcc
RUN apt-get install -y libc6-dev
RUN npm install