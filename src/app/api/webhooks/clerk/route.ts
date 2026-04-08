import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createAdminClient();

  if (evt.type === "user.created") {
    const { id, first_name, last_name, image_url } = evt.data;
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || "User";

    const { error } = await supabase.from("profiles").insert({
      clerk_user_id: id,
      full_name: fullName,
      avatar_url: image_url || null,
    });

    if (error) {
      console.error("Failed to create profile:", error);
      return new Response("Failed to create profile", { status: 500 });
    }
  }

  if (evt.type === "user.updated") {
    const { id, first_name, last_name, image_url } = evt.data;
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || "User";

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_user_id", id);

    if (error) {
      console.error("Failed to update profile:", error);
      return new Response("Failed to update profile", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
