"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDokumenAction({
  dokumen,
}: {
  dokumen: any;
}) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(
    dokumen.status || "DIPROSES"
  );

  const [keterangan, setKeterangan] = useState(
    dokumen.keterangan || ""
  );

  const handleSave = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "/api/layanan/dokument/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: dokumen.id,
            status,
            keterangan,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      alert("Status dokumen berhasil diperbarui");

      router.refresh();

    } catch (err: any) {

      alert(err.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* STATUS */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Status Dokumen
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              w-full px-4 py-2 rounded-lg
              border border-gray-300
              focus:ring-2 focus:ring-blue-500
              focus:border-blue-500
              outline-none
            "
          >
            <option value="DIPROSES">
              DIPROSES
            </option> 
            <option value="DISETUJUI">
              DISETUJUI
            </option>

            <option value="DITOLAK">
              DITOLAK
            </option>
          </select>
        </div>

        {/* KETERANGAN */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Keterangan Admin
          </label>

          <textarea
            rows={3}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Masukkan catatan admin..."
            className="
              w-full px-4 py-2 rounded-lg
              border border-gray-300
              focus:ring-2 focus:ring-blue-500
              focus:border-blue-500
              outline-none
              resize-none
            "
          />
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end mt-4">

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="
            px-5 py-2 rounded-lg
            bg-blue-600 text-white
            hover:bg-blue-700
            transition-all
            flex items-center gap-2
            disabled:opacity-50
          "
        >

          {loading ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Menyimpan...
            </>
          ) : (
            <>
              {status === "DITERIMA" ? (
                <CheckCircle size={16} />
              ) : status === "DITOLAK" ? (
                <XCircle size={16} />
              ) : null}

              Simpan Perubahan
            </>
          )}

        </button>
      </div>
    </div>
  );
}