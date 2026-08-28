terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "teste"
  secret_key                  = "teste"
  
  # As 3 linhas abaixo impedem o Terraform de bater na AWS real para validar a conta
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true

  # Nota: Se a sua atividade exige o uso do LocalStack, 
  # você precisará adicionar o bloco de endpoints abaixo:
  # endpoints {
  #   s3       = "http://localhost:4566"
  #   dynamodb = "http://localhost:4566"
  # }
}
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-sg"
  description = "Regras de entrada e saida para a API e observabilidade"

  ingress {
    description = "Acesso SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Porta padrao HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Porta da API"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Prometheus"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

resource "aws_instance" "app_server" {
  ami = "ami-0c7217cdde317cfec" # ID de exemplo de um Ubuntu na us-east-1
  instance_type          = var.instance_type
  key_name               = var.key_name != "" ? var.key_name : null
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  user_data              = file("${path.module}/user_data.sh")

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  tags = {
    Name        = "${var.project_name}-ec2"
    Environment = "production"
  }
}
