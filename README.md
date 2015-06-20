# Muni Difficulty Scale - Web Client

This is the web client for the muni difficulty scale website.
The UI is largely decoupled from the application server and communicates through a REST interface with the server.
The server project can be found at https://github.com/schocco/mds-web 

## Setup dev environment
- Make sure node.js is installed
- run npm install in this directory
- run gulp
- done

## Build for production
run `gulp build --type production` for a production build, serve the dist folder