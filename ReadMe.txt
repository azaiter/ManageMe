Dockerized ManageMe software package includes:
1- ManageMe API with DBEngine container
2- ManageMe preconfiged MySQL database container
3- ManageMe Notification background service
4- ManageMe Web interface
5- Adminer to manage the MySQL database using a gui
6- DELETE ME

to install:
- Install Docker package
- Unzip the file
- cd into the folder where docker-compose.yml is located:
- run docker-compose up
- let docker do its magic
- now you got a full ManageMe working on your infrastructure.

To configure api and DBEngine settings:
just edit docker-compose.yml mysql password and change it in the following files:
- ./managemeSettings.js
- ./settings.py
- ./manageme-web-docker/src/utils/managemeSettings.js

and then execute:
- docker-compose down
- docker-compose build
- docker-compose up

and it will rebuild the whole software package using the configuration provided.

if you want a persistent mysql DB, avoid removing its container or seperate it from the software package, you can find DB initialization sql script in manageme-mysql-docker folder
