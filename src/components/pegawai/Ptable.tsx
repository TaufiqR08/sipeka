"use client";

import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, TrendingUp, CheckCircle, Clock, Upload, Eye, Shield, Check, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import {formatDateShort, getRemainingDays } from "@/lib/sfBGS"
export default function Ptable({
  dtabel,
  sf,
}: {
  dtabel: any[], 
  sf:any
}) {
    
  const router = useRouter();
  const getStatusBadge = (status: string) => {
    const badges = {
      Centang: "bg-green-100 text-green-700",
      Disetujui: "bg-green-100 text-green-700",
      Menunggu: "bg-yellow-100 text-yellow-700",
    };
    return badges[status as keyof typeof badges] || "";
  };

  const [selectedItem, _selectedItem] = useState<any>({item:{},modal:false});

  const {modal, item }= selectedItem;
  
  const actSelesai = async () => {
    try {
        const data = new FormData();

        data.append("idLaya", item.idLaya);
        data.append("aktif","0");

        const res = await fetch(
        "/api/layanan",
        {
            method: "PUT",
            body: data,
        }
        );

        const result = await res.json();

        if (!res.ok) {
        throw new Error(result.error);
        }

        Swal.fire({ icon: "success", title: "Berhasil", text: "Upload berhasil" });
        _selectedItem({modal:false})

        router.refresh();
    } catch (err: any) { 
        Swal.fire({ icon: "error", title: "Gagal", text: err.message || "Gagal upload" });
    }
  };
  
  return (
      <>
        {/* Info Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total {sf.nmKate}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Golongan Saat Ini</p>
            <p className="text-2xl font-bold text-green-600 mt-1">III/d</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Golongan Berikutnya</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">IV/a</p>
          </div>
        </div> */}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    KGB 
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    KP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dtabel.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{item.nama}</span>
                          <span className="text-xs text-gray-500">{item.nip}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.jabatan}
                      </td>
                      <td className="px-6 py-4">
                        {(item.kgb <0 ? " Terlambat ":item.kgb+" hari")}
                      </td>
                      <td className="px-6 py-4">
                         {(item.kp <0 ? " Terlambat ":item.kp+" hari")}
                      </td> 
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📌 Catatan:</strong> Pastikan dokumen pendukung Anda
            telah di-upload. 
          </p>
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <Shield size={18} />
                  Konfirmasi
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Pengajuan <strong>{selectedItem.jenisCuti}</strong> oleh <strong>{item.pegawai}</strong> ini telah selesai ?
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
                <div className="flex items-center justify-around gap-4">
                  <button onClick={() => _selectedItem({modal:false})} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Batal
                  </button>
                  <button  onClick={() => actSelesai()} className="text-sm font-medium  text-green-500  flex items-center justify-center transition-transform">
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
  );
}