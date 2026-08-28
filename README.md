# 🚀 Desafio DevOps — FAP

Projeto desenvolvido como parte do **Desafio Prático de DevOps da FAP — Programa de Formação Aponti**.

O objetivo do projeto é aplicar conceitos de **Integração Contínua (CI), Entrega Contínua (CD), containerização, infraestrutura como código e observabilidade**, construindo um fluxo completo desde a validação do código até o monitoramento da aplicação em produção.

---

## 🏗️ Arquitetura do Projeto

O fluxo planejado para o projeto é:

```text
Desenvolvedor
     │
     ▼
  GitHub
     │
     ▼
GitHub Actions
     │
     ├── Build
     ├── Lint & Quality
     ├── Tests
     └── SAST
     │
     ▼
Docker Build
     │
     ▼
Docker Hub
     │
     ▼
Terraform
     │
     ▼
AWS EC2
     │
     ▼
Deploy da API
     │
     ├── Prometheus
     │
     ▼
  Grafana