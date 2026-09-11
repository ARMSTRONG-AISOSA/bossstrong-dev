import type { ReactNode } from "react";
import { PublicShell } from "@/components/shared/public-shell";
import { getResumeUrl } from "@/lib/resume-status";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const resumeUrl = await getResumeUrl();
  return <PublicShell resumeUrl={resumeUrl}>{children}</PublicShell>;
}
