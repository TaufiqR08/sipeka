-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_cutiId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_idLaya_fkey`;

-- AlterTable
ALTER TABLE `notification` MODIFY `cutiId` VARCHAR(191) NULL,
    MODIFY `idLaya` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_cutiId_fkey` FOREIGN KEY (`cutiId`) REFERENCES `Cuti`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_idLaya_fkey` FOREIGN KEY (`idLaya`) REFERENCES `Layanan`(`idLaya`) ON DELETE SET NULL ON UPDATE CASCADE;
