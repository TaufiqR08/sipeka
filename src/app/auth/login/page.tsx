"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Loader, ShieldCheck, User, Lock, ChevronDown, ChevronUp } from "lucide-react";

export default function LoginPage() {
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        nip,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("NIP atau password salah. Silakan coba lagi.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (nip: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        nip,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        setError("Demo login gagal. Silakan cek database.");
      }
    } catch (err) {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at top right, #1e3a8a, #1e3a8a, #0f172a)",
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Logo & Header outside card for more modern feel */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L3 7l9 5 9-5-9-5z" />
                <path d="M3 17l9 5 9-5" />
                <path d="M3 12l9 5 9-5" />
              </svg>
            </div>
            <span className="ml-3 text-2xl font-bold text-white tracking-tight">SIPEKA</span>
          </div>
          <p className="text-blue-200/80 text-sm font-medium tracking-wide uppercase">
            Sistem Informasi Kepegawaian
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slideUp">
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Selamat Datang</h1>
              <p className="text-slate-500 text-sm">
                Masuk untuk mengakses dasbor kepegawaian Anda.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  NIP
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan NIP Anda"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Ingat saya</span>
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading || !nip || !password}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Masuk ke Sistem</span>
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Opsi Lain</span>
              </div>
            </div>

            {/* Demo Access - More tidy version */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full px-5 py-4 flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-amber-500" />
                  <span className="text-sm font-bold">Akses Cepat (Demo)</span>
                </div>
                {showDemo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {showDemo && (
                <div className="px-5 pb-5 space-y-3 animate-fadeIn">
                  <button
                    onClick={() => handleDemoLogin("197805122008121001", "admin123")}
                    disabled={loading}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-amber-600">Kepala Badan</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold tracking-tighter">Admin</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">NIP: 197805122008121001</p>
                  </button>

                  <button
                    onClick={() => handleDemoLogin("198203102010121002", "admin123")}
                    disabled={loading}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-amber-600">Kabag Umum</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold tracking-tighter">Manajerial</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">NIP: 198203102010121002</p>
                  </button>

                  <button
                    onClick={() => handleDemoLogin("199001152015122004", "admin123")}
                    disabled={loading}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-amber-600">Pegawai</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold tracking-tighter">Staff</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">NIP: 199001152015122004</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-2 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <p className="text-blue-100/60 text-sm font-medium">
            Dinas Kesatuan Bangsa dan Politik
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-blue-100/40">
            <span>Sumbawa Barat &copy; 2026</span>
            <span className="w-1 h-1 bg-blue-100/20 rounded-full"></span>
            <span>Versi 1.0</span>
          </div>
        </div>
      </div>

    </div>
  );
}
