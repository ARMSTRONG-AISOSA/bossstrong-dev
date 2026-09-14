export type ContactLinkId = "github" | "linkedin" | "email" | "whatsapp";

interface ContactLinkConfig {
  id: ContactLinkId;
  label: string;
  href: string | null;
}

// Real URLs only — no placeholder/guessed links, per homepage-specification.md
// §9 and CLAUDE.md rule 2. `href: null` means the link is omitted everywhere
// it's used until the owner supplies the real value.
// - email: full `mailto:you@example.com`
// - whatsapp: full `https://wa.me/<countrycode><number>` (no + or spaces)
export const CONTACT_LINKS: ContactLinkConfig[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/ARMSTRONG-AISOSA",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/armstrong-omoregie-02367a271/",
  },
  { id: "email", label: "Email", href: "mailto:ammycan6@gmail.com" },
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/2349095466063" },
];
