#!/bin/bash

#######################
# Error Handling Setup
#######################
# Exit on error
set -e

# Install CloudWatch Agent using region-specific URL
sudo wget https://amazoncloudwatch-agent-us-east-1.s3.us-east-1.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sudo rm ./amazon-cloudwatch-agent.deb

# Create CloudWatch Agent configuration directory
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc

# Enable CloudWatch Agent service to start on boot
sudo systemctl enable amazon-cloudwatch-agent