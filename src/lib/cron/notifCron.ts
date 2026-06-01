import cron from "node-cron";
import { prisma } from "@/lib/prisma";

import { getRemainingDays, _notif } from "@/lib/sfBGS";
import { fitur } from "@prisma/client";

// Local type untuk hasil $queryRaw dari tabel pegawaii
interface PegawaiRaw {
  tglMasaKerja: Date | null;
  tmtGolongan: Date | null;
  noTelp: string | null;
}

interface Isend {
  target: string;
  message: string;
}

async function send({ message, target }: Isend): Promise<boolean> {
  try {
    const formData = new FormData();

    formData.append("target", `0${target}`);
    formData.append("message", message);
    formData.append("countryCode", "62");
    // console.log(message,target);

    const resp = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.WHATSAPP_TOKEN || "rGkDFJZnxeprGTKcV78S",
      },
      body: formData,
    });
    const result = await resp.json().catch(() => ({}));
    console.log("[Fonnte]", resp.status, result);
    if (!resp.ok || result?.status === false) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function execMSG({
  noTelp,
  title,
  message,
  id,
}: {
  noTelp: string;
  title: string;
  message: string;
  id: string;
}) {
  try {
    if (!noTelp) return;

    const resp = await send({
      message: `${title}\n${message}`,
      target: noTelp,
    });
    // console.log(resp);

    if (resp) {
      await prisma.notification.update({
        where: {
          id: id,
        },
        data: {
          send: true,
        },
      });

      console.log("Notif terkirim:", id);
    }
  } catch (error) {
    console.log("Error notif:", error);
  }
}

export async function startNotifCron() {
  cron.schedule("* * * * *", async () => {
    console.log("Cron notif berjalan...");

    try {
      const dmsg = await prisma.notification.findMany({
        where: {
          send: false,
        },
        include: {
          pegawai: true,
        },
        take: 10,
      });
      // console.log(dmsg);

      for (const v of dmsg) {
        if (v.sumber == "BRIDA") {
          await execMSG({ ...v, noTelp: v.info ?? "" })
        } else {
          await execMSG({ ...v, noTelp: v.pegawai?.noTelp ?? "" })
        }

      }
    } catch (error) {
      console.log("Cron error:", error);
    }
  });
}
function waktuNotif(hari: number): boolean {
  return [90, 60, 30, 21, 14, 7].includes(hari);
}

let startedKesbangpol= 2;
export function noteNotifWaktu() {
  cron.schedule("* * * * *", async () => {
    console.log("Cron notif berjalan...");

    const pegawai = await prisma.pegawai.findMany();

    for (const v of pegawai) {
      const kgb = getRemainingDays(v.tglMasaKerja ?? new Date(), 2);
      const kp = getRemainingDays(v.tmtGolongan ?? new Date(), 4);

      if (waktuNotif(kgb.remainingDays)|| startedKesbangpol >0) {
        // await _notif({
        //   title: `Warning !!!`,
        //   message: ` Batas pengajuan Kenaikan Gaji Berkala tersisa ${kgb.remainingDays} hari lagi.`,
        //   pegawaiId: v.id,
        //   sumber: "KGB",
        //   info: "WARNING",
        // }); 
        
        if(startedKesbangpol >0){  
          await _notif({
            title: `Warning !!!`,
            message: `Batas pengajuan pengajuan Gaji Berkala tersisa ${kp.remainingDays} hari lagi.`,
            pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
            sumber: fitur.BRIDA as any,
            info: startedKesbangpol >0 ?  "81339740052" : v.noTelp ?? "",
          });
        }else{
          await _notif({
            title: `Warning !!!`,
            message: ` Batas pengajuan Kenaikan Gaji Berkala tersisa ${kgb.remainingDays} hari lagi.`,
            pegawaiId: v.id,
            sumber: "KGB",
            info: "WARNING",
          });
        } 
        startedKesbangpol--;
      }

      if (waktuNotif(kp.remainingDays)|| startedKesbangpol >0) {
        // await _notif({
        //   title: `Warning !!!`,
        //   message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
        //   pegawaiId: v.id,
        //   sumber: "KP",
        //   info: "WARNING",
        // });
        if(startedKesbangpol >0){ 
          await _notif({
            title: `Warning !!!`,
            message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
            pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
            sumber: fitur.BRIDA as any,
            info: startedKesbangpol >0 ?  "81339740052" : v.noTelp ?? "",
          });
        }else{
          await _notif({
            title: `Warning !!!`,
            message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
            pegawaiId: v.id,
            sumber: "KP",
            info: "WARNING",
          });
        }  
        startedKesbangpol--;
      }
    }
  });
}

let startedBrida= 2;
export function noteNotifWaktuBrida() {
  cron.schedule("* * * * *", async () => {
    console.log("Cron notif Brida...");
    const pegawai = await prisma.Pegawaii.findMany();

    for (const v of pegawai) {
      const kgb = getRemainingDays(v.tglMasaKerja ?? new Date(), 2);
      const kp = getRemainingDays(v.tmtGolongan ?? new Date(), 4);

      if (waktuNotif(kgb.remainingDays) || startedBrida >0) {
        await _notif({
          title: `Warning !!!`,
          message: ` Batas pengajuan Kenaikan Gaji Berkala tersisa ${kgb.remainingDays} hari lagi.`,
          pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
          sumber: fitur.BRIDA as any,
          info: v.noTelp ?? "",
        });
        startedBrida--;
      }

      if (waktuNotif(kp.remainingDays)|| startedBrida >0) {
        await _notif({
          title: `Warning !!!`,
          message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
          pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
          sumber: fitur.BRIDA as any,
          info: v.noTelp ?? "",
        });
        startedBrida--;
      }
    }
  });
}