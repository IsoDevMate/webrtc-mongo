 FROM node:20

    # Create app directory      
    WORKDIR /app

    # Install app dependencies
    COPY package*.json ./

    RUN npm install

    # Bundle app source
    COPY . .

    #run code in a container
    ENV PORT 8080

    #run containers to be acccesed publicly 
    EXPOSE 8080


    #tell the container  how to run the app
     CMD [ "npm", "start" ]