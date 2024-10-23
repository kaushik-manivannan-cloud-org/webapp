#!/bin/bash

#######################
# Error Handling Setup
#######################
# Exit on error
set -e

#######################
# Directory Permissions
#######################
# Recursively change ownership of application directory and contents
# Changes both user and group to csye6225
sudo chown -R csye6225:csye6225 /opt/"${APP_NAME}"

#######################
# Environment Setup
#######################
# Create .env file as csye6225 user
# sudo -u: Execute command as specified user
sudo -u csye6225 touch /opt/"${APP_NAME}"/.env

# Set restrictive permissions on .env file
# 600: Owner can read/write, no permissions for group/others
sudo chmod 600 /opt/"${APP_NAME}"/.env

#######################
# Application Install
#######################
# Change to application directory
cd /opt/"${APP_NAME}"

# Install npm dependencies as service user
# ci: Clean install - uses package-lock.json
# --production: Only install production dependencies
sudo -u csye6225 npm ci --production

#######################
# Service Configuration
#######################
# Move service definition to systemd directory
# webapp.service contains service configuration
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

# Reload systemd to recognize new service
# daemon-reload: Reloads systemd manager configuration
sudo systemctl daemon-reload

# Enable service to start on boot
# enable: Creates symbolic links to start service automatically
sudo systemctl enable webapp.service

#######################
# Completion Message
#######################
# Indicate successful setup
echo 'Installation and setup completed successfully'