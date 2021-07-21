FROM node:14

WORKDIR /app
COPY . .

RUN yarn install && yarn add @discordjs/opus
RUN yarn build

CMD ["yarn", "start"]
