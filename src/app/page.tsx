import { redirect } from "next/navigation";

export default function Home() {
  // Middleware sudah handle auth check:
  // - Belum login → redirect ke /auth/login
  // - Sudah login → lanjut ke /dashboard
  redirect("/dashboard");
}

