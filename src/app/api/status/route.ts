import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "kim-biseo",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
