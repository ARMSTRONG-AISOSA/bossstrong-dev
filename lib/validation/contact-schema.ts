import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  // Honeypot (backend-specification.md §6.2) — real visitors never see or
  // fill this field; a bot that does gets silently discarded.
  website: z.string().optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
