const { execSync } = require('child_process');
const fs = require('fs');

try {
  const oldData = execSync('git show HEAD~1:lib/data.ts').toString();
  
  // Extract just the products array export
  const match = oldData.match(/export const products(.|\n)*?\]\n/);
  
  if (match) {
    fs.writeFileSync('./prisma/mockData.ts', match[0]);
    console.log("mockData.ts created successfully!");
  } else {
    // If regex fails, just write the whole thing and we can manually fix it
    fs.writeFileSync('./prisma/mockData.ts', oldData);
    console.log("mockData.ts created (full file)!");
  }
} catch (e) {
  console.error("Failed to get git data", e.message);
}
