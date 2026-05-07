import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function cleanup() {
  console.log("🧹 Starting database cleanup of mock discovery items...")
  
  const result = await prisma.product.deleteMany({
    where: {
      OR: [
        { name: { contains: "s26 ulta" } },
        { name: { contains: "Ultra 5G" } },
        { name: { contains: "Air Edition" } },
        { name: { contains: "Lite" } }
      ]
    }
  })

  console.log(`✅ Cleanup complete. Deleted ${result.count} mock items.`)
  await prisma.$disconnect()
}

cleanup()
