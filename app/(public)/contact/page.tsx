import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
};

// contact-specification.md §3-4. Direct email and availability wording are
// placeholders until the real information is supplied — never fabricated
// (§6.3, homepage-specification.md §9). GitHub is the one real link
// currently on file (see components/shared/site-footer.tsx); LinkedIn is
// omitted until a real profile URL exists.
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
          <p className="mt-2 text-small text-text-secondary">
            A direct email address will be added here soon — for now, the form
            above is the fastest way to reach me.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary">Elsewhere</h2>
          <p className="mt-2 text-small text-text-secondary">
            <a
              href="https://github.com/ARMSTRONG-AISOSA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              GitHub
            </a>
          </p>
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
