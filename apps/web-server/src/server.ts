import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
// In development: dist/public (built), in production: dist/public
const publicPath = path.join(__dirname, '../dist/public');
  
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
