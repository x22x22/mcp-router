import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple build script that copies necessary files
const distDir = path.join(__dirname, '../dist');
const publicDir = path.join(__dirname, '../public');

// Create dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy public directory to dist
const copyRecursive = (src, dest) => {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(
        path.join(src, entry),
        path.join(dest, entry)
      );
    }
  } else {
    fs.copyFileSync(src, dest);
  }
};

// Copy public folder
copyRecursive(publicDir, path.join(distDir, 'public'));

console.log('✓ Build completed successfully');
console.log('✓ Static files copied to dist/');
