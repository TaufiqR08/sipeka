import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { Role } from "@/types";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        nip: { label: "NIP", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.nip || !credentials?.password) return null;

        const pegawai = await prisma.pegawai.findUnique({
          where: { nip: credentials.nip },
          include: { user: true },
        });

        if (!pegawai || !pegawai.user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          pegawai.user.password
        );

        if (!passwordMatch) return null;

        return {
          id: pegawai.user.id,
          email: pegawai.user.email,
          nip: pegawai.nip,
          role: pegawai.user.role as Role,
          nama: pegawai.nama,
          bidangId: pegawai.bidangId, // ✅ FIX: konsisten
          pegawaiId: pegawai.id,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.nama = (user as any).nama;
        token.nip  = (user as any).nip;
        token.bidangId = (user as any).bidangId;
        token.pegawaiId = (user as any).pegawaiId;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id       = token.sub!;
        (session.user as any).role     = token.role;
        (session.user as any).nama     = token.nama;
        (session.user as any).nip      = token.nip;
        (session.user as any).bidangId  = token.bidangId;
        (session.user as any).pegawaiId = token.pegawaiId;
      }

      return session;
    },
  },
};