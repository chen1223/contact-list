# Prerequisite

This project runs on Node version 18. Please use nvm to install node version 18 or install node 18 directly from the [NodeJS](https://nodejs.org/en) website.

# Backend API

The application expects a Backend server from the [resumecompanion
/
taroko_server](https://github.com/resumecompanion/taroko_server) to be running at **http://localhost:3000** when the Frontend application starts. To change this endpoint, provide an environment variable **NEXT_PUBLIC_BACKEND_ENDPOINT** either in **.env** or start the server as following:

`NEXT_PUBLIC_BACKEND_ENDPOINT=http://api.com yarn dev`

# Install & Start the server

Run `yarn install` to install the dependencies

RUN `yarn build` to build the application

Run `yarn start` to start the application. The application will be running on **http://localhost:3001**
