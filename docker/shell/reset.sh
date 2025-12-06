#Clean all images and container of this project

#!/bin/bash
# Delete all containers
docker rm c_$1_apache
docker rm c_$1_mariadb
docker rm c_$1_phpmyadmin

# Delete all images
docker rmi i_$1_apache
docker rmi i_$1_mariadb