const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const sourceDir = path.join(rootDir, 'car', 'client', 'dist');
const outputDir = path.join(rootDir, 'dist');

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Client build output was not found: ${sourceDir}`);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.cpSync(sourceDir, outputDir, { recursive: true });

console.log(`Copied client build to ${outputDir}`);
