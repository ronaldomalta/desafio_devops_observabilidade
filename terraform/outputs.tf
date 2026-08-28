output "ec2_public_ip" {
  description = "IP publico da instancia EC2 criada"
  value       = aws_instance.app_server.public_ip
}

output "ec2_instance_id" {
  description = "ID da instancia EC2"
  value       = aws_instance.app_server.id
}

output "ssh_connection_command" {
  description = "Comando de conexao SSH rapido"
  value       = "ssh ubuntu@${aws_instance.app_server.public_ip}"
}
