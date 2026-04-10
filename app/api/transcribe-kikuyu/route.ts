import { NextRequest, NextResponse } from "next/server";
import { transcribeKikuyu } from "@/lib/gooeyASR";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOEY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOEY_API_KEY" }, { status: 500 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const transcript = await transcribeKikuyu(audioFile, apiKey);
    return NextResponse.json({ transcript });

  } catch (error: any) {
    console.error("[Kikuyu ASR]", error.message);
    return NextResponse.json({ error: error.message || "Transcription failed" }, { status: 500 });
  }
}
