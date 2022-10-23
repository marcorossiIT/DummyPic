FROM node:18
WORKDIR /app
RUN apt update -yy && apt install python3 build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -yy
# for layering cache purposes this is before the next copy
COPY package.json . 
RUN npm i
COPY . ./
EXPOSE 3004
CMD ["npm", "run", "start:prod"]