const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pegawais2 = await prisma.pegawai.findMany();
    const nips2 = new Set();
    const toDelete2 = [];
    
    for (const p of pegawais2) {
        if (nips2.has(p.nip)) {
            console.log("Duplicate NIP found in Pegawai:", p.nip, "ID:", p.id);
            toDelete2.push(p.id);
        } else {
            nips2.add(p.nip);
        }
    }
    
    for (const id of toDelete2) {
        await prisma.pegawai.delete({ where: { id } });
        console.log("Deleted duplicate id in Pegawai:", id);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
