FROM node:20.10.0
WORKDIR /code
COPY application/package*.json ./
RUN npm install -g @nestjs/cli
RUN npm install
COPY ./containers/node/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
