"use client";

import { useRef } from "react";

export default function PCutiPage(
    {v}: {v: any}
) {
  const formRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (formRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Formulir Cuti Pegawai</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 1rem; font-family: 'Times New Roman', Times, serif; }
                .form-table { border-collapse: collapse; width: 100%; }
                .form-table th, .form-table td { border: 1px solid black; padding: 0.5rem; vertical-align: top; }
                .form-table th { background-color: #f8fafc; text-align: center; }
                input, textarea, select { border: none; border-bottom: 1px solid #9ca3af; width: 100%; padding: 0.25rem 0; background: transparent; }
                .radio-group { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
                .radio-group label { display: inline-flex; align-items: center; gap: 0.25rem; white-space: nowrap; }
                .radio-group input { width: auto; margin: 0; }
                .alamat-box { border: 1px solid #9ca3af; border-radius: 0.25rem; padding: 0.4rem; background: #fefce8; }

                table.Tborder,
                table.Tborder tr,
                table.Tborder td,
                table.Tborder th {
                    border: 1px solid black;
                }

                /* Opsional: atur padding sel agar lebih rapi */
                .Tborder td,
                .Tborder th {
                    padding: 8px;
                    vertical-align: top;
                }
                @media print {
                  body { margin: 0; padding: 0; }
                  .no-print { display: none; }
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              ${formRef.current.outerHTML}
              <script>window.onload = () => window.print();<\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };
  console.log(v);
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-serif">
      <div className="max-w-5xl mx-auto">
        {/* Tombol cetak/PDF */}
        <div className="flex justify-end mb-4 no-print">
          <button
            onClick={handlePrint}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-md shadow-md transition flex items-center gap-2"
          >
            📄 Simpan sebagai PDF / Cetak
          </button>
        </div>

        {/* Formulir - konten yang akan dicetak */}
        <div ref={formRef} className="bg-white shadow-xl rounded-md p-6 md:p-8 print:shadow-none">    
            <table className="form-table w-full mb-5">
                <tbody>
                    <tr>
                        <td className="w-[70%] font-semibold"></td>
                        <td className="w-[30%]">
                            <span>Taliwang, </span>
                                <span className="inline-block min-w-[100px]"></span> 
                                2026 <br/>
                                <span>Kepada <br/> 
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[70%] font-semibold text-end">
                            <span className="min-w-[120px]">Yth.</span>
                        </td>
                        <td className="w-[30%]">
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[70%] font-semibold"></td>
                        <td className="w-[30%]">
                            <span>di - </span>
                            <br />
                            <span className="block text-center">Taliwang</span> 
                        </td>
                    </tr>
                     <tr>
                        <td colSpan={2} className="text-center  align-middle font-bold">
                            <br />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="text-center  align-middle font-bold">
                            <span className="border-b">FORMULIR PERMINTAAN DAN PEMBERIAN CUTI</span>
                        </td>
                    </tr>
                </tbody>
            </table>
          {/* Tabel DATA PEGAWAI */}
            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={4} className="text-left pl-2 border border-black p-2">
                            I. DATA PEGAWAI
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="w-[20%] font-semibold border border-black p-2">Nama</td>
                        <td className="w-[30%] border border-black p-2">{v.pegawai.nama}</td>
                        <td className="w-[20%] font-semibold border border-black p-2">NIP</td>
                        <td className="w-[30%] border border-black p-2">{v.pegawai.nip}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold border border-black p-2">Jabatan</td>
                        <td className="border border-black p-2">{v.pegawai.jabatan}</td>
                        <td className="font-semibold border border-black p-2">Masa Kerja</td>
                        <td className="border border-black p-2">{v.pegawai.masaKerja}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold border border-black p-2">Pangkat/Gol</td>
                        <td colSpan={3} className="w-[25%] font-semibold border border-black p-2">{v.pegawai.pangkat} / {v.pegawai.golonganRuang}</td>
                    </tr>
                    <tr>
                        <td className="w-[25%] font-semibold border border-black p-2">Unit Kerja</td>
                        <td colSpan={3} className="w-[25%] font-semibold border border-black p-2">{v.pegawai.unitKerja}</td>
                    </tr>
                </tbody>
            </table>

            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={4} className="text-left pl-2 border border-black p-2">
                            II. JENIS CUTI YANG DIAMBIL ** 
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="w-[20%] font-semibold border border-black p-2">1. Cuti Tahunan</td>
                        <td className="w-[20%] border border-black p-2 text-center">{(v.jenisCuti=="TAHUNAN"?"✓":"")}</td>
                        <td className="w-[35%] font-semibold border border-black p-2">4. Cuti Melahirkan</td>
                        <td className="w-[25%] border border-black p-2 text-center">{(v.jenisCuti=="MELAHIRKAN"?"✓":"")}</td>
                    </tr>
                    <tr> 
                        <td className="font-semibold border border-black p-2">2. Cuti Besar</td>
                        <td className="border border-black p-2 text-center">{(v.jenisCuti=="BESAR"?"✓":"")}</td>
                        <td className="font-semibold border border-black p-2">5. Cuti Karena Alasan Penting</td>
                        <td className="border border-black p-2 text-center">{(v.jenisCuti=="ALASAN_PENTING"?"✓":"")}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold border border-black p-2">3. Cuti Sakit</td>
                        <td className="border border-black p-2 text-center">{(v.jenisCuti=="SAKIT"?"✓":"")}</td>
                        <td className="font-semibold border border-black p-2">6. Cuti di Luar Tanggungan Negara</td>
                        <td className="border border-black p-2 text-center">{(v.jenisCuti=="LUAR_TANGGUNGAN_NEGARA"?"✓":"")}</td>
                    </tr>
                </tbody>
            </table>
            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={4} className="text-left pl-2 border border-black p-2">
                            III. ALASAN CUTI
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={4} className="w-[20%] font-semibold border border-black p-2">
                            {v.alasan}
                            <br />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={6} className="text-left pl-2 border border-black p-2">
                            IV. LAMANYA CUTI
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="w-[15%] font-semibold border border-black p-2">Selama</td>
                        <td className="w-[23%] border border-black p-2"> (hari/<span className="line-through">bulan</span>/<span className="line-through">tahun</span>)*</td>
                        <td className="w-[15%] font-semibold border border-black p-2">Mulai tanggal</td>
                        <td className="w-[15%] border border-black p-2">{v.dateS}</td>
                        <td className="w-[5%] border border-black p-2">s/d</td>
                        <td className="w-[22%] border border-black p-2">{v.dateE}</td>
                    </tr>
                </tbody>
            </table>
            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={5} className="text-left pl-2 border border-black p-2">
                            V. CATATAN CUTI
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={3} className=" font-semibold border border-black p-2">1. Cuti Tahunan</td>                        
                        <td className="border border-black p-2">2. Cuti Besar</td>
                        <td className="border border-black p-2"></td>
                    </tr>
                    <tr> 
                        <td className="w-[10%] font-semibold border border-black p-2">Tahun</td>
                        <td className="w-[10%] border border-black p-2">Sisa</td>
                        <td className="w-[10%] font-semibold border border-black p-2">Keterangan</td>
                        <td className="w-[35%] border border-black p-2">3.CUTI SAKIT </td>
                        <td className="w-[35%] border border-black p-2"></td>
                    </tr>
                    <tr>
                        <td className="font-semibold border border-black p-2">N-2 </td>
                        <td className="border border-black p-2"></td>
                        <td className="font-semibold border border-black p-2"></td>
                        <td className="border border-black p-2">4. Cuti Melahirkan</td>
                        <td className="border border-black p-2"></td>
                    </tr>
                    <tr> 
                        <td className="font-semibold border border-black p-2">N-1</td>
                        <td className="border border-black p-2"></td>
                        <td className="font-semibold border border-black p-2"></td>
                        <td className="border border-black p-2">5. Cuti Karena Alasan Penting</td>
                        <td className="border border-black p-2"></td>
                    </tr>
                    <tr>
                        <td className="font-semibold border border-black p-2">N</td>
                        <td className="border border-black p-2"></td>
                        <td className="font-semibold border border-black p-2"></td>
                        <td className="border border-black p-2">6. Cuti di Luar Tanggungan Negara</td>
                        <td className="border border-black p-2"></td>
                    </tr>
                </tbody>
            </table>
            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={5} className="text-left pl-2 border border-black p-2">
                            VI. ALAMAT SELAMA MENJALANKAN CUTI
                        </th>
                    </tr>
                </thead>
                <tbody> 
                    <tr> 
                        <td rowSpan={2} className="w-[50%] font-semibold border border-black p-2">{v.alamatSelama}</td>
                        <td className="w-[20%] border border-black p-2">TELP</td>
                        <td className="w-[30%] font-semibold border border-black p-2"></td>
                    </tr>
                    <tr>
                        
                        <td colSpan={2} className="border border-black p-2 text-center">
                            <span>Hormat saya, </span>
                            <br/><br/><br/>
                            <span>({v.userNama}) <br /> NIP. {v.userNip}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            
   
            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={5} className="text-left pl-2 border border-black p-2">
                            VII. PERTIMBANGAN ATASAN LANGSUNG** 
                        </th>
                    </tr>
                </thead>
                <tbody> 
                    <tr> 
                        <td className="w-[20%] font-semibold border border-black p-2">DISETUJUI</td>
                        <td className="w-[20%] border border-black p-2">PERUBAHAN****</td>
                        <td className="w-[20%] font-semibold border border-black p-2">DITANGGUHKAN****</td>
                        <td className="w-[40%] font-semibold border border-black p-2">TIDAK DISETUJUI****</td>
                    </tr>
                    <tr>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className="border border-black p-2 text-center">
                            <span>{v.atasan1Jabatan}, </span>
                            <br/><br/><br/>
                            <span>({v.atasan1Nama}) <br /> {(v.atasan1Nip.length >2?"NIP. "+v.atasan1Nip:"")}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className="form-table w-full mb-5 border-collapse">
                <thead>
                    <tr>
                        <th colSpan={5} className="text-left pl-2 border border-black p-2">
                            VIII. KEPUTUSAN PEJABAT YANG BERWENANG MEMBERIKAN CUTI** 
                        </th>
                    </tr>
                </thead>
                <tbody> 
                    <tr> 
                        <td className="w-[20%] font-semibold border border-black p-2">DISETUJUI</td>
                        <td className="w-[20%] border border-black p-2">PERUBAHAN****</td>
                        <td className="w-[20%] font-semibold border border-black p-2">DITANGGUHKAN****</td>
                        <td className="w-[40%] font-semibold border border-black p-2">TIDAK DISETUJUI****</td>
                    </tr>
                    <tr>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className="border border-black p-2 text-center">
                            <span>{v.atasan2Jabatan}, </span>
                            <br/><br/><br/>
                            <span>({v.atasan2Nama}) <br /> {(v.atasan2Nip.length >2?"NIP. "+v.atasan2Nip:"")}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className="form-table w-full mb-5">
                <tbody> 
                    <tr> 
                        <td className="p-2 w-[10%]">
                            Catatan :  <br />
                            *       <br />
                            **      <br />
                            ***     <br />
                            ****    <br />
                            N       <br />
                            N-1     <br />
                            N-2      
                        </td>
                        <td className="p-2">
                            <br />
                                 Coret yang tidak perlu  <br />
                            Pilih salah satu dengan memberi tanda centang (v)  <br />
                            Diisi oleh pejabat yang menangani bidang kepegawaian sebelum PNS mengajukan cuti <br />
                            Diberi tanda centang dan alasannya <br />
                            = Cuti tahun berjalan  <br />
                            = Sisa cuti 1 tahun sebelumnya <br />
                            = Sisa cuti 2 tahun sebelumnya 
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}