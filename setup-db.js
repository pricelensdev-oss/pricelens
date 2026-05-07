const { execSync } = require('child_process');

console.log("Generating Prisma Client...");
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log("✅ Prisma Client generated successfully!");
} catch (e) {
  console.error("❌ Failed to generate Prisma Client.");
  process.exit(1);
}

console.log("\nSeeding Database...");
try {
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log("✅ Database seeded successfully!");
} catch (e) {
  console.error("❌ Failed to seed database.");
  process.exit(1);
}

console.log("\nEverything is ready! You can now run: npm run dev");
