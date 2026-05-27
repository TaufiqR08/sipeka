import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.user.update({
    where: {
      email: 'kurniawan@gmail.com',
    },
    data: {
      role: 'SEKRETARIS_BADAN',
    },
  })
  console.log('Role updated successfully for kurniawan@gmail.com:', result.role)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
