"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactSchema,
  type ContactValues,
} from "@/lib/validation/contact-schema";
import { submitContactForm } from "@/app/(public)/contact/actions";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (values: ContactValues) => {
    setFormError(null);
    startTransition(async () => {
      const result = await submitContactForm(values);
      if ("error" in result && result.error) {
        setFormError(result.error);
      } else {
        setIsSubmitted(true);
        reset();
      }
    });
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="rounded-md border border-border bg-surface px-6 py-8 text-center"
      >
        <p className="text-body font-medium text-text-primary">
          Thanks — your message has been sent.
        </p>
        <p className="mt-1 text-small text-text-secondary">
          I&apos;ll get back to you as soon as I can.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name ? (
          <p className="text-tiny text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-tiny text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" {...register("subject")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-tiny text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      {/* Honeypot — visually hidden via CSS, never type="hidden" (some bots
          skip it), never shown or focusable for real visitors. */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {formError ? (
        <p role="alert" className="text-small text-destructive">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="mt-1 self-start"
      >
        {isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
