// Projects aren't database-backed (no admin CRUD, no schema table exists for
// them per backend-specification.md) — they're hand-authored here, per
// projects-specification.md §4.4's recommended case-study structure.
// Content-authenticity rule (homepage-specification.md §9): no fabricated
// projects. This starts empty — add real projects as they're written up.
//
// NOTE: blog-admin-specification.md §3.2 wants an article to optionally link
// to a "companion project," reciprocally. There's no field wiring that up
// yet on either side (see the Phase 5 open-items memory) — decide the shape
// (a `relatedPostSlug` here, a `related_project_slug` column on `posts`)
// before adding the first project that should link to an article.

export type Project = {
  slug: string;
  name: string;
  shortDescription: string;
  featured: boolean;
  problem: string;
  goals: string;
  solution: string;
  role: string;
  techStack: string[];
  architecture: string;
  frontend: string;
  backend: string;
  database: string;
  challenges: string;
  technicalDecisions: string;
  results: string;
  lessonsLearned: string;
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [];

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getOtherProjects(): Project[] {
  return projects.filter((project) => !project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
