FROM node:12.18.4-alpine3.12

ENV PYTHONUNBUFFERED=1

RUN apk add --no-cache python2 && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    rm -r /root/.cache
RUN mkdir /home/app
COPY package.json /home/app/
WORKDIR /home/app
RUN npm install
COPY tsconfig.base.json tslint.json angular.json nx.json /home/app/
#RUN npm rebuild @tensorflow/tfjs-node build-addon-from-source