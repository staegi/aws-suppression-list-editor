FROM node:12.2.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --no-save

# start app
CMD ["npm", "start"]

# copy sources
COPY . /app

