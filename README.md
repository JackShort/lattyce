# Lattyce Installation Guide

## Make sure the following is installed on your stystem (Download the latest stable release of everything)
* PostgreSQL
    * It can be downloaded here: https://www.postgresql.org/download/
    * On setup if it asks which port to install it on choose: 5432
* Download PGAdmin
    * It can be downloaded here: https://www.pgadmin.org/download/
* Node.js
    * This can be downloaded here: https://nodejs.org/en/
* HTTP-Server
    * Install after node.js, type the following:
    * $ npm install http-server -g

## Next Setup the Database
* Open up PGAdmin (should open in a window in browser)
* Expand servers in left hand view
* Expand localhost
* Right Click on Databases
    * Click Create > Database
    * Name the database: 'constellations'

## Next Download the Repository from the github ($ - means console command)
* open a new terminal window and type the following
    * $ git clone https://github.com/JackShort/lattyce.git

## Install the packages in each of the folders ($ - means console command)
* Install the packages in the client project
    * $ cd /Lattyce/client
    * $ npm install

* Install the packages in the client project
    * $ cd ../server
    * $ npm install

## Start the development servers ($ - means console command)
* Open 3 terminals
* In the first terminal do the following to start the image hosting server:
    * $ cd Lattyce/client/src/icons
    * $ http-server -c-1 --cors
* In the second terminal do the following to start the react server:
    * $ cd Lattyce/client
    * $ npm start
* In the third terminal do the following to start the express/graphql server:
    * $ cd Lattyce/server
    * $ npm start

## View Results
* The GraphQL interface can be viewed at: http://localhost:3000
* The GraphQL interface can be viewed at: http://localhost:4000/graphiql
