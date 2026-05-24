import { prisma } from "@/lib/prisma";

interface Inotif {
  pegawaiId: string
  title: string
  message: string
  sumber: "KP" | "KGB" | "CUTI"
  cutiId?: string | null
  idLaya?: string | null
  info?: string | null
}
export const _notif = async ({
  pegawaiId,
  title,
  message,
  sumber,
  cutiId,
  idLaya,
  info,
}: Inotif): Promise<boolean> => {
  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        sumber,
        info,

        pegawai: {
          connect: {
            id: pegawaiId,
          },
        },

        ...(cutiId && {
          cuti: {
            connect: {
              id: cutiId,
            },
          },
        }),

        ...(idLaya && {
          layanan: {
            connect: {
              idLaya,
            },
          },
        }),
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};