import { NextResponse } from "next/server";
import { startNotifCron, noteNotifWaktu} from "@/lib/cron/notifCron";

let started = false;

export async function GET() {
  startNotifCron();
  return NextResponse.json({
    success: true,
  });
}