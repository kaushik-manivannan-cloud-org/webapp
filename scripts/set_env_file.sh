#!/bin/bash
set -e

# Create the environment file
sudo bash -c 'cat > /opt/webapp/.env' << 'EOL'
# Database Configuration
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
EOL

# Set proper permissions for the env file
sudo chown csye6225:csye6225 /opt/webapp/.env
sudo chmod 600 /opt/webapp/.env