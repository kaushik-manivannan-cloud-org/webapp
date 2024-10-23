#!/bin/bash
set -e

# Set ownership for the application directory
sudo chown -R csye6225:csye6225 /opt/"${APP_NAME}"

# Create and set permissions for .env file
sudo -u csye6225 touch /opt/"${APP_NAME}"/.env
sudo chmod 600 /opt/"${APP_NAME}"/.env

# Install the application dependencies
cd /opt/"${APP_NAME}"
sudo -u csye6225 npm ci --production

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl daemon-reload
sudo systemctl enable webapp.service

echo 'Installation and setup completed successfully'