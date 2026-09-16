import type { Metadata } from "next";
import Link from "next/link";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";
import { ShareButton } from "@/components/shared/share-button";
import { GithubIcon } from "@/components/shared/brand-icons";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return buildMetadata({
    title: project.name,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
  });
}

// projects-specification.md §4.4's recommended case-study structure —
// Overview → Problem → Goals → Solution → Architecture → Frontend →
// Backend → Database → Challenges → Technical Decisions → Results →
// Lessons Learned → Links.
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();
  // A `const` re-binding so TS's narrowing survives inside the closure
  // below — narrowing from the `notFound()` guard above doesn't carry into
  // a nested function referencing the original `project` binding.
  const proj = project;

  const sections: { heading: string; body: string }[] = [
    { heading: "Problem", body: project.problem },
    { heading: "Goals", body: project.goals },
    { heading: "Solution", body: project.solution },
    { heading: "Architecture", body: project.architecture },
    { heading: "Frontend", body: project.frontend },
    { heading: "Backend", body: project.backend },
    { heading: "Database", body: project.database },
    { heading: "Challenges", body: project.challenges },
    { heading: "Technical Decisions", body: project.technicalDecisions },
    { heading: "Results", body: project.results },
    { heading: "Lessons Learned", body: project.lessonsLearned },
  ];

  // Share only appears in the bottom occurrence of this row, not the one
  // right under the header — the owner asked for it specifically "at the
  // bottom of the page as the next button besides GitHub Repo."
  function renderLinkButtons(includeShare: boolean) {
    if (!proj.liveUrl && !proj.repoUrl && !includeShare) return null;
    return (
      <div className="flex flex-wrap items-center gap-3 text-small">
        {proj.liveUrl ? (
          <a
            href={proj.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            Live App
          </a>
        ) : null}
        {proj.repoUrl ? (
          <a
            href={proj.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-medium text-text-primary transition-colors hover:bg-surface-alt"
          >
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
            GitHub Repo
          </a>
        ) : null}
        {includeShare ? (
          <ShareButton
            url={`${SITE_URL}/projects/${proj.slug}`}
            title={proj.name}
            variant="outline"
          />
        ) : null}
      </div>
    );
  }

  const linkButtons = renderLinkButtons(false);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/projects"
        className="text-small font-medium text-text-secondary underline underline-offset-2 hover:text-text-primary"
      >
        ← All Projects
      </Link>

      <header className="mt-6 flex flex-col gap-4">
        <h1 className="text-h1 font-semibold text-text-primary">
          {project.name}
        </h1>
        <p className="text-body-lg text-text-secondary">
          {project.shortDescription}
        </p>
        <p className="text-small text-text-secondary">
          <span className="font-medium text-text-primary">Role:</span>{" "}
          {project.role}
        </p>
        {project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-surface-alt px-2.5 py-0.5 text-tiny text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
        {linkButtons}
      </header>

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-h3 font-semibold text-text-primary">
              {section.heading}
            </h2>
            <p className="mt-2 text-body text-text-secondary">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 border-t border-border pt-6">
        {renderLinkButtons(true)}
      </div>
    </main>
  );
}
