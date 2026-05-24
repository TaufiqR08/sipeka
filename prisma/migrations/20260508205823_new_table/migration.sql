/*
  Warnings:

  - You are about to drop the `kenaikangajiberkala` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kenaikanpangkat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kenaikangajiberkala` DROP FOREIGN KEY `KenaikanGajiBerkala_pegawaiId_fkey`;

-- DropForeignKey
ALTER TABLE `kenaikanpangkat` DROP FOREIGN KEY `KenaikanPangkat_pegawaiId_fkey`;

-- DropTable
DROP TABLE `kenaikangajiberkala`;

-- DropTable
DROP TABLE `kenaikanpangkat`;

-- CreateTable
CREATE TABLE `KategoriDokumen` (
    `idKate` VARCHAR(191) NOT NULL,
    `nmKate` VARCHAR(191) NOT NULL,
    `ket` VARCHAR(191) NULL,

    PRIMARY KEY (`idKate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DaftarDokumen` (
    `idDaft` VARCHAR(191) NOT NULL,
    `idKate` VARCHAR(191) NOT NULL,
    `nmDaft` VARCHAR(191) NOT NULL,
    `ketDaft` VARCHAR(191) NULL,

    PRIMARY KEY (`idDaft`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Layanan` (
    `idLaya` VARCHAR(191) NOT NULL,
    `pimpinanId` VARCHAR(191) NULL,
    `idKate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idLaya`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListDokumen` (
    `id` VARCHAR(191) NOT NULL,
    `idLaya` VARCHAR(191) NOT NULL,
    `idDaft` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` ENUM('DISETUJUI', 'REVISI', 'DITOLAK', 'DIPROSES') NOT NULL DEFAULT 'DIPROSES',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DaftarDokumen` ADD CONSTRAINT `DaftarDokumen_idKate_fkey` FOREIGN KEY (`idKate`) REFERENCES `KategoriDokumen`(`idKate`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Layanan` ADD CONSTRAINT `Layanan_pimpinanId_fkey` FOREIGN KEY (`pimpinanId`) REFERENCES `Pegawai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Layanan` ADD CONSTRAINT `Layanan_idKate_fkey` FOREIGN KEY (`idKate`) REFERENCES `KategoriDokumen`(`idKate`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListDokumen` ADD CONSTRAINT `ListDokumen_idLaya_fkey` FOREIGN KEY (`idLaya`) REFERENCES `Layanan`(`idLaya`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListDokumen` ADD CONSTRAINT `ListDokumen_idDaft_fkey` FOREIGN KEY (`idDaft`) REFERENCES `DaftarDokumen`(`idDaft`) ON DELETE CASCADE ON UPDATE CASCADE;
