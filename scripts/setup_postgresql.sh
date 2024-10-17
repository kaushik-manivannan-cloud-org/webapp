#!/bin/bash
set -e

# Use environment variables directly
sudo -u postgres psql -c "CREATE USER ${DB_USERNAME} WITH SUPERUSER CREATEDB PASSWORD '${DB_USERNAME}';"
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USERNAME};"