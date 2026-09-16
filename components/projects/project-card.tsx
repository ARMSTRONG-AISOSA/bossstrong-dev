import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { GithubIcon } from "@/components/shared/brand-icons";
import type { Project } from "@/lib/data/projects";

const DESCRIPTION_LIMIT = 100;

function truncate(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}…`;
}

// projects-specification.md §4.2/§4.3: name, short description, tech used,
// link to the case study — concise here, deep narrative lives on the
// project's own page. Title, "Read more", Live App, and GitHub Repo are each
// their own Link/anchor (a link can't contain another link), rather than one
// link wrapping the whole card.
export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent">
      <Link
        href={href}
        className="text-h3 font-semibold text-text-primary transition-colors group-hover:text-accent"
      >
        {project.name}
      </Link>
      <p className="text-body text-text-secondary">
        {truncate(project.shortDescription, DESCRIPTION_LIMIT)}
      </p>
      <Link
        href={href}
        className="inline-flex w-fit items-center gap-1 text-small font-medium text-accent-text underline underline-offset-2"
      >
        Read more
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
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
      {project.liveUrl || project.repoUrl ? (
        <div className="flex flex-wrap gap-2 text-tiny">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-3 font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              Live App
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 font-medium text-text-primary transition-colors hover:bg-surface-alt"
            >
              <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub Repo
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
