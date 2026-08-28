variable "aws_region" {
  description = "Região da AWS onde os recursos serão criados"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "Tipo da instância EC2 (nível gratuito / Free Tier)"
  type        = string
  default     = "t2.micro"
}

variable "project_name" {
  description = "Nome do projeto para identificação e tags"
  type        = string
  default     = "fap-devops-api"
}

variable "key_name" {
  description = "Nome da Key Pair SSH já cadastrada na AWS (opcional)"
  type        = string
  default     = ""
}
