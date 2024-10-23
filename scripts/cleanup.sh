#!/bin/bash

#######################
# Error Handling Setup
#######################
# Exit on error
set -e

#######################
# Cleanup Operations
#######################
# Clean up package manager cache
# Removes downloaded package files (.deb) from /var/cache/apt/archives/
sudo apt-get clean

# Remove package lists
# Deletes all package lists downloaded from repositories
# This frees up space and removes unnecessary files
sudo rm -rf /var/lib/apt/lists/*