import { NextResponse } from "next/server";
import { startNotifCron, noteNotifWaktu, noteNotifWaktuBrida } from "@/lib/cron/notifCron";

let started = false;

export async function GET() {
  if (!started) {
    startNotifCron();
    noteNotifWaktu();
    noteNotifWaktuBrida();
    started = true;
  }

  return NextResponse.json({
    success: true,
  });
}