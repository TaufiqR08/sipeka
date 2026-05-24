/*
  Warnings:

  - You are about to drop the column `isRead` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notification` table. All the data in the column will be lost.
  - Added the required column `cutiId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idLaya` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pegawaiId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `isRead`,
    DROP COLUMN `link`,
    DROP COLUMN `userId`,
    ADD COLUMN `cutiId` VARCHAR(191) NOT NULL,
    ADD COLUMN `idLaya` VARCHAR(191) NOT NULL,
    ADD COLUMN `info` VARCHAR(191) NOT NULL,
    ADD COLUMN `pegawaiId` VARCHAR(191) NOT NULL,
    ADD COLUMN `send` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sumber` ENUM('CUTI', 'KGB', 'KP') NOT NULL DEFAULT 'CUTI';

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_cutiId_fkey` FOREIGN KEY (`cutiId`) REFERENCES `Cuti`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_idLaya_fkey` FOREIGN KEY (`idLaya`) REFERENCES `Layanan`(`idLaya`) ON DELETE RESTRICT ON UPDATE CASCADE;
