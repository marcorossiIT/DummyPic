# production configuration

FROM node:18
WORKDIR /app
RUN apt update -yy && apt install python3 build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -yy
ENV env=prod
EXPOSE 80
# for layering cache purposes this is before the next copy
COPY package.json . 
RUN if [ $env = "dev" ]; \
        then npm i ; \
        else npm i --only=production; \
    fi;
    
COPY . ./
CMD ["npm", "run", "start:prod"]

