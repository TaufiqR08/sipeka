-- AlterTable
ALTER TABLE `notification` MODIFY `sumber` ENUM('CUTI', 'KGB', 'KP', 'BRIDA') NOT NULL DEFAULT 'CUTI';
