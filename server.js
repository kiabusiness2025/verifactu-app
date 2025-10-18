import express from 'express';

const app = express();
app.use(express.json({ limit: '10mb' })); // soporta JSON

const PORT = process.env.PORT || 8080;

// --- Rutas de salud añadidas ---
app.get('/api/version', (_req, res) => {
  res.json({ ok: true, service: 'verifactu-backend', version: '1.0.0' });
});

app.get('/health', (_req, res) => {
  res.type('text/plain').send('ok');
});
// ------------------------------------

// Ruta raíz actualizada para simular el backend
app.get('/', (_req, res) => {
  res.type('text').send('backend OK');
});
app.listen(PORT, '0.0.0.0', () => console.log(`backend on :${PORT}`));