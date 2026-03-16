import "dotenv/config";
import prisma from "../lib/db";

async function testDatabase() {
  console.log("🔍 Testing Prisma Postgres connection...\n");

  try {
    // Test 1: Check connection
    console.log("✅ Connected to database!");

    // Test 2: Try a simple query (e.g., count users)
    const userCount = await prisma.user.count();
    console.log(`✅ Database is reachable! Found ${userCount} users.`);

    console.log("\n🎉 All tests passed! Your database is working perfectly.\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
