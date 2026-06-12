const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://8d61543a4b8a60daac78f7049a099a9adbd59840e46e8d45ec6a29346738e038:sk_g3rpoR7ieov3I8c3TUKmo@pooled.db.prisma.io:5432/postgres?sslmode=verify-full"
    }
  }
});

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
      verificationStatus: true,
      isBanned: true
    }
  });
  console.log("Registered Users:", JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
