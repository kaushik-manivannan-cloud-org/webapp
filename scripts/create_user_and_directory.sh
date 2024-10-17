#!/bin/bash
set -e

sudo groupadd csye6225
sudo useradd -g csye6225 -m -s /usr/sbin/nologin csye6225
sudo mkdir -p /opt/"${APP_NAME}"
sudo chown ubuntu:ubuntu /opt/"${APP_NAME}"