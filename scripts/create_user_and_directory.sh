#!/bin/bash

#######################
# Error Handling Setup
#######################
# Exit on error
set -e

#######################
# Group Setup
#######################
# Create a new system group for application management
sudo groupadd csye6225

#######################
# User Setup
#######################
# Create a new system user with restricted access
# useradd: Creates a new system user 'csye6225'
# -g: Assigns user to the csye6225 group
# -m: Creates home directory
# -s: Sets login shell to nologin (prevents interactive login)
sudo useradd -g csye6225 -m -s /usr/sbin/nologin csye6225

#######################
# Directory Setup
#######################
# Create application directory in /opt
sudo mkdir -p /opt/"${APP_NAME}"

#######################
# Permission Setup
#######################
# Set proper ownership for application directory
# chown: Changes owner and group
# ubuntu:ubuntu: Sets both owner and group to 'ubuntu' user
sudo chown ubuntu:ubuntu /opt/"${APP_NAME}"