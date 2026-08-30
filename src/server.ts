import express, { NextFunction, Request, Response } from 'express';
import client from 'prom-client';
import { routes } from './routes/index.routes';

const app = express();

app.use(express.json());

// ==============================
// PROMETHEUS
// ==============================

// Coleta métricas padrão do Node.js,
// como memória, CPU e event loop.
client.collectDefaultMetrics();

// Contador de requisições HTTP
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisicoes HTTP recebidas pela API',
  labelNames: ['method', 'route', 'status_code'],
});

// Tempo de duração das requisições
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duracao das requisicoes HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Middleware para registrar as requisições
app.use((req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const route = req.path;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    });

    end({
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    });
  });

  next();
});

// ==============================
// ROTAS DE MONITORAMENTO
// ==============================

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'API de Observabilidade funcionando!',
  });
});

// Endpoint utilizado pelo Prometheus
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', client.register.contentType);

    return res.end(await client.register.metrics());
  } catch (error: unknown) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro ao gerar metricas',
    });
  }
});

// ==============================
// ROTAS DA API
// ==============================

app.use(routes);

// ==============================
// SERVIDOR
// ==============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});
