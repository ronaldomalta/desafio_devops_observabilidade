# ==============================================================================
# CONFIGURAÇÕES DE PROVEDORES E VERSÕES
# ==============================================================================
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configuração da região da AWS. 
# 💡 ONDE ALTERAR: Se mudar a região (ex: sa-east-1 para São Paulo), altere no arquivo 'terraform.tfvars'.
provider "aws" {
  region = var.aws_region
}

# ==============================================================================
# BUSCA DINÂMICA DE AMI (IMAGEM DO SISTEMA OPERACIONAL)
# ==============================================================================
# Busca automaticamente a AMI do Ubuntu 22.04 LTS mais recente na região selecionada.
# 💡 ONDE ALTERAR: Altere os filtros abaixo se precisar mudar a versão do SO (ex: Ubuntu 24.04 ou Debian).
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Proprietária do Ubuntu)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ==============================================================================
# REGRAS DE SEGURANÇA (SECURITY GROUP / FIREWALL)
# ==============================================================================
# Define as portas que ficarão abertas para acesso externo na EC2.
# 💡 ONDE ALTERAR: Adicione ou remova blocos 'ingress' para liberar/bloquear novas portas no servidor.
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-sg"
  description = "Regras de entrada e saida para a API e observabilidade"

  # Porta 22: Permite acesso remoto SSH
  ingress {
    description = "Acesso SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Porta 80: Tráfego Web padrão (HTTP)
  ingress {
    description = "Porta padrao HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Porta 3000: Porta de execução da API Node.js / Express
  ingress {
    description = "Porta da API"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Porta 9090: Porta do servidor de métricas Prometheus
  ingress {
    description = "Prometheus"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Permite todo o tráfego de saída da EC2 para a internet
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

# ==============================================================================
# PROVISIONAMENTO DA MÁQUINA VIRTUAL (EC2)
# ==============================================================================
resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.ubuntu.id # Usa a AMI encontrada no bloco 'data'
  instance_type          = var.instance_type      # 💡 ONDE ALTERAR: Mude 'instance_type' no arquivo 'terraform.tfvars' (ex: t3.micro / t2.micro)
  key_name               = var.key_name != "" ? var.key_name : null # 💡 ONDE ALTERAR: Mude 'key_name' no 'terraform.tfvars' se mudar o nome da chave .pem
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  # Executa o script de inicialização para instalar o Docker na primeira subida
  # 💡 ONDE ALTERAR: Se quiser alterar o script de automação, edite o arquivo 'user_data.sh'
  user_data              = file("${path.module}/user_data.sh")

  # Configuração do Disco Rígido (EBS)
  # 💡 ONDE ALTERAR: Modifique 'volume_size' se precisar de mais espaço em disco (em GB).
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