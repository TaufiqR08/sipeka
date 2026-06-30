"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Upload,
} from "lucide-react";
import Link from "next/link";
import AdminDokumenAction from "./AdminDokumenAction";
import Swal from "sweetalert2";

export default function LFormEntri({
  sf,dlayanan,ddokument
}: {
  sf:any,
  dlayanan:any,
  ddokument:any
}) {

    const router = useRouter();

    const handleUpload = async (
        file: File,
        idDaft: string
        ) => {
        try {
            const data = new FormData();

            data.append("file", file);
            data.append("idLaya", dlayanan?.idLaya || "");
            data.append("idDaft", idDaft);

            const res = await fetch(
            "/api/layanan/dokument",
            {
                method: "POST",
                body: data,
            }
            );

            const result = await res.json();

            if (!res.ok) {
            throw new Error(result.error);
            }

            Swal.fire({ icon: "success", title: "Berhasil", text: "Upload berhasil" });

            router.refresh();
        } catch (err: any) { 
            Swal.fire({ icon: "error", title: "Gagal", text: err.message || "Gagal upload dokumen" });
        }
    };

    // console.log(sf.remainingDays>0 || dlayanan.aktif);
    
  return (
      <>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4">
          <Link 
            href={"/dashboard/layanan/"+sf.idKate} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengajuan {sf.nmKate} {sf.detail ? ", An. "+sf.nm:""}</h1>
            <p className="p-1 text-gray-600 text-sm text-yellow-700 bg-yellow-100">
                {
                    (!dlayanan || dlayanan.aktif) &&
                    (
                        sf.remainingDays>0  ?
                        ""
                            +(
                                sf.on? 
                                "Lengkapi formulir di bawah ini untuk mengajukan " + sf.nmKate + ", batas pengumpulan berkas "+sf.remainingDays+" hari lagi":
                                "Maaf belum waktunya untuk melakukan pengajuan ("+sf.remainingDays+" hari lagi)"):
                        "Tanggal pengajuan anda telah telat "+sf.remainingDays+" hari"
                    )
                }
            </p>
          </div>
        </div>

        
      </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Upload size={18} className="text-orange-600" />
                <h2 className="font-semibold text-gray-800">
                Upload Dokumen Persyaratan
                </h2>
            </div>

            <div className="p-6 space-y-4">

                {ddokument.map((item: any) => {

                const existing = item.listDokumen?.[0];
                    
                return (
                    <div
                    key={item.idDaft}
                    className="border border-gray-200 rounded-xl p-4"
                    >

                    {/* HEADER */}
                    <div className="flex items-start justify-between gap-4">

                        <div>
                        <h3 className="font-medium text-gray-900">
                            {item.nmDaft}
                        </h3>

                        {item.ketDaft && (
                            <p className="text-xs text-gray-500 mt-1">
                            {item.ketDaft}
                            </p>
                        )}
                        </div>

                        {/* STATUS */}
                        {existing && (
                        <div
                            className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${
                                existing.status === "DITERIMA"
                                ? "bg-green-100 text-green-700"
                                : existing.status === "DITOLAK"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                            `}
                        >
                            {existing.status}
                        </div>
                        )}
                    </div>

                    {/* FILE EXISTING */}
                    {existing?.file  && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <FileText
                            size={18}
                            className="text-blue-600"
                            />

                            <div>
                            <p className="text-sm font-medium text-gray-800">
                                Dokumen sudah diupload
                            </p>

                            <a
                                href={existing.file}
                                target="_blank"
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Lihat File
                            </a>
                            </div>
                        </div>

                        {
                            ((!sf.detail && existing.status!="DISETUJUI") || (sf.isAdmin && item.nmDaft.toLowerCase().includes("surat pengantar")))  &&
                            <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                                Ganti File
                                <input
                                type="file"
                                hidden
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpload(file, item.idDaft);
                                }}
                                />
                            </label>
                        }
                        </div>
                         
                    )}
                    {sf.isAdmin && existing && sf.detail && (
                        <AdminDokumenAction
                            dokumen={existing}
                        />
                    )}


                    {/* BELUM ADA FILE */}
                    {!existing?.file && sf.on && (
                        <label className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                        {
                            (!sf.detail || (sf.isAdmin && item.nmDaft.toLowerCase().includes("surat pengantar")))  &&
                            <>
                                <Upload
                                    size={28}
                                    className="text-gray-400 mb-2"
                                />

                                <p className="text-sm font-medium text-gray-800">
                                    Upload Dokumen
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    PDF, JPG, PNG (Maks. 10MB)
                                </p>

                                <input
                                    type="file"
                                    hidden
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUpload(file, item.idDaft);
                                    }}
                                />
                            </>
                        }
                        </label>
                    )}

                    {/* CATATAN ADMIN */}
                    {existing?.keterangan && (
                        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-xs font-semibold text-red-700">
                            Catatan Admin
                        </p>

                        <p className="text-sm text-red-600 mt-1">
                            {existing.keterangan}
                        </p>
                        </div>
                    )}
                    </div>
                );
                })}
            </div>
        </div>
    </>
  );
}