import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/data/projects";

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
  return { title: project?.name ?? "Project" };
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

  const linkButtons = (project.liveUrl || project.repoUrl) && (
    <div className="flex flex-wrap items-center gap-3 text-small">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Live App
        </a>
      ) : null}
      {project.repoUrl ? (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border px-4 py-2 font-medium text-text-primary transition-colors hover:bg-surface-alt"
        >
          GitHub Repo
        </a>
      ) : null}
    </div>
  );

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

      {linkButtons ? (
        <div className="mt-10 border-t border-border pt-6">{linkButtons}</div>
      ) : null}
    </main>
  );
}
