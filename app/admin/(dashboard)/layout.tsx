import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";

// Shared shell for every /admin page except /admin/login
// (blog-admin-specification.md §4.0).
export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
