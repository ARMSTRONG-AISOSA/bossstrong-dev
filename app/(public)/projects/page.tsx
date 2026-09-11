import type { Metadata } from "next";
import { getFeaturedProjects, getOtherProjects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/projects/project-card";

export const metadata: Metadata = {
  title: "Projects",
};

// projects-specification.md §3-4. No fabricated projects (§7) — an honest
// empty state until real work is written up, same pattern as Blog.
export default function ProjectsPage() {
  const featured = getFeaturedProjects();
  const other = getOtherProjects();
  const hasAnyProjects = featured.length > 0 || other.length > 0;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="max-w-xl">
        <h1 className="text-h1 font-semibold text-text-primary">Projects</h1>
        <p className="mt-3 text-body-lg text-text-secondary">
          Real full-stack work — frontend, backend, database design, and
          deployment, end to end.
        </p>
      </div>

      {!hasAnyProjects ? (
        <p className="mt-10 rounded-md border border-border bg-surface px-6 py-12 text-center text-body text-text-secondary">
          Project write-ups are in progress — check back soon.
        </p>
      ) : null}

      {featured.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-h3 font-semibold text-text-primary">
            Featured Projects
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      {other.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-h3 font-semibold text-text-primary">
            Other Projects
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {other.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
