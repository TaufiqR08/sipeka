-- ============================================================
-- SIPEKA - UPDATE BIDANG PEGAWAI
-- Berdasarkan Struktur Organisasi Badan Kesatuan Bangsa dan 
-- Politik Kabupaten Sumbawa Barat
-- ============================================================
-- Bidang IDs:
--   11111111-3a71-4fcd-ad4a-c19d3f1c2121 = Bidang Ideologi & Karakter Kebangsaan
--   22222222-3a71-4fcd-ad4a-c19d3f1c2121 = Bidang Politik Dalam Negeri & Ormas
--   33333333-3a71-4fcd-ad4a-c19d3f1c2121 = Bidang Kewaspadaan & Ketahanan Nasional
--   78111549-3a71-4fcd-ad4a-c19d3f1c2121 = Sekretariat Badan
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. KEPALA BADAN - Tidak masuk bidang manapun (NULL)
-- ============================================================
UPDATE `pegawai` SET 
    `bidangId` = NULL,
    `updatedAt` = NOW()
WHERE `nip` = '196907261993031009'; -- Saifullah, S.IP

-- ============================================================
-- 2. SEKRETARIAT BADAN
--    Pimpinan: M. Arie Kurniawan, ST., M.M.Inov
-- ============================================================
UPDATE `pegawai` SET 
    `bidangId` = '78111549-3a71-4fcd-ad4a-c19d3f1c2121',
    `updatedAt` = NOW()
WHERE `nip` IN (
    '197906122011011010', -- M. Arie Kurniawan, ST.,M.M.Inov (Sekretaris Badan)
    '197208052014102002', -- Hj. Mulaini, SP (Kasubag Umkep)
    '198403252014102003', -- Eka Marlina Anpusyahnur, SE (Bendahara Pengeluaran Gaji)
    '197101102006041022', -- Karyadi (Staf Bendahara)
    '196902011989061001', -- Samsi (Staf)
    '198104152008011018', -- Sofyan (Staf)
    '199205012023212055', -- Wulan Armianti, S.Kom (Staf)
    '198504112023212030', -- Mimin Armila, SE (Staf Arsiparis)
    '19850623202521016',  -- Hazizah, A.Md (Staf)
    '198701052025212018', -- Rosida (Staf)
    '199801032025212001', -- Yeni Utamin (Staf)
    '197910302025212019', -- Nurwahida (Staf)
    '198307032024212001', -- Dian Armini, SKM (Staf Perencana)
    '198511052023211015', -- Ovi Putra Pandiwinata, SE (Staf Perencana)
    '19730305204211001'   -- Busran, S.IP (Staf Arsiparis)
);

-- ============================================================
-- 3. BIDANG IDEOLOGI & KARAKTER KEBANGSAAN
--    Pimpinan: Abdul Munir, SPd. SD / Farhan, S.Pi (sesuai gambar)
--    ID: 11111111-3a71-4fcd-ad4a-c19d3f1c2121
-- ============================================================
UPDATE `pegawai` SET 
    `bidangId` = '11111111-3a71-4fcd-ad4a-c19d3f1c2121',
    `updatedAt` = NOW()
WHERE `nip` IN (
    '197006272002121005', -- Farhan, S.Pi (Kepala Bidang Ideologi - sesuai gambar)
    '198606232006021001', -- Satriawan, S.STP., M.M Inov
    '198812082025212031', -- Denjisana, S.Pd
    '198102022025211033', -- Ahmad, S.AP
    '198306092010011012', -- Adi Jayadi
    '198203102025211007', -- Syahrul Bahri
    '198110012025211013', -- Hattamuddin
    '197608252025211007'  -- Paimin
);

-- ============================================================
-- 4. BIDANG KEWASPADAAN & KETAHANAN NASIONAL
--    Pimpinan: Laela Amrullah, SE., M.M
--    ID: 33333333-3a71-4fcd-ad4a-c19d3f1c2121
-- ============================================================
UPDATE `pegawai` SET 
    `bidangId` = '33333333-3a71-4fcd-ad4a-c19d3f1c2121',
    `updatedAt` = NOW()
WHERE `nip` IN (
    '198009012006042026', -- Laela Amrullah, SE', M M (Kepala Bidang Wastanas)
    '197605252010012015', -- Henny Sasmitha, S.T., M.M Inov
    '198009112007011008', -- Hairuddin, SH
    '198206192025211029', -- Istanto, SE
    '198712012025212028', -- Bilhusnah, S.Pd
    '198808282025211026', -- Egit Irman Fadeta, S.Pd
    '198709242025211022', -- Arifuddin, S.Pd
    '199606222025212020'  -- Yeyen Ahmiati, S.P
);

-- ============================================================
-- 5. BIDANG POLITIK DALAM NEGERI & ORMAS
--    Pimpinan: Abdul Munir, SPd. SD (sesuai gambar Bidang Politik)
--    ID: 22222222-3a71-4fcd-ad4a-c19d3f1c2121
-- ============================================================
UPDATE `pegawai` SET 
    `bidangId` = '22222222-3a71-4fcd-ad4a-c19d3f1c2121',
    `updatedAt` = NOW()
WHERE `nip` IN (
    '196907191993031005', -- Abdul Munir, SPd. SD (Kepala Bidang Ideologi di DB, Poldagri di gambar)
    '198305162010012009', -- Nurjannah Juliarti, S.AP
    '197510282007011015', -- Windra Kurnia, SE
    '198207262011011009', -- M. Husni Thamrin, S.IP., M.M Inov
    '198711252025211024', -- Roni Noval Putra Arta, S.Adm
    '198607022025211016', -- Ardiansyah, ST
    '197201152007011025', -- Ahmad (Staf II/d)
    '198104282008011016', -- Aan Hidayat, S.AP
    '198804182025212021', -- Nurul Ramdani
    '197811102025211025', -- Hasanuddin
    '20000711202521003'   -- Salam Juliansyah Al Gafari
);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- VERIFIKASI - Jalankan query ini untuk memastikan hasilnya benar
-- ============================================================
SELECT 
    b.nm AS `Bidang`,
    COUNT(p.id) AS `Jumlah Pegawai`,
    GROUP_CONCAT(p.nama ORDER BY p.nama SEPARATOR ', ') AS `Nama Pegawai`
FROM bidang b
LEFT JOIN pegawai p ON p.bidangId = b.id
GROUP BY b.id, b.nm
UNION ALL
SELECT 
    'TANPA BIDANG (Kepala Badan/Eksternal)' AS `Bidang`,
    COUNT(*) AS `Jumlah`,
    GROUP_CONCAT(nama ORDER BY nama SEPARATOR ', ') AS `Nama Pegawai`
FROM pegawai
WHERE bidangId IS NULL
ORDER BY Bidang;
