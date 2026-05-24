-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'KEPALA_BADAN', 'SEKRETARIS_BADAN', 'KABAG_UMUM_KEPEGAWAIAN', 'KEPALA_BIDANG', 'PEGAWAI') NOT NULL DEFAULT 'PEGAWAI',
    `pegawaiId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_pegawaiId_key`(`pegawaiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pegawai` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tempatLahir` VARCHAR(191) NULL,
    `tanggalLahir` DATETIME(3) NULL,
    `jenisKelamin` VARCHAR(191) NULL,
    `agama` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `noTelp` VARCHAR(191) NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `pangkat` VARCHAR(191) NULL,
    `golonganRuang` VARCHAR(191) NOT NULL,
    `tmtGolongan` DATETIME(3) NULL,
    `unitKerja` VARCHAR(191) NULL,
    `masaKerja` VARCHAR(191) NULL,
    `tglMasaKerja` DATETIME(3) NULL,
    `gajiPokok` INTEGER NULL,
    `tmtPangkat` DATETIME(3) NULL,
    `pendidikanAkhir` VARCHAR(191) NULL,
    `statusPegawai` VARCHAR(191) NOT NULL DEFAULT 'AKTIF',
    `fotoUrl` VARCHAR(191) NULL,
    `bidangId` VARCHAR(191) NULL,
    `dinasId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pegawai_nip_key`(`nip`),
    UNIQUE INDEX `Pegawai_dinasId_key`(`dinasId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuti` (
    `id` VARCHAR(191) NOT NULL,
    `pegawaiId` VARCHAR(191) NOT NULL,
    `jenisCuti` ENUM('TAHUNAN', 'SAKIT', 'MELAHIRKAN', 'BESAR', 'ALASAN_PENTING', 'LUAR_TANGGUNGAN_NEGARA') NOT NULL,
    `tanggalMulai` DATETIME(3) NOT NULL,
    `tanggalSelesai` DATETIME(3) NOT NULL,
    `jumlahHari` INTEGER NOT NULL,
    `durasiJenis` VARCHAR(191) NOT NULL DEFAULT 'HARI',
    `alasan` TEXT NOT NULL,
    `alamatSelama` TEXT NULL,
    `sisaCuti` INTEGER NULL,
    `status` ENUM('DRAFT', 'MENUNGGU_ATASAN_1', 'MENUNGGU_ATASAN_2', 'MENUNGGU_ADMIN', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'DRAFT',
    `nomorSurat` VARCHAR(191) NULL,
    `alasanPenolakan` TEXT NULL,
    `catatanAdmin` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KenaikanGajiBerkala` (
    `id` VARCHAR(191) NOT NULL,
    `pegawaiId` VARCHAR(191) NOT NULL,
    `gajiPokokSekarang` INTEGER NOT NULL,
    `tmtGajiSekarang` DATETIME(3) NOT NULL,
    `golonganSekarang` VARCHAR(191) NOT NULL,
    `tmtKGBDiusulkan` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'MENUNGGU_ATASAN_1', 'MENUNGGU_ATASAN_2', 'MENUNGGU_ADMIN', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'DRAFT',
    `nomorSurat` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KenaikanPangkat` (
    `id` VARCHAR(191) NOT NULL,
    `pegawaiId` VARCHAR(191) NOT NULL,
    `jabatanSekarang` VARCHAR(191) NOT NULL,
    `golonganSekarang` VARCHAR(191) NOT NULL,
    `tmtPangkatSekarang` DATETIME(3) NOT NULL,
    `usulPangkatKe` VARCHAR(191) NOT NULL,
    `jenisKenaikanPangkat` ENUM('REGULER', 'PILIHAN', 'ANUMERTA') NOT NULL,
    `status` ENUM('DRAFT', 'MENUNGGU_ATASAN_1', 'MENUNGGU_ATASAN_2', 'MENUNGGU_ADMIN', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'DRAFT',
    `nomorSurat` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bidangs` (
    `id` VARCHAR(191) NOT NULL,
    `nm` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `jab` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NULL,
    `idDin` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dinas` (
    `id` VARCHAR(191) NOT NULL,
    `nm` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_bidangId_fkey` FOREIGN KEY (`bidangId`) REFERENCES `Bidangs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_dinasId_fkey` FOREIGN KEY (`dinasId`) REFERENCES `Dinas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cuti` ADD CONSTRAINT `Cuti_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KenaikanGajiBerkala` ADD CONSTRAINT `KenaikanGajiBerkala_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KenaikanPangkat` ADD CONSTRAINT `KenaikanPangkat_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bidangs` ADD CONSTRAINT `Bidangs_idDin_fkey` FOREIGN KEY (`idDin`) REFERENCES `Dinas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
