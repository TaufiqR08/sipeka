"use client";

import { useRef } from "react";

export default function PCutiPage({ v }: { v: any }) {
  const formRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* CSS Print — hanya aktif saat print */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          .no-print { display: none !important; }
          button { display: none !important; }
        }

        #print-area table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 12px;
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
        }
        #print-area td, #print-area th {
          border: 1px solid black;
          padding: 5px 7px;
          vertical-align: top;
        }
        #print-area th {
          background-color: #f8fafc;
          text-align: left;
          font-weight: 700;
        }
        .no-border td { border: none !important; }
      `}</style>

      <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-serif">
        <div className="max-w-4xl mx-auto">

          {/* Tombol Print */}
          <div className="flex justify-end mb-4 no-print">
            <button
              onClick={handlePrint}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-md shadow-md transition flex items-center gap-2"
            >
              📄 Simpan sebagai PDF / Cetak
            </button>
          </div>

          {/* Area yang dicetak */}
          <div id="print-area" ref={formRef} className="bg-white shadow-xl rounded-md p-6 md:p-8">

            {/* Header — tanggal & tujuan */}
            <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "12px", border: "none" }}>
              <tbody>
                <tr>
                  <td style={{ width: "70%", border: "none" }}></td>
                  <td style={{ width: "30%", border: "none" }}>
                    Taliwang, <span style={{ display: "inline-block", minWidth: "80px" }}></span> 2026<br />
                    <span>Kepada<br /></span>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", textAlign: "right", fontWeight: 600 }}>
                    <span>Yth.</span>
                  </td>
                  <td style={{ border: "none" }}></td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}></td>
                  <td style={{ border: "none" }}>
                    <span>di -</span><br />
                    <span style={{ display: "block", textAlign: "center" }}>Taliwang</span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ border: "none", textAlign: "center", padding: "6px 0" }}></td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ border: "none", textAlign: "center", fontWeight: 700 }}>
                    <span style={{ borderBottom: "1px solid black" }}>FORMULIR PERMINTAAN DAN PEMBERIAN CUTI</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* I. DATA PEGAWAI */}
            <table>
              <thead>
                <tr>
                  <th colSpan={4} style={{ textAlign: "left" }}>I. DATA PEGAWAI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "20%", fontWeight: 600 }}>Nama</td>
                  <td style={{ width: "30%" }}>{v.pegawai?.nama}</td>
                  <td style={{ width: "20%", fontWeight: 600 }}>NIP</td>
                  <td style={{ width: "30%" }}>{v.pegawai?.nip}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Jabatan</td>
                  <td>{v.pegawai?.jabatan}</td>
                  <td style={{ fontWeight: 600 }}>Masa Kerja</td>
                  <td>{v.pegawai?.masaKerja}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Pangkat/Gol</td>
                  <td colSpan={3}>{v.pegawai?.pangkat} / {v.pegawai?.golonganRuang}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Unit Kerja</td>
                  <td colSpan={3}>{v.pegawai?.unitKerja}</td>
                </tr>
              </tbody>
            </table>

            {/* II. JENIS CUTI */}
            <table>
              <thead>
                <tr>
                  <th colSpan={4} style={{ textAlign: "left" }}>II. JENIS CUTI YANG DIAMBIL **</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "20%", fontWeight: 600 }}>1. Cuti Tahunan</td>
                  <td style={{ width: "20%", textAlign: "center" }}>{v.jenisCuti === "TAHUNAN" ? "✓" : ""}</td>
                  <td style={{ width: "35%", fontWeight: 600 }}>4. Cuti Melahirkan</td>
                  <td style={{ width: "25%", textAlign: "center" }}>{v.jenisCuti === "MELAHIRKAN" ? "✓" : ""}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>2. Cuti Besar</td>
                  <td style={{ textAlign: "center" }}>{v.jenisCuti === "BESAR" ? "✓" : ""}</td>
                  <td style={{ fontWeight: 600 }}>5. Cuti Karena Alasan Penting</td>
                  <td style={{ textAlign: "center" }}>{v.jenisCuti === "ALASAN_PENTING" ? "✓" : ""}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>3. Cuti Sakit</td>
                  <td style={{ textAlign: "center" }}>{v.jenisCuti === "SAKIT" ? "✓" : ""}</td>
                  <td style={{ fontWeight: 600 }}>6. Cuti di Luar Tanggungan Negara</td>
                  <td style={{ textAlign: "center" }}>{v.jenisCuti === "LUAR_TANGGUNGAN_NEGARA" ? "✓" : ""}</td>
                </tr>
              </tbody>
            </table>

            {/* III. ALASAN CUTI */}
            <table>
              <thead>
                <tr><th colSpan={4} style={{ textAlign: "left" }}>III. ALASAN CUTI</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ minHeight: "40px" }}>{v.alasan}<br /></td>
                </tr>
              </tbody>
            </table>

            {/* IV. LAMANYA CUTI */}
            <table>
              <thead>
                <tr><th colSpan={6} style={{ textAlign: "left" }}>IV. LAMANYA CUTI</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "15%", fontWeight: 600 }}>Selama</td>
                  <td style={{ width: "23%" }}>{v.jumlahHari} (hari/<s>bulan</s>/<s>tahun</s>)*</td>
                  <td style={{ width: "15%", fontWeight: 600 }}>Mulai tanggal</td>
                  <td style={{ width: "17%" }}>{v.dateS}</td>
                  <td style={{ width: "5%", textAlign: "center" }}>s/d</td>
                  <td style={{ width: "25%" }}>{v.dateE}</td>
                </tr>
              </tbody>
            </table>

            {/* V. CATATAN CUTI */}
            <table>
              <thead>
                <tr><th colSpan={5} style={{ textAlign: "left" }}>V. CATATAN CUTI</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} style={{ fontWeight: 600 }}>1. Cuti Tahunan</td>
                  <td>2. Cuti Besar</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ width: "10%", fontWeight: 600 }}>Tahun</td>
                  <td style={{ width: "10%" }}>Sisa</td>
                  <td style={{ width: "15%", fontWeight: 600 }}>Keterangan</td>
                  <td style={{ width: "35%" }}>3. CUTI SAKIT</td>
                  <td style={{ width: "30%" }}></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>N-2</td>
                  <td></td>
                  <td style={{ fontWeight: 600 }}></td>
                  <td>4. Cuti Melahirkan</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>N-1</td>
                  <td></td>
                  <td></td>
                  <td>5. Cuti Karena Alasan Penting</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>N</td>
                  <td></td>
                  <td></td>
                  <td>6. Cuti di Luar Tanggungan Negara</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            {/* VI. ALAMAT SELAMA CUTI */}
            <table>
              <thead>
                <tr><th colSpan={3} style={{ textAlign: "left" }}>VI. ALAMAT SELAMA MENJALANKAN CUTI</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={2} style={{ width: "50%" }}>{v.alamatSelama}</td>
                  <td style={{ width: "20%" }}>TELP</td>
                  <td style={{ width: "30%" }}></td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    Hormat saya,<br /><br /><br />
                    ({v.userNama})<br />NIP. {v.userNip}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* VII. PERTIMBANGAN ATASAN LANGSUNG */}
            <table>
              <thead>
                <tr><th colSpan={4} style={{ textAlign: "left" }}>VII. PERTIMBANGAN ATASAN LANGSUNG **</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "25%", fontWeight: 600 }}>DISETUJUI</td>
                  <td style={{ width: "25%" }}>PERUBAHAN ****</td>
                  <td style={{ width: "25%", fontWeight: 600 }}>DITANGGUHKAN ****</td>
                  <td style={{ width: "25%", fontWeight: 600 }}>TIDAK DISETUJUI ****</td>
                </tr>
                <tr>
                  <td style={{ border: "none", height: "60px" }}></td>
                  <td style={{ border: "none" }}></td>
                  <td style={{ border: "none" }}></td>
                  <td style={{ textAlign: "center" }}>
                    {v.atasan1Jabatan},<br /><br /><br />
                    ({v.atasan1Nama})<br />
                    {v.atasan1Nip?.length > 2 ? `NIP. ${v.atasan1Nip}` : ""}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* VIII. KEPUTUSAN PEJABAT */}
            <table>
              <thead>
                <tr><th colSpan={4} style={{ textAlign: "left" }}>VIII. KEPUTUSAN PEJABAT YANG BERWENANG MEMBERIKAN CUTI **</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "25%", fontWeight: 600 }}>DISETUJUI</td>
                  <td style={{ width: "25%" }}>PERUBAHAN ****</td>
                  <td style={{ width: "25%", fontWeight: 600 }}>DITANGGUHKAN ****</td>
                  <td style={{ width: "25%", fontWeight: 600 }}>TIDAK DISETUJUI ****</td>
                </tr>
                <tr>
                  <td style={{ border: "none", height: "60px" }}></td>
                  <td style={{ border: "none" }}></td>
                  <td style={{ border: "none" }}></td>
                  <td style={{ textAlign: "center" }}>
                    {v.atasan2Jabatan},<br /><br /><br />
                    ({v.atasan2Nama})<br />
                    {v.atasan2Nip?.length > 2 ? `NIP. ${v.atasan2Nip}` : ""}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Catatan Kaki */}
            <table style={{ border: "none", marginTop: "8px" }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", width: "12%", verticalAlign: "top", fontSize: "10pt" }}>
                    Catatan :<br />*<br />**<br />***<br />****<br />N<br />N-1<br />N-2
                  </td>
                  <td style={{ border: "none", verticalAlign: "top", fontSize: "10pt" }}>
                    <br />
                    Coret yang tidak perlu<br />
                    Pilih salah satu dengan memberi tanda centang (v)<br />
                    Diisi oleh pejabat yang menangani bidang kepegawaian sebelum PNS mengajukan cuti<br />
                    Diberi tanda centang dan alasannya<br />
                    = Cuti tahun berjalan<br />
                    = Sisa cuti 1 tahun sebelumnya<br />
                    = Sisa cuti 2 tahun sebelumnya
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
}