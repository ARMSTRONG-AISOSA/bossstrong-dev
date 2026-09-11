import Link from "next/link";
import type { Project } from "@/lib/data/projects";

// projects-specification.md §4.2/§4.3: name, short description, tech used,
// link to the case study — concise here, deep narrative lives on the
// project's own page.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
    >
      <h3 className="text-h3 font-semibold text-text-primary transition-colors group-hover:text-accent">
        {project.name}
      </h3>
      <p className="text-body text-text-secondary">
        {project.shortDescription}
      </p>
      {project.techStack.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-1.5">
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
    </Link>
  );
}
