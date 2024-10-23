#!/bin/bash
set -e

# Create the environment file
sudo touch /opt/webapp/.env

# Set proper permissions for the env file
sudo chown csye6225:csye6225 /opt/webapp/.env
sudo chmod 600 /opt/webapp/.env