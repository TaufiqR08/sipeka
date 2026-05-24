/*
  Warnings:

  - You are about to drop the column `dinasId` on the `pegawai` table. All the data in the column will be lost.
  - You are about to drop the `bidangs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tt` to the `Cuti` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bidangs` DROP FOREIGN KEY `Bidangs_idDin_fkey`;

-- DropForeignKey
ALTER TABLE `pegawai` DROP FOREIGN KEY `Pegawai_bidangId_fkey`;

-- DropForeignKey
ALTER TABLE `pegawai` DROP FOREIGN KEY `Pegawai_dinasId_fkey`;

-- DropIndex
DROP INDEX `Pegawai_dinasId_key` ON `pegawai`;

-- AlterTable
ALTER TABLE `cuti` ADD COLUMN `tt` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `dinas` ADD COLUMN `pimpinanId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pegawai` DROP COLUMN `dinasId`;

-- DropTable
DROP TABLE `bidangs`;

-- CreateTable
CREATE TABLE `Bidang` (
    `id` VARCHAR(191) NOT NULL,
    `nm` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `jab` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NULL,
    `dinasId` VARCHAR(191) NOT NULL,
    `pimpinanId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_bidangId_fkey` FOREIGN KEY (`bidangId`) REFERENCES `Bidang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bidang` ADD CONSTRAINT `Bidang_dinasId_fkey` FOREIGN KEY (`dinasId`) REFERENCES `Dinas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bidang` ADD CONSTRAINT `Bidang_pimpinanId_fkey` FOREIGN KEY (`pimpinanId`) REFERENCES `Pegawai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dinas` ADD CONSTRAINT `Dinas_pimpinanId_fkey` FOREIGN KEY (`pimpinanId`) REFERENCES `Pegawai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
