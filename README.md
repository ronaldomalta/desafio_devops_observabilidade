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
```

---

# 📌 Progresso do Projeto

## ✅ 1. Pipeline de Integração Contínua — CI

Foi criada uma pipeline utilizando **GitHub Actions** para validar automaticamente o código enviado ao repositório.

### Build

Responsável por verificar se o projeto TypeScript compila corretamente.

Comando utilizado:

```bash
npm run build
```

### Lint & Quality

Utilizamos **ESLint + Prettier** para verificar qualidade e padronização do código.

```bash
npm run lint
```

A pasta `dist` é ignorada durante a análise, pois contém arquivos JavaScript gerados automaticamente durante o processo de build.

### Testes

Os testes automatizados são executados utilizando **Jest**.

```bash
npm test
```

### SAST

A pipeline possui uma etapa de análise de segurança para identificar vulnerabilidades nas dependências do projeto.

```bash
npm audit --audit-level=high
```

### Fluxo atual da CI

```text
Push / Pull Request
        │
        ├── Build
        ├── Lint & Quality
        ├── Tests
        └── SAST
```

Somente após as verificações serem concluídas com sucesso o processo de publicação da imagem Docker pode continuar.

---

## ✅ 2. Containerização — Docker

Foi criado um **Dockerfile** responsável por construir uma imagem da API.

A imagem utiliza:

```text
node:22-bookworm-slim
```

Também é instalado o **OpenSSL**, necessário para compatibilidade com o Prisma utilizado pela aplicação.

### Construção da imagem

```bash
docker build -t observabilidade-api .
```

### Execução do container

```bash
docker run --name observabilidade-api-container -p 3000:3000 observabilidade-api
```

A API fica disponível através da porta:

```text
3000
```

Quando executada corretamente:

```text
Server is running on port 3000
```

---

## ✅ 3. Docker Hub

A imagem da aplicação foi publicada no **Docker Hub**.

Imagem:

```text
ronaldomalta/observabilidade-api:latest
```

Para criar a tag:

```bash
docker tag observabilidade-api ronaldomalta/observabilidade-api:latest
```

Para publicar:

```bash
docker push ronaldomalta/observabilidade-api:latest
```

---

## ✅ 4. Docker na Pipeline

O GitHub Actions foi configurado para realizar automaticamente:

```text
Build
  ↓
Lint
  ↓
Tests
  ↓
SAST
  ↓
Docker Build
  ↓
Docker Hub
```

As credenciais do Docker Hub não ficam armazenadas diretamente no código.

Foram utilizados **GitHub Secrets**:

```text
DOCKER_USERNAME
DOCKER_TOKEN
```

Dessa forma, a pipeline consegue autenticar no Docker Hub sem expor informações sensíveis no repositório.

---

# ⏳ Próximas Etapas

## ⬜ 5. Terraform — Infrastructure as Code

Será utilizado **Terraform** para automatizar a criação da infraestrutura necessária para executar a aplicação.

Objetivo:

```text
Terraform
    ↓
AWS
    ↓
EC2
```

Etapas previstas:

* [ ] Criar estrutura Terraform
* [ ] Configurar provider AWS
* [ ] Criar Security Group
* [ ] Criar instância EC2
* [ ] Configurar portas necessárias
* [ ] Criar outputs
* [ ] Testar `terraform plan`
* [ ] Executar `terraform apply`
* [ ] Integrar Terraform ao GitHub Actions

---

## ⬜ 6. Deploy na EC2

Após a criação da infraestrutura, a aplicação deverá ser executada na instância EC2.

Fluxo planejado:

```text
Docker Hub
     ↓
AWS EC2
     ↓
docker pull
     ↓
docker run
     ↓
API em produção
```

Etapas:

* [ ] Acessar a EC2
* [ ] Instalar/configurar Docker
* [ ] Baixar imagem do Docker Hub
* [ ] Executar container
* [ ] Testar API externamente
* [ ] Automatizar deploy pela pipeline

---

## ⬜ 7. Observabilidade

A aplicação será monitorada utilizando:

### Prometheus

Responsável pela **coleta e armazenamento das métricas** da aplicação.

```text
API
 ↓
Prometheus
```

### Grafana

Responsável pela **visualização das métricas coletadas**.

```text
API
     ↓
Prometheus
     ↓
Grafana
     ↓
Dashboard
```

Etapas:

* [ ] Adicionar métricas à API
* [ ] Criar endpoint de métricas
* [ ] Configurar Prometheus
* [ ] Conectar Prometheus à aplicação
* [ ] Configurar Grafana
* [ ] Adicionar Prometheus como Data Source
* [ ] Criar dashboard
* [ ] Exibir pelo menos uma métrica real
* [ ] Testar métricas em tempo real

---

# 🛠️ Tecnologias Utilizadas

| Tecnologia     | Utilização                       |
| -------------- | -------------------------------- |
| Node.js        | Runtime da aplicação             |
| TypeScript     | Desenvolvimento da API           |
| Express        | API HTTP                         |
| Prisma         | Acesso e gerenciamento dos dados |
| Jest           | Testes automatizados             |
| ESLint         | Qualidade do código              |
| Prettier       | Padronização                     |
| Git            | Controle de versão               |
| GitHub         | Repositório                      |
| GitHub Actions | CI/CD                            |
| Docker         | Containerização                  |
| Docker Hub     | Registro das imagens             |
| Terraform      | Infraestrutura como código       |
| AWS EC2        | Hospedagem da aplicação          |
| Prometheus     | Coleta de métricas               |
| Grafana        | Dashboards e visualização        |

---

# 🔄 Pipeline Final Planejada

Ao final do projeto, o fluxo completo deverá funcionar da seguinte maneira:

```text
Código
  ↓
GitHub
  ↓
GitHub Actions
  │
  ├── SAST
  ├── Build
  ├── Lint
  └── Tests
  ↓
Docker Build
  ↓
Docker Hub
  ↓
Terraform
  ↓
AWS EC2
  ↓
Deploy
  ↓
Prometheus
  ↓
Grafana
```

---

# 📊 Status

```text
CI                    ██████████ 100% ✅
Docker                ██████████ 100% ✅
Docker Hub            ██████████ 100% ✅
Docker Pipeline       ██████████ 100% ✅
Terraform             ░░░░░░░░░░   0% ⏳
AWS EC2               ░░░░░░░░░░   0% ⏳
Deploy                ░░░░░░░░░░   0% ⏳
Prometheus            ░░░░░░░░░░   0% ⏳
Grafana               ░░░░░░░░░░   0% ⏳
```

> Esta documentação será atualizada conforme o desenvolvimento e a implementação das próximas etapas do desafio.
