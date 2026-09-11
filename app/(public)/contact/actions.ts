"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import {
  contactSchema,
  type ContactValues,
} from "@/lib/validation/contact-schema";

// backend-specification.md §6.1: validate → honeypot check → atomic
// rate-limit-and-insert RPC → best-effort email notification. A failed
// email send never blocks the saved submission or surfaces as an error.
export async function submitContactForm(
  values: ContactValues,
): Promise<{ error?: string } | { success: true }> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields." };
  }

  // Honeypot: report success without actually processing anything, so a
  // bot never learns its submission was rejected (§6.2).
  if (parsed.data.website) {
    return { success: true };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_contact_message", {
    p_name: parsed.data.name,
    p_email: parsed.data.email,
    p_subject: parsed.data.subject || null,
    p_message: parsed.data.message,
    p_ip: ip,
  });

  if (error) {
    if (error.message.includes("rate_limit_exceeded")) {
      return {
        error: "You've sent a few messages recently — please try again later.",
      };
    }
    return { error: "Could not send your message. Please try again." };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (resendApiKey && toEmail) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: toEmail,
        subject: `New contact form message${parsed.data.subject ? `: ${parsed.data.subject}` : ""}`,
        text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
      });
    } catch (emailError) {
      console.error("Failed to send contact notification email", emailError);
    }
  }

  return { success: true };
}
