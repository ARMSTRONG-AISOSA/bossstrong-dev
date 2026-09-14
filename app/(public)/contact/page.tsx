import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactIconLinks } from "@/components/shared/contact-icon-links";
import { CONTACT_LINKS } from "@/lib/data/contact-links";

export const metadata: Metadata = {
  title: "Contact",
};

// contact-specification.md §3-4. Real links come from lib/data/contact-links
// and are omitted until supplied — never fabricated (§6.3,
// homepage-specification.md §9). "Direct Contact" (§4.3) = email/WhatsApp,
// "Elsewhere" / Social-Professional Links (§4.4) = GitHub/LinkedIn.
const hasDirectLink = CONTACT_LINKS.some(
  (link) => (link.id === "email" || link.id === "whatsapp") && link.href,
);
const hasProfileLink = CONTACT_LINKS.some(
  (link) => (link.id === "github" || link.id === "linkedin") && link.href,
);
export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="max-w-xl">
        <h1 className="text-h1 font-semibold text-text-primary">Contact</h1>
        <p className="mt-3 text-body-lg text-text-secondary">
          I&apos;m always interested in hearing about interesting technical
          problems, collaboration opportunities, or roles where I can contribute
          as a full-stack engineer. Send a message below and I&apos;ll get back
          to you.
        </p>
      </div>

      <div className="mt-10">
        <ContactForm />
      </div>

      <div className="mt-12 grid gap-8 border-t border-border pt-10 sm:grid-cols-2">
        <section>
          <h2 className="text-h3 font-semibold text-text-primary">
            Direct Contact
          </h2>
          {hasDirectLink ? (
            <ContactIconLinks ids={["email", "whatsapp"]} className="mt-3" />
          ) : (
            <p className="mt-2 text-small text-text-secondary">
              A direct email address will be added here soon — for now, the form
              above is the fastest way to reach me.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary">Elsewhere</h2>
          {hasProfileLink ? (
            <ContactIconLinks ids={["github", "linkedin"]} className="mt-3" />
          ) : (
            <p className="mt-2 text-small text-text-secondary">
              Professional profile links will be added here soon.
            </p>
          )}
        </section>

        <section className="sm:col-span-2">
          <h2 className="text-h3 font-semibold text-text-primary">
            Availability
          </h2>
          <p className="mt-2 text-small text-text-secondary">
            Current availability details are being finalized — reach out through
            the form above and I&apos;ll let you know what fits.
          </p>
        </section>
      </div>
    </main>
  );
}
