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

variable "db_name" {
  type    = string
  default = "cloud_db"
}

variable "artifact_path" {
  type    = string
  default = "." # Default to current directory
}

variable "vpc_id" {
  type    = string
  default = "vpc-0398bf5ad5852d51d"
}

variable "subnet_id" {
  type    = string
  default = "subnet-015e51ff42a7244b6"
}

source "amazon-ebs" "ubuntu" {
  region          = var.aws_region
  ami_name        = "csye6225-${var.app_name}-${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "Ubuntu AMI for CSYE 6225 Webapp"
  vpc_id          = var.vpc_id
  subnet_id       = var.subnet_id

  ami_regions = [
    var.aws_region
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
  ssh_username  = var.ssh_username

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
    script = "scripts/update_and_install.sh"
  }

  provisioner "shell" {
    script = "scripts/setup_postgresql.sh"
    environment_vars = [
      "DB_USERNAME=${var.db_username}",
      "DB_NAME=${var.db_name}"
    ]
  }

  provisioner "shell" {
    script = "scripts/create_user_and_directory.sh"
    environment_vars = [
      "APP_NAME=${var.app_name}"
    ]
  }

  provisioner "file" {
    source      = "${var.artifact_path}/"
    destination = "/opt/${var.app_name}"
  }

  provisioner "file" {
    source      = "${var.artifact_path}/webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    script = "scripts/setup_application.sh"
    environment_vars = [
      "APP_NAME=${var.app_name}"
    ]
  }

  provisioner "shell" {
    script = "scripts/cleanup.sh"
  }
}
