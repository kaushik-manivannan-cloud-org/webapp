#!/bin/bash

#######################
# Error Handling Setup
#######################
# Exit on error
set -e

#######################
# Environment Setup
#######################
# Prevent interactive prompts during package installation
export DEBIAN_FRONTEND=noninteractive

# Disable Hashicorp version checking
export CHECKPOINT_DISABLE=1

#######################
# System Updates
#######################
# Update package lists
sudo apt-get update

# Upgrade existing packages
sudo apt-get upgrade -y

#######################
# Node.js Installation
#######################
# Add NodeSource repository for Node.js 22.x
# Download and execute setup script
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js and npm packages
sudo apt-get install -y nodejs

# Install jq for JSON parsing
sudo apt-get install -y jq

# Install CollectD
sudo apt-get install -y collectd

# Start and enable services
sudo systemctl start collectd
sudo systemctl enable collectd