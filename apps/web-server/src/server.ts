import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
// In development: src/../public, in production: dist/public
const isDev = process.env.NODE_ENV !== 'production';
const publicPath = isDev 
  ? path.join(__dirname, '../public')
  : path.join(__dirname, 'public');
  
console.log('Public path:', publicPath);
app.use(express.static(publicPath));

// API routes (placeholder - will be extended)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'MCP Router Web Server is running' });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MCP Router Web Server is running on http://localhost:${PORT}`);
  console.log(`Access the UI at: http://localhost:${PORT}`);
});
