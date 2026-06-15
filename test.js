const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      pegawai: {
        select: { nama: true, nip: true },
      },
    },
  })
  .then(console.log)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
