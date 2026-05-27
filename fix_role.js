const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    include: {
      pegawai: true
    }
  });
  const arie = users.find(u => u.pegawai?.nama?.includes('Arie'));
  
  if (arie) {
    console.log('Found Arie:', arie.email, arie.role);
    const result = await prisma.user.update({
      where: { id: arie.id },
      data: { role: 'SEKRETARIS_BADAN' }
    });
    console.log('Updated to:', result.role);
  } else {
    console.log('Arie not found in users table.');
    console.log('Available users:', users.map(u => u.email + ' (' + u.pegawai?.nama + ')'));
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
