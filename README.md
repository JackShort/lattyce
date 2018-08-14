# Lattyce Installation Guide

## Make sure the following is installed on your stystem
* Node.js
    * This can be downloaded here: https://nodejs.org/en/
* HTTP-Server
    * Install after node.js, type the following:
    * $ npm install http-server -g

## Next Download the Repository from the github ($ - means console command)
* open a new terminal window and type the following
    * $ git clone https://github.com/JackShort/lattyce.git


## Install the packages in each of the folders ($ - means console command)
* Install the packages in the client project
    * $ cd /Lattyce/client
    * $ npm install

* Install the packages in the client project
    * $ cd.. /server
    * $ npm install

## Start the development servers ($ - means console command)
* Open 4 terminals
* In the first terminal do the following to start the image hosting server:
    * $ cd Lattyce/client/src/icons
    * $ http-server -c-1 --cors
* In the second termindal do the following to start the rect server
