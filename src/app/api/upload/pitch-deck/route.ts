import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Get founder profile ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: founderProfile } = await supabase
    .from("founder_profiles")
    .select("id")
    .eq("profile_id", profile.id)
    .single();

  if (!founderProfile) {
    return NextResponse.json(
      { error: "Founder profile not found" },
      { status: 404 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are accepted" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size must be under 20MB" },
      { status: 400 }
    );
  }

  const fileBuffer = await file.arrayBuffer();
  const fileName = `${crypto.randomUUID()}.pdf`;
  const storagePath = `${founderProfile.id}/${fileName}`;

  const { error } = await supabase.storage
    .from("pitch-decks")
    .upload(storagePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    path: storagePath,
    filename: file.name,
  });
}
