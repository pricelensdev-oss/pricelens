const { execSync } = require('child_process');
const fs = require('fs');

console.log("1. Downgrading to Prisma v6 for stability...");
try {
  execSync('npm install prisma@^6.0.0 @prisma/client@^6.0.0 -D', { stdio: 'inherit' });
} catch (e) {
  console.error("Failed to install Prisma v6.");
  process.exit(1);
}

console.log("\n2. Fixing schema.prisma for Prisma v6...");
let schema = fs.readFileSync('./prisma/schema.prisma', 'utf-8');
schema = schema.replace(
  /datasource db \{\n  provider = "sqlite"\n\}/,
  `datasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}`
);
fs.writeFileSync('./prisma/schema.prisma', schema);

console.log("\n3. Extracting original mock data from git...");
try {
  const oldData = execSync('git show HEAD~1:lib/data.ts').toString();
  const match = oldData.match(/export const products(.|\n)*?\]\n/);
  if (match) {
    fs.writeFileSync('./prisma/mockData.ts', match[0]);
    console.log("mockData.ts created successfully!");
  } else {
    fs.writeFileSync('./prisma/mockData.ts', oldData);
  }
} catch (e) {
  console.error("Failed to get git data", e.message);
}

console.log("\n4. Fixing seed script...");
let seed = fs.readFileSync('./prisma/seed.ts', 'utf-8');
seed = seed.replace("import { products } from '../lib/data'", "import { products } from './mockData'");
fs.writeFileSync('./prisma/seed.ts', seed);

console.log("\n5. Running Prisma commands...");
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log("✅ Everything is fixed and seeded!");
} catch (e) {
  console.error("❌ Failed Prisma commands.", e.message);
  process.exit(1);
}
