#!/bin/bash
set -e

sudo chown -R csye6225:csye6225 /opt/"${APP_NAME}"
cd /opt/"${APP_NAME}"
sudo -u csye6225 npm ci --production
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl daemon-reload
sudo systemctl enable webapp.service

echo 'Installation and setup completed successfully'