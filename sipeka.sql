-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table simpeg_kesbangpol.bidang
CREATE TABLE IF NOT EXISTS `bidang` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nm` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jab` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dinasId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pimpinanId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Bidang_dinasId_fkey` (`dinasId`),
  KEY `Bidang_pimpinanId_fkey` (`pimpinanId`),
  CONSTRAINT `Bidang_dinasId_fkey` FOREIGN KEY (`dinasId`) REFERENCES `dinas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Bidang_pimpinanId_fkey` FOREIGN KEY (`pimpinanId`) REFERENCES `pegawai` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.bidang: ~4 rows (approximately)
INSERT INTO `bidang` (`id`, `nm`, `jabatan`, `jab`, `img`, `dinasId`, `pimpinanId`, `createdAt`, `updatedAt`) VALUES
	('11111111-3a71-4fcd-ad4a-c19d3f1c2121', 'Bidang Ideologi', 'Kepala Bidang Ideologi', 'Kabid Ideologi', NULL, '8.01.0.00.0.00.01.0000', '848d5ccd-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-08 13:55:29.857', '2026-05-08 21:06:14.870'),
	('22222222-3a71-4fcd-ad4a-c19d3f1c2121', 'Bidang Politik Dalam Negeri', 'Kepala Bidang Politik', 'Kabid Politik', NULL, '8.01.0.00.0.00.01.0000', '848d5ea2-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-08 13:55:29.902', '2026-05-08 21:06:14.876'),
	('33333333-3a71-4fcd-ad4a-c19d3f1c2121', 'Bidang Ketahanan Ekonomi', 'Kepala Bidang Ketahanan', 'Kabid Ketahanan', NULL, '8.01.0.00.0.00.01.0000', '848d5adf-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-08 13:55:29.957', '2026-05-08 21:06:14.881'),
	('78111549-3a71-4fcd-ad4a-c19d3f1c2121', 'Sekretariat Badan', 'Sekretariat Badan', 'Sekretaris', NULL, '8.01.0.00.0.00.01.0000', '848d57ec-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-08 13:55:29.809', '2026-05-08 21:06:14.940');

-- Dumping structure for table simpeg_kesbangpol.cuti
CREATE TABLE IF NOT EXISTS `cuti` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pegawaiId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenisCuti` enum('TAHUNAN','SAKIT','MELAHIRKAN','BESAR','ALASAN_PENTING','LUAR_TANGGUNGAN_NEGARA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggalMulai` datetime(3) NOT NULL,
  `tanggalSelesai` datetime(3) NOT NULL,
  `jumlahHari` int NOT NULL,
  `durasiJenis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HARI',
  `alasan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamatSelama` text COLLATE utf8mb4_unicode_ci,
  `sisaCuti` int DEFAULT NULL,
  `status` enum('DRAFT','MENUNGGU_ATASAN_1','DITOLAK_ATASAN_1','MENUNGGU_ATASAN_2','DITOLAK_ATASAN_2','MENUNGGU_ADMIN','DISETUJUI','DITOLAK') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `nomorSurat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alasanPenolakan` text COLLATE utf8mb4_unicode_ci,
  `catatanAdmin` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `tt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `filePendukungUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Cuti_pegawaiId_fkey` (`pegawaiId`),
  CONSTRAINT `Cuti_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `pegawai` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.cuti: ~1 rows (approximately)
INSERT INTO `cuti` (`id`, `pegawaiId`, `jenisCuti`, `tanggalMulai`, `tanggalSelesai`, `jumlahHari`, `durasiJenis`, `alasan`, `alamatSelama`, `sisaCuti`, `status`, `nomorSurat`, `alasanPenolakan`, `catatanAdmin`, `createdAt`, `updatedAt`, `tt`, `filePendukungUrl`) VALUES
	('cmp52witi000af94nci6hgbh2', '848d60a5-4f48-11f1-aa91-2c56dcb03c3b', 'TAHUNAN', '2026-05-15 00:00:00.000', '2026-05-15 00:00:00.000', 1, 'HARI', 'uji coba sipeka', 'tester penyusunan data', NULL, 'MENUNGGU_ATASAN_2', NULL, NULL, NULL, '2026-05-14 05:59:36.007', '2026-05-14 06:05:48.243', '{"userNama":"Hj. Mulaini, SP","userJabatan":"KASUBBAG UNGKEP & KEPEGAWAIAN ","userNip":"197208052014102002","atasan1Jabatan":"Sekretariat Badan Kesatuan Bangsa dan Politik","atasan1Nama":"M. Arie Kurniawan, ST.,M.M.Inov","atasan1Nip":"197906122011011010","atasan2Jabatan":"KEPALA BADAN Kesatuan Bangsa dan Politik","atasan2Nama":"Saifullah, S.IP","atasan2Nip":"196907261993031009","atasan1Status":"DISETUJUI","atasan1Penolakan":null}', '/uploads/cuti/1778738375988-FORM-CUTI.docx.pdf');

-- Dumping structure for table simpeg_kesbangpol.daftardokumen
CREATE TABLE IF NOT EXISTS `daftardokumen` (
  `idDaft` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idKate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nmDaft` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ketDaft` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idDaft`),
  KEY `DaftarDokumen_idKate_fkey` (`idKate`),
  CONSTRAINT `DaftarDokumen_idKate_fkey` FOREIGN KEY (`idKate`) REFERENCES `kategoridokumen` (`idKate`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.daftardokumen: ~13 rows (approximately)
INSERT INTO `daftardokumen` (`idDaft`, `idKate`, `nmDaft`, `ketDaft`) VALUES
	('KGB-SK Berkala Terakhir', 'KGB', 'SK Berkala Terakhir', NULL),
	('KGB-SK CPNS', 'KGB', 'SK CPNS', NULL),
	('KGB-SK Jabatan Terakhir', 'KGB', 'SK Jabatan Terakhir', NULL),
	('KGB-SK Pangkat Terakhir', 'KGB', 'SK Pangkat Terakhir', NULL),
	('KGB-SK PNS', 'KGB', 'SK PNS', NULL),
	('KGB-SKP 2 tahun terakhir', 'KGB', 'SKP 2 tahun terakhir', NULL),
	('KGB-Surat Pengantar', 'KGB', 'Surat Pengantar', NULL),
	('KP-SK CPNS', 'KP', 'SK CPNS', NULL),
	('KP-SK Jabatan Terakhir', 'KP', 'SK Jabatan Terakhir', NULL),
	('KP-SK Pangkat Terakhir', 'KP', 'SK Pangkat Terakhir', NULL),
	('KP-SK PNS', 'KP', 'SK PNS', NULL),
	('KP-SKP 2 tahun terakhir', 'KP', 'SKP 2 tahun terakhir', NULL),
	('KP-Surat Pengantar', 'KP', 'Surat Pengantar', NULL);

-- Dumping structure for table simpeg_kesbangpol.dinas
CREATE TABLE IF NOT EXISTS `dinas` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nm` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pimpinanId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Dinas_pimpinanId_fkey` (`pimpinanId`),
  CONSTRAINT `Dinas_pimpinanId_fkey` FOREIGN KEY (`pimpinanId`) REFERENCES `pegawai` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.dinas: ~0 rows (approximately)
INSERT INTO `dinas` (`id`, `nm`, `pimpinanId`) VALUES
	('8.01.0.00.0.00.01.0000', 'Kesatuan Bangsa dan Politik', '848d518c-4f48-11f1-aa91-2c56dcb03c3b');

-- Dumping structure for table simpeg_kesbangpol.kategoridokumen
CREATE TABLE IF NOT EXISTS `kategoridokumen` (
  `idKate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nmKate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ket` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idKate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.kategoridokumen: ~2 rows (approximately)
INSERT INTO `kategoridokumen` (`idKate`, `nmKate`, `ket`) VALUES
	('KGB', 'Kenaikan Gaji Berkala', 'Kelola pengajuan KGB dan upload dokumen pendukung'),
	('KP', 'Kenaikan Pangkat', 'Kelola pengajuan kenaikan pangkat dan dokumen pendukung');

-- Dumping structure for table simpeg_kesbangpol.layanan
CREATE TABLE IF NOT EXISTS `layanan` (
  `idLaya` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pimpinanId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idKate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`idLaya`),
  KEY `Layanan_pimpinanId_fkey` (`pimpinanId`),
  KEY `Layanan_idKate_fkey` (`idKate`),
  CONSTRAINT `Layanan_idKate_fkey` FOREIGN KEY (`idKate`) REFERENCES `kategoridokumen` (`idKate`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Layanan_pimpinanId_fkey` FOREIGN KEY (`pimpinanId`) REFERENCES `pegawai` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.layanan: ~1 rows (approximately)

-- Dumping structure for table simpeg_kesbangpol.listdokumen
CREATE TABLE IF NOT EXISTS `listdokumen` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idLaya` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idDaft` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DISETUJUI','REVISI','DITOLAK','DIPROSES') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DIPROSES',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ListDokumen_idLaya_fkey` (`idLaya`),
  KEY `ListDokumen_idDaft_fkey` (`idDaft`),
  CONSTRAINT `ListDokumen_idDaft_fkey` FOREIGN KEY (`idDaft`) REFERENCES `daftardokumen` (`idDaft`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ListDokumen_idLaya_fkey` FOREIGN KEY (`idLaya`) REFERENCES `layanan` (`idLaya`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.listdokumen: ~7 rows (approximately)

-- Dumping structure for table simpeg_kesbangpol.notification
CREATE TABLE IF NOT EXISTS `notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `cutiId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idLaya` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `info` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pegawaiId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `send` tinyint(1) NOT NULL DEFAULT '0',
  `sumber` enum('CUTI','KGB','KP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUTI',
  PRIMARY KEY (`id`),
  KEY `Notification_pegawaiId_fkey` (`pegawaiId`),
  KEY `Notification_cutiId_fkey` (`cutiId`),
  KEY `Notification_idLaya_fkey` (`idLaya`),
  CONSTRAINT `Notification_cutiId_fkey` FOREIGN KEY (`cutiId`) REFERENCES `cuti` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Notification_idLaya_fkey` FOREIGN KEY (`idLaya`) REFERENCES `layanan` (`idLaya`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Notification_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `pegawai` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.notification: ~5 rows (approximately)
INSERT INTO `notification` (`id`, `title`, `message`, `createdAt`, `cutiId`, `idLaya`, `info`, `pegawaiId`, `send`, `sumber`) VALUES
	('cmp52wits000bf94n2c0ji81h', 'Pengajuan Cuti, a.n Hj. Mulaini, SP', 'Yth. M. Arie Kurniawan, ST.,M.M.Inov selaku SEKRETARIS BADAN, kami mohon persetujuaannya, informasi lengkapnya ada di Aplikasi SIPEKA ', '2026-05-14 05:59:36.016', 'cmp52witi000af94nci6hgbh2', NULL, 'MENUNGGU_ATASAN_1', '848d57ec-4f48-11f1-aa91-2c56dcb03c3b', 1, 'CUTI'),
	('cmp534i1n000cf94nct3ra584', 'Pengajuan Cuti DISETUJUI, Oleh M. Arie Kurniawan, ST.,M.M.Inov', 'Selamat, informasi lengkapnya ada di Aplikasi SIPEKA ', '2026-05-14 06:05:48.252', 'cmp52witi000af94nci6hgbh2', NULL, 'MENUNGGU_ATASAN_2', '848d60a5-4f48-11f1-aa91-2c56dcb03c3b', 0, 'CUTI'),
	('cmp534i1q000df94nxgi4n2gi', 'Pengajuan Cuti, a.n Hj. Mulaini, SP', 'Yth. Saifullah, S.IP selaku KEPALA BADAN, kami mohon persetujuaannya, informasi lengkapnya ada di Aplikasi SIPEKA ', '2026-05-14 06:05:48.252', 'cmp52witi000af94nci6hgbh2', NULL, 'MENUNGGU_ATASAN_2 -', '848d518c-4f48-11f1-aa91-2c56dcb03c3b', 1, 'CUTI'),
	('cmp71i6uu0000jr3h2kthz2pf', 'Warning !!!', ' Batas pengajuan Kenaikan Gaji Berkala tersisa 60 hari lagi.', '2026-05-15 14:56:00.055', NULL, NULL, 'WARNING', '848d60a5-4f48-11f1-aa91-2c56dcb03c3b', 0, 'KGB');

-- Dumping structure for table simpeg_kesbangpol.pegawai
CREATE TABLE IF NOT EXISTS `pegawai` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempatLahir` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggalLahir` datetime(3) DEFAULT NULL,
  `jenisKelamin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agama` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noTelp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jabatan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pangkat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `golonganRuang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tmtGolongan` datetime(3) DEFAULT NULL,
  `unitKerja` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `masaKerja` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tglMasaKerja` datetime(3) DEFAULT NULL,
  `gajiPokok` int DEFAULT NULL,
  `tmtPangkat` datetime(3) DEFAULT NULL,
  `pendidikanAkhir` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusPegawai` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AKTIF',
  `fotoUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bidangId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Pegawai_nip_key` (`nip`),
  KEY `Pegawai_bidangId_fkey` (`bidangId`),
  CONSTRAINT `Pegawai_bidangId_fkey` FOREIGN KEY (`bidangId`) REFERENCES `bidang` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.pegawai: ~46 rows (approximately)
INSERT INTO `pegawai` (`id`, `nip`, `nama`, `tempatLahir`, `tanggalLahir`, `jenisKelamin`, `agama`, `alamat`, `noTelp`, `jabatan`, `pangkat`, `golonganRuang`, `tmtGolongan`, `unitKerja`, `masaKerja`, `tglMasaKerja`, `gajiPokok`, `tmtPangkat`, `pendidikanAkhir`, `statusPegawai`, `fotoUrl`, `bidangId`, `createdAt`, `updatedAt`) VALUES
	('37efe782-4f55-11f1-aa91-2c56dcb03c3b', '1', 'Amar Nurmansyah', NULL, NULL, NULL, NULL, NULL, NULL, 'BUPATI', NULL, '-', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AKTIF', NULL, NULL, '2026-05-14 12:24:45.000', '2026-05-14 12:24:45.000'),
	('37eff035-4f55-11f1-aa91-2c56dcb03c3b', '2', 'HJ', NULL, NULL, NULL, NULL, NULL, NULL, 'WAKIL BUPATI', NULL, '-', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AKTIF', NULL, NULL, '2026-05-14 12:24:45.000', '2026-05-14 12:24:45.000'),
	('37eff215-4f55-11f1-aa91-2c56dcb03c3b', '3', 'BKD', NULL, NULL, NULL, NULL, NULL, NULL, 'Kepala BKPSDM', NULL, '-', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AKTIF', NULL, NULL, '2026-05-14 12:24:45.000', '2026-05-14 12:24:45.000'),
	('848d518c-4f48-11f1-aa91-2c56dcb03c3b', '196907261993031009', 'Saifullah, S.IP', NULL, NULL, NULL, NULL, NULL, '81237328864', 'KEPALA BADAN', NULL, 'IV/b', '2025-07-26 00:00:00.000', NULL, '32 Tahun 08 Bulan', '2026-03-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d57ec-4f48-11f1-aa91-2c56dcb03c3b', '197906122011011010', 'M. Arie Kurniawan, ST.,M.M.Inov', NULL, NULL, NULL, NULL, NULL, '81353531755', 'SEKRETARIS BADAN', NULL, 'IV/a', '2026-04-01 00:00:00.000', NULL, '15 Tahun 0 Bulan', '2025-01-01 00:00:00.000', NULL, NULL, 'STRATA 2', 'AKTIF', NULL, '78111549-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d5adf-4f48-11f1-aa91-2c56dcb03c3b', '198009012006042026', 'Laela Amrullah, SE\',M M', NULL, NULL, NULL, NULL, NULL, '81909119651', 'KEPALA BIDANG WASTANAS', NULL, 'IV/b', '2021-10-01 00:00:00.000', NULL, '19 Tahun 05 Bulan', '2024-04-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '33333333-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d5ccd-4f48-11f1-aa91-2c56dcb03c3b', '196907191993031005', 'Abdul Munir, SPd. SD', NULL, NULL, NULL, NULL, NULL, '85239165469', 'KEPALA BIDANG IDIOLOGI & KARAKTER BANGSA ', NULL, 'IV/a', '2021-04-01 00:00:00.000', NULL, '32 Tahun 08 Bulan', '2025-03-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d5ea2-4f48-11f1-aa91-2c56dcb03c3b', '197006272002121005', 'Farhan,S.Pi', NULL, NULL, NULL, NULL, NULL, '87866165779', 'KEPALA BIDANG POLDAGRI& ORMAS', NULL, 'IV/a', '2025-04-01 00:00:00.000', NULL, '22 Tahun 11 Bulan', '2024-12-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '22222222-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d60a5-4f48-11f1-aa91-2c56dcb03c3b', '197208052014102002', 'Hj. Mulaini, SP', NULL, NULL, NULL, NULL, NULL, '81339740052', 'KASUBBAG UNGKEP & KEPEGAWAIAN ', NULL, 'III/d', '2025-04-01 00:00:00.000', NULL, '20 Tahun 11 Bulan', '2024-07-14 00:00:00.000', NULL, NULL, 'STRATA 2', 'AKTIF', NULL, '78111549-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d628e-4f48-11f1-aa91-2c56dcb03c3b', '197605252010012015', 'Henny Sasmitha .S.T., M.M Inov', NULL, NULL, NULL, NULL, NULL, '81234945598', 'ANALIS KEBIJAKAN AHLI MUDA', NULL, 'III/d', '2022-04-02 00:00:00.000', NULL, '12 Tahun 04 bulan', '2026-01-01 00:00:00.000', NULL, NULL, 'STRATA 2', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d645b-4f48-11f1-aa91-2c56dcb03c3b', '198207262011011009', 'M.Husni Thamrin, S.IP., M.M Inov', NULL, NULL, NULL, NULL, NULL, '85228230082', 'ANALIS KEBIJAKAN AHLI MUDA', NULL, 'III/d', '2023-04-01 00:00:00.000', NULL, '13 Tahun 03 Bulan', '2025-01-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d6626-4f48-11f1-aa91-2c56dcb03c3b', '198606232006021001', 'Satriawan,S.STP., M.M Inov', NULL, NULL, NULL, NULL, NULL, '85221595147', 'ANALIS KEBIJAKAN AHLI MUDA', NULL, 'III/d', '2016-10-01 00:00:00.000', NULL, '07 Tahun 06 Bulan', '2025-04-01 00:00:00.000', NULL, NULL, 'STRATA 2', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d67ec-4f48-11f1-aa91-2c56dcb03c3b', '198305162010012009', 'Nurjannah Juliarti,S.AP', NULL, NULL, NULL, NULL, NULL, '85239505753', 'ANALIS KEBIJAKAN AHLI MUDA', NULL, 'III/d', '2022-04-01 00:00:00.000', NULL, ' 12 Tahun 03 Bulan', '2026-01-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d6a01-4f48-11f1-aa91-2c56dcb03c3b', '198009112007011008', 'Hairuddin ,SH', NULL, NULL, NULL, NULL, NULL, '85337354448', 'ANALIS KEBIJAKAN AHLI MUDA', NULL, 'III/c', '2021-04-01 00:00:00.000', NULL, '14Tahun 06 Bulan', '2025-04-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d6bf9-4f48-11f1-aa91-2c56dcb03c3b', '197510282007011015', 'Windra Kurnia. SE', NULL, NULL, NULL, NULL, NULL, '81337984646', 'PENELAAH TEKNIS KEBIJAKAN', NULL, 'III/c', '2025-06-01 00:00:00.000', NULL, '18 Tahun 10 Bulan', '2026-01-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d6de7-4f48-11f1-aa91-2c56dcb03c3b', '198104282008011016', 'Aan Hidayat, S.AP', NULL, NULL, NULL, NULL, NULL, '85138848565', 'STAF', NULL, 'III/b', '2016-10-01 00:00:00.000', NULL, '17 Tahun 09 Bulan', '2022-01-01 00:00:00.000', NULL, NULL, 'STRATA 1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d6fbf-4f48-11f1-aa91-2c56dcb03c3b', '198403252014102003', 'Eka Marlina Anpusyahnur, SE', NULL, NULL, NULL, NULL, NULL, '81337266456', 'BENDAHARA PENGELUARAN GAJI', NULL, 'III/a', '2024-06-01 00:00:00.000', NULL, '16 Tahun 3 Bulan', '2026-01-01 00:00:00.000', NULL, NULL, 'S1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d717d-4f48-11f1-aa91-2c56dcb03c3b', '196902011989061001', 'Samsi', NULL, NULL, NULL, NULL, NULL, '82340039796', 'STAF', NULL, 'II/d', '2019-04-01 00:00:00.000', NULL, '23 Tahun 10 Bulan', '2024-06-01 00:00:00.000', NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d733a-4f48-11f1-aa91-2c56dcb03c3b', '197101102006041022', 'Karyadi', NULL, NULL, NULL, NULL, NULL, '82339135005', 'STAF', NULL, 'III/a', '2022-04-01 00:00:00.000', NULL, '12 Tahun 08 Bulan', '2025-08-01 00:00:00.000', NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d7557-4f48-11f1-aa91-2c56dcb03c3b', '197201152007011025', 'Ahmad', NULL, NULL, NULL, NULL, NULL, '85237613037', 'STAF', NULL, 'II/d', '2019-04-01 00:00:00.000', NULL, '14 Tahun 08 Bulan', '2026-08-01 00:00:00.000', NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d77b1-4f48-11f1-aa91-2c56dcb03c3b', '198104152008011018', 'Sofyan', NULL, NULL, NULL, NULL, NULL, '82339886980', 'STAF', NULL, 'II/d', '2022-10-01 00:00:00.000', NULL, '17 Tahun 09 Bulan', '2026-01-01 00:00:00.000', NULL, NULL, 'SMK', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d797b-4f48-11f1-aa91-2c56dcb03c3b', '198306092010011012', 'Adi Jayadi', NULL, NULL, NULL, NULL, NULL, '81236232926', 'STAF', NULL, 'II/c', '2018-04-01 00:00:00.000', NULL, '13 Tahun 03 Bulan', '2026-01-01 00:00:00.000', NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d7b3e-4f48-11f1-aa91-2c56dcb03c3b', '198511052023211015', 'Ovi Putra Pandiwinata, SE', NULL, NULL, NULL, NULL, NULL, '81339333460', 'Staf Perencana', NULL, 'IX', NULL, NULL, '02 Tahun 1 Bln', '2025-11-01 00:00:00.000', NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d7cfe-4f48-11f1-aa91-2c56dcb03c3b', '198504112023212030', 'Mimin Armila, SE', NULL, NULL, NULL, NULL, NULL, '85337224570', 'Staf Arsiparis', NULL, 'IX', NULL, NULL, '02 Tahun 1 Bln', '2025-11-01 00:00:00.000', NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d7ebd-4f48-11f1-aa91-2c56dcb03c3b', '199205012023212055', 'Wulan Armianti, S.Kom', NULL, NULL, NULL, NULL, NULL, '82340779531', 'Staf', NULL, 'IX', NULL, NULL, '02 Tahun 1 Bln', '2025-11-01 00:00:00.000', NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d8084-4f48-11f1-aa91-2c56dcb03c3b', '19730305204211001', 'Busran, S.IP', NULL, NULL, NULL, NULL, NULL, '82247064583', 'Staf Arsiparis', NULL, 'IX', NULL, NULL, '01 Tahun 9 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d8244-4f48-11f1-aa91-2c56dcb03c3b', '198307032024212001', 'Dian Armini, SKM', NULL, NULL, NULL, NULL, NULL, '82247064583', 'Staf Perencana', NULL, 'IX', NULL, NULL, '01 Tahun 9 Bulan', '2024-03-01 00:00:00.000', NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d8412-4f48-11f1-aa91-2c56dcb03c3b', '198206192025211029', 'Istanto, S.E', NULL, NULL, NULL, NULL, NULL, '82339193794', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d85ce-4f48-11f1-aa91-2c56dcb03c3b', '198711252025211024', 'Roni Noval Putra Arta,S.Adm', NULL, NULL, NULL, NULL, NULL, '82339546345', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d879c-4f48-11f1-aa91-2c56dcb03c3b', '198709242025211022', 'Arifuddin, S.Pd.', NULL, NULL, NULL, NULL, NULL, '82339999948', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d8b0b-4f48-11f1-aa91-2c56dcb03c3b', '198808282025211026', 'Egit Irman Fadeta, S.Pd', NULL, NULL, NULL, NULL, NULL, '85338757028', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d8d50-4f48-11f1-aa91-2c56dcb03c3b', '198102022025211033', 'Ahmad, S.AP', NULL, NULL, NULL, NULL, NULL, '81239731525', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d8f1e-4f48-11f1-aa91-2c56dcb03c3b', '198712012025212028', 'Bilhusnah, S.Pd', NULL, NULL, NULL, NULL, NULL, '85237832254', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d90db-4f48-11f1-aa91-2c56dcb03c3b', '198812082025212031', 'Denjisana, S.Pd', NULL, NULL, NULL, NULL, NULL, '82341174020', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d937b-4f48-11f1-aa91-2c56dcb03c3b', '198607022025211016', 'Ardiansyah, ST', NULL, NULL, NULL, NULL, NULL, '85333549200', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d96f5-4f48-11f1-aa91-2c56dcb03c3b', '199606222025212020', 'Yeyen Ahmiati, S.P', NULL, NULL, NULL, NULL, NULL, '85333014090', 'Staf', NULL, 'IX', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'S-1', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d9961-4f48-11f1-aa91-2c56dcb03c3b', '19850623202521016', 'Hazizah, A.Md', NULL, NULL, NULL, NULL, NULL, '82144892144', 'Staf', NULL, 'VII', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'D-III', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d9b28-4f48-11f1-aa91-2c56dcb03c3b', '20000711202521003', 'Salam Juliansyah Al Gafari', NULL, NULL, NULL, NULL, NULL, '85338220885', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d9cda-4f48-11f1-aa91-2c56dcb03c3b', '197811102025211025', 'Hasanuddin', NULL, NULL, NULL, NULL, NULL, '85237057650', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848d9ec0-4f48-11f1-aa91-2c56dcb03c3b', '198203102025211007', 'Syahrul Bahri', NULL, NULL, NULL, NULL, NULL, '82340653269', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848da07c-4f48-11f1-aa91-2c56dcb03c3b', '197608252025211007', 'Paimin', NULL, NULL, NULL, NULL, NULL, '81339049636', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848da23b-4f48-11f1-aa91-2c56dcb03c3b', '198804182025212021', 'Nurul ramdani', NULL, NULL, NULL, NULL, NULL, '85253313531', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848da3f1-4f48-11f1-aa91-2c56dcb03c3b', '198701052025212018', 'Rosida', NULL, NULL, NULL, NULL, NULL, '85198489807', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848da5a1-4f48-11f1-aa91-2c56dcb03c3b', '198110012025211013', 'Hattamuddin', NULL, NULL, NULL, NULL, NULL, '85239917999', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848da756-4f48-11f1-aa91-2c56dcb03c3b', '199801032025212001', 'Yeni Utamin', NULL, NULL, NULL, NULL, NULL, '82313875573', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 04 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000'),
	('848da97b-4f48-11f1-aa91-2c56dcb03c3b', '197910302025212019', 'Nurwahida', NULL, NULL, NULL, NULL, NULL, '85333971000', 'Staf', NULL, 'V', NULL, NULL, '00 Tahun 02 Bulan', NULL, NULL, NULL, 'SMU', 'AKTIF', NULL, '11111111-3a71-4fcd-ad4a-c19d3f1c2121', '2026-05-14 10:53:50.000', '2026-05-14 10:53:50.000');

-- Dumping structure for table simpeg_kesbangpol.pg1
CREATE TABLE IF NOT EXISTS `pg1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) DEFAULT NULL,
  `nip` varchar(30) DEFAULT NULL,
  `jabatan` varchar(150) DEFAULT NULL,
  `tmt_jabatan` varchar(50) DEFAULT NULL,
  `masa_kerja` varchar(50) DEFAULT NULL,
  `gol_pangkat` varchar(100) DEFAULT NULL,
  `tmt_gol_pangkat` varchar(50) DEFAULT NULL,
  `tingkat_pendidikan` varchar(100) DEFAULT NULL,
  `instansi_pendidikan` varchar(150) DEFAULT NULL,
  `tahun_ijazah` varchar(50) DEFAULT NULL,
  `noHP` varchar(20) DEFAULT NULL,
  `kgb` varchar(20) DEFAULT NULL,
  `kgbs` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table simpeg_kesbangpol.pg1: ~43 rows (approximately)
INSERT INTO `pg1` (`id`, `nama`, `nip`, `jabatan`, `tmt_jabatan`, `masa_kerja`, `gol_pangkat`, `tmt_gol_pangkat`, `tingkat_pendidikan`, `instansi_pendidikan`, `tahun_ijazah`, `noHP`, `kgb`, `kgbs`) VALUES
	(87, 'Saifullah, S.IP', '196907261993031009', 'KEPALA BADAN', '', '32 Tahun 08 Bulan', 'IV/b', '7/26/2025', 'STRATA 1', 'UNIVERSITAS 45 MATARAM', '2005', '081237328864', '2028-03-01', '2026-03-01'),
	(88, 'M. Arie Kurniawan, ST.,M.M.Inov', '197906122011011010', 'SEKRETARIS BADAN', '', '15 Tahun 0 Bulan', 'IV/a', '4/1/2026', 'STRATA 2', 'UTS', '2023', '081353531755', '2027-01-01', '2025-01-01'),
	(89, 'Laela Amrullah, SE\',M M', '198009012006042026', 'KEPALA BIDANG WASTANAS', '10/2/2025', '19 Tahun 05 Bulan', 'IV/b', '10/1/2021', 'STRATA 1', 'UNRAM ', '2010', '081909119651', '2026-04-01', '2024-04-01'),
	(90, 'Abdul Munir, SPd. SD', '196907191993031005', 'KEPALA BIDANG IDIOLOGI & KARAKTER BANGSA ', '10/2/2025', '32 Tahun 08 Bulan', 'IV/a', '4/1/2021', 'STRATA 1', 'UT', '2010', '085239165469', '2027-03-01', '2025-03-01'),
	(91, 'Farhan,S.Pi', '197006272002121005', 'KEPALA BIDANG POLDAGRI& ORMAS', '10/2/2025', '22 Tahun 11 Bulan', 'IV/a', '4/1/2025', 'STRATA 1', 'IPB BOGOR', '1995', '087866165779', '2026-12-01', '2024-12-01'),
	(92, 'Hj. Mulaini, SP', '197208052014102002', 'KASUBBAG UNGKEP & KEPEGAWAIAN ', '10/2/2025', '20 Tahun 11 Bulan', 'III/d', '4/1/2025', 'STRATA 2', 'UTS', '2025', '081339740052', '2027-01-01', '2025-01-01'),
	(93, 'Henny Sasmitha .S.T., M.M Inov', '197605252010012015', 'ANALIS KEBIJAKAN AHLI MUDA', '4/2/2018', '12 Tahun 04 bulan', 'III/d', '4/2/2022', 'STRATA 2', 'UTS', '2024', '081234945598', '2028-01-01', '2026-01-01'),
	(94, 'M.Husni Thamrin, S.IP., M.M Inov', '198207262011011009', 'ANALIS KEBIJAKAN AHLI MUDA', '4/1/2023', '13 Tahun 03 Bulan', 'III/d', '4/1/2023', 'STRATA 1', 'STPMD JOGYA', '2005', '085228230082', '2027-01-01', '2025-01-01'),
	(95, 'Satriawan,S.STP., M.M Inov', '198606232006021001', 'ANALIS KEBIJAKAN AHLI MUDA', '4/8/2022', '07 Tahun 06 Bulan', 'III/d', '10/1/2016', 'STRATA 2', 'UTS', '2023', '085221595147', '2027-04-01', '2025-04-01'),
	(96, 'Nurjannah Juliarti,S.AP', '198305162010012009', 'ANALIS KEBIJAKAN AHLI MUDA', '4/1/2018', ' 12 Tahun 03 Bulan', 'III/d', '4/1/2022', 'STRATA 1', 'UNSA', '2012', '085239505753', '2028-01-01', '2026-01-01'),
	(97, 'Hairuddin ,SH', '198009112007011008', 'ANALIS KEBIJAKAN AHLI MUDA', '4/8/2022', '14Tahun 06 Bulan', 'III/c', '4/1/2021', 'STRATA 1', 'UNIVERSITAS MUHAMMADIYAH MATARAM', '2004', '085337354448', '2027-04-01', '2025-04-01'),
	(98, 'Windra Kurnia. SE', '197510282007011015', 'PENELAAH TEKNIS KEBIJAKAN', '6/1/2025', '18 Tahun 10 Bulan', 'III/c', '6/1/2025', 'STRATA 1', 'UNSA', '2011', '081337984646', '2028-01-01', '2026-01-01'),
	(99, 'Aan Hidayat, S.AP', '198104282008011016', 'STAF', '10/1/2016', '17 Tahun 09 Bulan', 'III/b', '10/1/2016', 'STRATA 1', 'UNSA', '', '085138848565', '2024-01-01', '2022-01-01'),
	(100, 'Eka Marlina Anpusyahnur, SE', '198403252014102003', 'BENDAHARA PENGELUARAN GAJI', '6/1/2024', '16 Tahun 3 Bulan', 'III/a', '6/1/2024', 'S1', 'CARDOVA', '2023', '081337266456', '2028-01-01', '2026-01-01'),
	(101, 'Samsi', '196902011989061001', 'STAF', '4/1/2023', '23 Tahun 10 Bulan', 'II/d', '4/1/2019', 'SMU', 'Paket C', '1999', '082340039796', '2026-06-01', '2024-06-01'),
	(102, 'Karyadi', '197101102006041022', 'STAF', '4/1/2022', '12 Tahun 08 Bulan', 'III/a', '4/1/2022', 'SMU', 'SMU NEGERI ALAS', '1992', '082339135005', '2027-08-01', '2025-08-01'),
	(103, 'Ahmad', '197201152007011025', 'STAF', '4/1/2024', '14 Tahun 08 Bulan', 'II/d', '4/1/2019', 'SMU', 'SMAN 1 TALIWANG', '1994', '085237613037', '2028-08-01', '2026-08-01'),
	(104, 'Sofyan', '198104152008011018', 'STAF', '10/1/2022', '17 Tahun 09 Bulan', 'II/d', '10/1/2022', 'SMK', 'STM Muhamdiyah Mataram', '2001', '082339886980', '2028-01-01', '2026-01-01'),
	(105, 'Adi Jayadi', '198306092010011012', 'STAF', '4/1/2018', '13 Tahun 03 Bulan', 'II/c', '4/1/2018', 'SMU', 'SMAN 1 TALIWANG', '2002', '081236232926', '2028-01-01', '2026-01-01'),
	(106, 'Ovi Putra Pandiwinata, SE', '198511052023211015', 'Staf Perencana', '11/1/2023', '02 Tahun 1 Bln', 'IX', '', 'S-1', 'CORDOVA', '2013', '081339333460', '2027-11-01', '2025-11-01'),
	(107, 'Mimin Armila, SE', '198504112023212030', 'Staf Arsiparis', '11/1/2023', '02 Tahun 1 Bln', 'IX', '', 'S-1', 'UNRAM', '2009', '085337224570', '2027-11-01', '2025-11-01'),
	(108, 'Wulan Armianti, S.Kom', '199205012023212055', 'Staf', '11/1/2023', '02 Tahun 1 Bln', 'IX', '', 'S-1', 'STMI Tulus Cendikia Bandung', '2017', '082340779531', '2027-11-01', '2025-11-01'),
	(109, 'Busran, S.IP', '19730305204211001', 'Staf Arsiparis', '3/1/2024', '01 Tahun 9 Bulan', 'IX', '', 'S-1', 'CORDOVA', '2013', '082247064583', NULL, NULL),
	(110, 'Dian Armini, SKM', '198307032024212001', 'Staf Perencana', '3/1/2024', '01 Tahun 9 Bulan', 'IX', '', 'S-1', 'UNTB', '2011', '082247064583', '2026-03-01', '2024-03-01'),
	(111, 'Istanto, S.E', '198206192025211029', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'STIE AS MATARAM', '2013', '082339193794', NULL, NULL),
	(112, 'Roni Noval Putra Arta,S.Adm', '198711252025211024', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'STIA MATARAM', '2014', '082339546345', NULL, NULL),
	(113, 'Arifuddin, S.Pd.', '198709242025211022', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S1', 'STKIP BIMA', '2010', '082339999948', NULL, NULL),
	(114, 'Egit Irman Fadeta, S.Pd', '198808282025211026', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'CORDOVA', '2013', '085338757028', NULL, NULL),
	(115, 'Ahmad, S.AP', '198102022025211033', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'UNSA', '2014', '081239731525', NULL, NULL),
	(116, 'Bilhusnah, S.Pd', '198712012025212028', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'STKIP HAMZANWADI SELONG', '2012', '085237832254', NULL, NULL),
	(117, 'Denjisana, S.Pd', '198812082025212031', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'CORDOVA', '2013', '082341174020', NULL, NULL),
	(118, 'Ardiansyah, ST', '198607022025211016', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'CORDOVA', '2024', '085333549200', NULL, NULL),
	(119, 'Yeyen Ahmiati, S.P', '199606222025212020', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'IX', '', 'S-1', 'UNRAM', '2019', '085333014090', NULL, NULL),
	(120, 'Hazizah, A.Md', '19850623202521016', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'VII', '', 'D-III', 'AMIKOM MATARAM', '2007', '082144892144', NULL, NULL),
	(121, 'Salam Juliansyah Al Gafari', '20000711202521003', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'SMAN 2 TALIWANG', '2019', '085338220885', NULL, NULL),
	(122, 'Hasanuddin', '197811102025211025', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'SMUN 1 TALIWANG', '1997', '085237057650', NULL, NULL),
	(123, 'Syahrul Bahri', '198203102025211007', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'SMA PKBM TALIWANG', '2006', '082340653269', NULL, NULL),
	(124, 'Paimin', '197608252025211007', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'SMAN 1 TALIWANG', '1996', '081339049636', NULL, NULL),
	(125, 'Nurul ramdani', '198804182025212021', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'SMAN 1 ALAS', '2006', '085253313531', NULL, NULL),
	(126, 'Rosida', '198701052025212018', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'SMAN 1 SETELUK', '2007', '085198489807', NULL, NULL),
	(127, 'Hattamuddin', '198110012025211013', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'PAKET C TERATAI', '2005', '085239917999', NULL, NULL),
	(128, 'Yeni Utamin', '199801032025212001', 'Staf', '8/1/2025', '00 Tahun 04 Bulan', 'V', '', 'SMU', 'SMKN 1 TALIWANG', '2017', '082313875573', NULL, NULL),
	(129, 'Nurwahida', '197910302025212019', 'Staf', '10/1/2025', '00 Tahun 02 Bulan', 'V', '', 'SMU', 'SMAN 2 SUMBAWA', '1998', '085333971000', NULL, NULL);

-- Dumping structure for table simpeg_kesbangpol.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','KEPALA_BADAN','SEKRETARIS_BADAN','KABAG_UMUM_KEPEGAWAIAN','KEPALA_BIDANG','PEGAWAI') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PEGAWAI',
  `pegawaiId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_pegawaiId_key` (`pegawaiId`),
  CONSTRAINT `User_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `pegawai` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol.user: ~43 rows (approximately)
INSERT INTO `user` (`id`, `email`, `password`, `role`, `pegawaiId`, `createdAt`, `updatedAt`) VALUES
('dd9ebb1d-4f4c-11f1-aa91-2c56dcb03c3b', '196907261993031009', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'ADMIN', '848d518c-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ec13f-4f4c-11f1-aa91-2c56dcb03c3b', '197906122011011010', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'KEPALA_BIDANG', '848d57ec-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ec491-4f4c-11f1-aa91-2c56dcb03c3b', '198009012006042026', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d5adf-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ec705-4f4c-11f1-aa91-2c56dcb03c3b', '196907191993031005', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d5ccd-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ec98a-4f4c-11f1-aa91-2c56dcb03c3b', '197006272002121005', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d5ea2-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ecbe9-4f4c-11f1-aa91-2c56dcb03c3b', '197208052014102002', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'KABAG_UMUM_KEPEGAWAIAN', '848d60a5-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ece3f-4f4c-11f1-aa91-2c56dcb03c3b', '197605252010012015', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d628e-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ed089-4f4c-11f1-aa91-2c56dcb03c3b', '198207262011011009', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d645b-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ed2fe-4f4c-11f1-aa91-2c56dcb03c3b', '198606232006021001', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d6626-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ed548-4f4c-11f1-aa91-2c56dcb03c3b', '198305162010012009', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d67ec-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ed789-4f4c-11f1-aa91-2c56dcb03c3b', '198009112007011008', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d6a01-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ed9de-4f4c-11f1-aa91-2c56dcb03c3b', '197510282007011015', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d6bf9-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9edc81-4f4c-11f1-aa91-2c56dcb03c3b', '198104282008011016', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d6de7-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9edeab-4f4c-11f1-aa91-2c56dcb03c3b', '198403252014102003', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d6fbf-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ee0d9-4f4c-11f1-aa91-2c56dcb03c3b', '196902011989061001', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d717d-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ee300-4f4c-11f1-aa91-2c56dcb03c3b', '197101102006041022', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d733a-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ee539-4f4c-11f1-aa91-2c56dcb03c3b', '197201152007011025', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d7557-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ee881-4f4c-11f1-aa91-2c56dcb03c3b', '198104152008011018', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d77b1-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9eeae7-4f4c-11f1-aa91-2c56dcb03c3b', '198306092010011012', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d797b-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9eed53-4f4c-11f1-aa91-2c56dcb03c3b', '198511052023211015', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d7b3e-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ef007-4f4c-11f1-aa91-2c56dcb03c3b', '198504112023212030', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d7cfe-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ef363-4f4c-11f1-aa91-2c56dcb03c3b', '199205012023212055', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d7ebd-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ef5b8-4f4c-11f1-aa91-2c56dcb03c3b', '19730305204211001', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d8084-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9ef902-4f4c-11f1-aa91-2c56dcb03c3b', '198307032024212001', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d8244-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9efbbb-4f4c-11f1-aa91-2c56dcb03c3b', '198206192025211029', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d8412-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9efde8-4f4c-11f1-aa91-2c56dcb03c3b', '198711252025211024', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d85ce-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f001c-4f4c-11f1-aa91-2c56dcb03c3b', '198709242025211022', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d879c-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f0281-4f4c-11f1-aa91-2c56dcb03c3b', '198808282025211026', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d8b0b-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f05a3-4f4c-11f1-aa91-2c56dcb03c3b', '198102022025211033', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d8d50-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f0905-4f4c-11f1-aa91-2c56dcb03c3b', '198712012025212028', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d8f1e-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f0b56-4f4c-11f1-aa91-2c56dcb03c3b', '198812082025212031', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d90db-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f0d9a-4f4c-11f1-aa91-2c56dcb03c3b', '198607022025211016', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d937b-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f101a-4f4c-11f1-aa91-2c56dcb03c3b', '199606222025212020', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d96f5-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f1277-4f4c-11f1-aa91-2c56dcb03c3b', '19850623202521016', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d9961-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f14c4-4f4c-11f1-aa91-2c56dcb03c3b', '20000711202521003', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d9b28-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f1714-4f4c-11f1-aa91-2c56dcb03c3b', '197811102025211025', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d9cda-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f198e-4f4c-11f1-aa91-2c56dcb03c3b', '198203102025211007', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848d9ec0-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f1c34-4f4c-11f1-aa91-2c56dcb03c3b', '197608252025211007', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848da07c-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f1e63-4f4c-11f1-aa91-2c56dcb03c3b', '198804182025212021', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848da23b-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f2095-4f4c-11f1-aa91-2c56dcb03c3b', '198701052025212018', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848da3f1-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f2327-4f4c-11f1-aa91-2c56dcb03c3b', '198110012025211013', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848da5a1-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f2566-4f4c-11f1-aa91-2c56dcb03c3b', '199801032025212001', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848da756-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000'),
	('dd9f2863-4f4c-11f1-aa91-2c56dcb03c3b', '197910302025212019', '$2a$10$btraUKEIcEyC50Nqy3Tsy.YUoxTESBFFszIWnneZRXCsZ.jfcNcqO', 'PEGAWAI', '848da97b-4f48-11f1-aa91-2c56dcb03c3b', '2026-05-14 11:24:57.000', '2026-05-14 11:24:57.000');

-- Dumping structure for table simpeg_kesbangpol._prisma_migrations
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table simpeg_kesbangpol._prisma_migrations: ~10 rows (approximately)
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('15070f9d-d457-417a-9ad8-7ed00af29ba9', 'e506663663529a010ce7c13db6aaaf39ef8b39ad80565c3f65b0dad864e3b7bf', '2026-05-08 13:55:20.771', '20260508033206_init', NULL, NULL, '2026-05-08 13:55:20.198', 1),
	('318895cf-fbc4-4d7d-ad4d-11b8ab155ef4', '7e602fc440037f9485c647b9645423ee14744bf27210cdd43fbdd3a111c0c835', '2026-05-12 00:28:44.478', '20260512002844_alter_notifikasi', NULL, NULL, '2026-05-12 00:28:44.408', 1),
	('3fcc2ecf-0246-4c75-8d87-4142235e2db8', '8590b3992f7186e541b326f31037b5e7cdc15bbed19b815876433b43a1e714e2', '2026-05-09 21:57:26.854', '20260509215726_alter_enum_status_cuti', NULL, NULL, '2026-05-09 21:57:26.786', 1),
	('4bad9ec2-b379-4ddc-b764-503a56e196c8', 'c7adb2b2a6fe784dfa00c31086ecfc1420291cdd2731f9b5cc7fe4060082b294', '2026-05-09 07:15:17.499', '20260509071517_alter_layanan_date', NULL, NULL, '2026-05-09 07:15:17.467', 1),
	('4f956426-68df-474d-b8de-415678f0af4b', '449374642e493e0f966fa234e72332559227d5fa1961b669d418c4e9fa13f66f', '2026-05-11 09:59:55.664', '20260511095955_alter_notifikasi', NULL, NULL, '2026-05-11 09:59:55.443', 1),
	('6cb6eab8-a40a-432f-b8bc-28700472b80c', 'e3fce28153ad57fbb806852defe416654997f50ce83376f9e40f0936cd8c2616', '2026-05-12 03:39:47.896', '20260512033947_alter_notifikasi', NULL, NULL, '2026-05-12 03:39:47.713', 1),
	('7bf9191b-903d-4b4d-8aa4-4d2614aee4b1', '7287dc00e727be5981144d35168e1f03edaef33477d4e257aec8168165b349e4', '2026-05-08 20:58:24.160', '20260508205823_new_table', NULL, NULL, '2026-05-08 20:58:23.774', 1),
	('82b83812-13e5-43a3-bd4d-d677b9d65c30', 'cc4221e8ad5a68e74708b6119611837ac79568d95f969eb3923a718970892c29', '2026-05-08 13:55:22.784', '20260508135522_add_cuti_tt', NULL, NULL, '2026-05-08 13:55:22.373', 1),
	('e738628a-9da3-46c8-bc08-95adadacc652', 'c285e35c123bd8eaefdbeef4883e44fb4f5d3eab41194c066b1c5829ecae5ea7', '2026-05-09 05:39:24.211', '20260509053924_alter_layanan_aktif', NULL, NULL, '2026-05-09 05:39:24.185', 1),
	('eff58c31-c4a3-48ea-b213-6e2da999e80c', 'c145633f206f2c46b370b0ed2845df4edbd2eef6cd6c8b9e4181447487090598', '2026-05-08 14:15:48.749', '20260508141548_add_file_pendukung_cuti', NULL, NULL, '2026-05-08 14:15:48.730', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
