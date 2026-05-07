const fs = require('fs');
const path = require('path');

const fileToDelete = path.join(__dirname, 'prisma.config.ts');

if (fs.existsSync(fileToDelete)) {
  try {
    fs.unlinkSync(fileToDelete);
    console.log("✅ prisma.config.ts deleted successfully!");
  } catch (e) {
    console.error("❌ Failed to delete:", e.message);
  }
} else {
  console.log("ℹ️ prisma.config.ts not found, maybe already deleted.");
}
