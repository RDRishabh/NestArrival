const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, '../prisma');
const srcPath = path.join(__dirname, '../../backend/prisma/schema.prisma');
const destPath = path.join(destDir, 'schema.prisma');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcPath, destPath);
console.log('Copied backend schema to frontend/prisma/schema.prisma');
