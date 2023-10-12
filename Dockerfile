FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm install --omit=dev
EXPOSE 3000
CMD npm run start