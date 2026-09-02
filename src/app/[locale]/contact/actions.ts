"use server";

export type ContactState = { status: "idle" | "success" | "error" };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    locale: String(formData.get("locale") ?? ""),
    submittedAt: new Date().toISOString(),
  };

  if (!payload.name || !payload.email || !payload.message) return { status: "error" };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    console.info("[contact] submission (no CONTACT_WEBHOOK_URL configured)", payload);
    return { status: "success" };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { status: res.ok ? "success" : "error" };
  } catch {
    return { status: "error" };
  }
}
