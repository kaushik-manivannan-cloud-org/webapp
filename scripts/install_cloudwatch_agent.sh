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

# Create the configuration file that will be baked into the AMI
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOL'
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "csye6225"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/tmp/logs/app.log",
            "log_group_name": "/webapp/app.log",
            "log_stream_name": "{instance_id}",
            "encoding": "utf-8"
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "WebApp",
    "metrics_collected": {
      "statsd": {
        "service_address": ":8125",
        "metrics_collection_interval": 10,
        "metrics_aggregation_interval": 60
      },
      "collectd": {
        "metrics_aggregation_interval": 60
      }
    }
  }
}
EOL

# Enable CloudWatch Agent service to start on boot
sudo systemctl enable amazon-cloudwatch-agent