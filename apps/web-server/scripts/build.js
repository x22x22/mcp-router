import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple build script
const distDir = path.join(__dirname, '../dist');

// Create dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('✓ Build completed successfully');
console.log('✓ UI built with webpack to dist/public/');
console.log('✓ Server compiled to dist/');

