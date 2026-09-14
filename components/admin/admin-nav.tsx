"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/admin/(dashboard)/actions";
import { cn } from "@/lib/utils";

// Nav completeness rule (blog-admin-specification.md §4.0): must link to
// every page under /admin. Add new admin pages here in the same change.
const ADMIN_LINKS = [
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/resume", label: "Resume" },
];

// Denser, neutral, utilitarian register — never the public marketing nav
// styling (ui-design-system-specification.md §9). Hover/active use the same
// accent-green + brightest-text language as the public nav, but as instant
// state changes (no transition-colors, no animated underline) — §7.4/§9
// lock admin motion to instant-only, not decorative.
export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="text-small font-semibold text-text-primary">
            Admin
          </span>
          <nav aria-label="Admin" className="flex items-center gap-1">
            {ADMIN_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-small font-medium hover:bg-surface-alt hover:text-accent",
                    active ? "text-text-primary" : "text-text-secondary",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
