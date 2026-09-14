import type { ComponentType, SVGProps } from "react";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_LINKS, type ContactLinkId } from "@/lib/data/contact-links";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "./brand-icons";

const ICONS: Record<ContactLinkId, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  whatsapp: WhatsappIcon,
};

// Renders only the requested ids that currently have a real href — an id
// with no link supplied yet is silently omitted, never a placeholder/dead
// link (CLAUDE.md rule 2).
export function ContactIconLinks({
  ids,
  className,
}: {
  ids: ContactLinkId[];
  className?: string;
}) {
  const links = CONTACT_LINKS.filter(
    (link) => ids.includes(link.id) && link.href,
  );

  if (links.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = ICONS[link.id];
        const external = link.id !== "email";
        return (
          <a
            key={link.id}
            href={link.href!}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            aria-label={link.label}
            className="rounded-full p-2 text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
