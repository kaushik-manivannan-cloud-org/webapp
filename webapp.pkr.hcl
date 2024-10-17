packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-0866a3c8686eaeeba" // Ubuntu 24.04 LTS AMI ID
}

variable "instance_type" {
  type    = string
  default = "t2.small"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "app_name" {
  type    = string
  default = "webapp"
}

variable "demo_account_id" {
  type    = string
  default = "881490123305"
}

variable "db_username" {
  type    = string
  default = "kaushik"
}

variable "db_name" {
  type    = string
  default = "cloud_db"
}

variable "artifact_path" {
  type = string
  default = "application.zip"
}

source "amazon-ebs" "ubuntu" {
  region          = var.aws_region
  ami_name        = "csye6225-${var.app_name}-${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "Ubuntu AMI for CSYE 6225 Webapp"

  ami_regions = [
    "us-east-1"
  ]

  ami_users = [
    var.demo_account_id
  ]

  aws_polling {
    delay_seconds = 10
    max_attempts  = 50
  }

  instance_type = var.instance_type
  source_ami    = var.source_ami
  ssh_username  = "ubuntu"

  tags = {
    Name = "csye6225-${var.app_name}"
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
  }
}

build {
  name = "csye6225-packer"
  sources = [
    "source.amazon-ebs.ubuntu"
  ]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]

    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -",
      "sudo apt-get install -y nodejs",
      "sudo apt-get install -y postgresql postgresql-contrib",
      "sudo systemctl start postgresql",
      "sudo systemctl enable postgresql",
      // "sudo -u postgres createuser --superuser ${var.db_username}",
      // "sudo -u postgres createdb -O ${var.db_username} ${var.db_name}",
      "sudo -u postgres psql -c \"CREATE USER ${var.db_username} WITH SUPERUSER CREATEDB PASSWORD 'Kaumani12$#@';\"",
      "sudo groupadd csye6225",
      "sudo useradd -g csye6225 -m -s /usr/sbin/nologin csye6225",
      "sudo mkdir -p /opt/${var.app_name}",           # Create application directory
      "sudo chown ubuntu:ubuntu /opt/${var.app_name}" # Temporarily set ownership to ubuntu
    ]
  }

  provisioner "file" {
    source      = "${var.artifact_path}/"
    destination = "/opt/${var.app_name}"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    inline = [
      "set -e",                                               # Exit immediately if a command exits with a non-zero status
      "sudo chown -R csye6225:csye6225 /opt/${var.app_name}", # Set ownership of application files
      "cd /opt/${var.app_name}",
      "sudo -u csye6225 npm ci --production", # Install app dependencies as csye6225
      "sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp.service", # Enable the service on boot
      "sudo mkdir -p /opt/${var.app_name}/src/logs",
      "sudo chown -R csye6225:csye6225 /opt/${var.app_name}/src/logs",
      "sudo chmod 755 /opt/${var.app_name}/src/logs",
      "echo 'Installation and setup completed successfully'"
    ]
  }

  # Clean up
  provisioner "shell" {
    inline = [
      "sudo apt-get clean",
      "sudo rm -rf /var/lib/apt/lists/*"
    ]
  }
}