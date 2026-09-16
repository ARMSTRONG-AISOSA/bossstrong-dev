"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  XIcon,
} from "@/components/shared/brand-icons";

// Instagram has no public web share-intent URL for an arbitrary link (unlike
// X/LinkedIn/WhatsApp/Facebook) — it's deliberately not link-based, so it's
// left out rather than faked with a dead/misleading link.
function shareTargets(url: string, title: string) {
  return [
    {
      id: "x",
      label: "X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: WhatsappIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];
}

export function ShareButton({
  url,
  title,
  variant = "primary",
  className,
}: {
  url: string;
  title: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the share-intent
      // links below still work, so this just silently no-ops.
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium transition-colors",
          variant === "primary"
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "border border-border text-text-primary hover:bg-surface-alt",
          className,
        )}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top" align="end" sideOffset={8}>
          <Popover.Popup className="w-52 rounded-lg border border-border bg-surface p-1.5 text-small shadow-lg outline-none">
            <div className="flex flex-col">
              {shareTargets(url, title).map((target) => (
                <a
                  key={target.id}
                  href={target.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-text-primary transition-colors hover:bg-surface-alt"
                >
                  <target.icon className="h-4 w-4" aria-hidden="true" />
                  {target.label}
                </a>
              ))}
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-text-primary transition-colors hover:bg-surface-alt"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
