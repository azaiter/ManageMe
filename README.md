![ManageMe](https://i.imgur.com/5IK9Vb6.png)

# ManageMe

Software Engineering & Mobile Computing Project

A continuation of the final Capstone project for Bachelors in Computer Science at Saginaw Valley State University

ManageMe is a project management software package that aims to help small to medium-sized businesses manage teams of developers and track the expense of new features and bug fixes. It will also contribute to prioritizing what should be worked on first when resources are limited.

## This repository contains 7 different components and applications:
- Complete: Comprehensive React Native (iOS and Android) application (under `./mobile` directory).
- Complete: Comprehensive React web application (under `./new-web`).
- Complete: For each corresponding application folder, it contains docker containers definition for easier microservice install.
- Complete: Application database changes loop handler that takes care of user notifications (under `./notifier` directory).
- Complete: React-native (iOS and Android) minimal functionality application for clocking in and out.
- Complete: Java Application of the Software that serves the React application
- Incomplete: Native C# application for windows


### Dockerized ManageMe software package includes:
- ManageMe API with DBEngine container
- ManageMe preconfiged MySQL database container
- ManageMe Notification background service
- ManageMe Web interface
- Adminer to manage the MySQL database using a gui


### To install the (React Web + All Backend components) do the following:
- Install Docker package
- Unzip the file
- cd into the folder where docker-compose.yml is located:
- run docker-compose up
- let docker do its magic
- now you got a full ManageMe working on your infrastructure.

#### To configure api and DBEngine settings:
Just edit docker-compose.yml mysql password and change it in the following files:
- `./managemeSettings.js`
- `./settings.py`
- `./manageme-web-docker/src/utils/managemeSettings.js`
- And then execute:
```bash
docker-compose down
docker-compose build
docker-compose up
```
And it will rebuild the whole software package using the configuration provided.

If you want a persistent mysql DB, avoid removing its container or seperate it from the software package, you can find DB initialization sql script in manageme-mysql-docker folder
