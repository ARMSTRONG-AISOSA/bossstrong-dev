import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getFeaturedProjects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { buttonVariants } from "@/components/ui/button";
import { ContactIconLinks } from "@/components/shared/contact-icon-links";
import { CONTACT_LINKS } from "@/lib/data/contact-links";
import { buildMetadata, personJsonLd } from "@/lib/seo";
import { DEFAULT_TITLE } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: DEFAULT_TITLE,
  description:
    "I design and build complete web applications — frontend, backend, database, and deployment — with an emphasis on solving real problems, not just shipping interfaces.",
  path: "/",
  absoluteTitle: true,
});

const PERSON_SAME_AS = CONTACT_LINKS.filter(
  (link) => (link.id === "github" || link.id === "linkedin") && link.href,
).map((link) => link.href as string);

const SNAPSHOT_AREAS = [
  {
    name: "Frontend Development",
    body: "Building responsive, accessible interfaces with modern frameworks and a real design system, not just component libraries stitched together.",
  },
  {
    name: "Backend Development",
    body: "Writing server-side logic, business rules, and data validation that actually holds up under real usage, not just the happy path.",
  },
  {
    name: "APIs & Integrations",
    body: "Designing clear API contracts and integrating third-party services (auth, storage, email) without leaking their complexity into the rest of the app.",
  },
  {
    name: "Databases & Data",
    body: "Modeling schemas, relationships, and access rules deliberately — not just tables that happen to store the right fields.",
  },
  {
    name: "Deployment & Infrastructure",
    body: "Shipping and operating real applications: CI, environment configuration, and the operational details that make software actually usable in production.",
  },
];

const ENGINEERING_APPROACH = [
  "Start by understanding the actual problem, not the first solution that comes to mind.",
  "Plan the approach before writing code — what needs to exist, and why.",
  "Design an architecture that fits the problem's real complexity, not more.",
  "Choose technologies deliberately, weighing trade-offs rather than defaults.",
  "Build for maintainability — code that's easy to change is worth more than code that's clever.",
  "Validate assumptions and test the paths that actually matter.",
  "Deploy deliberately, with real attention to what happens after code ships.",
  "Iterate based on what's actually learned, not on habit.",
];

const TECH_STACK: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Rust", "C"],
  },
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "Vite",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "shadcn/ui",
      "WordPress",
      "Wix",
    ],
  },
  {
    group: "Backend",
    items: [
      "Next.js Server Actions",
      "Node.js",
      "Express.js",
      "NestJS",
      "Supabase",
      "Firebase",
    ],
  },
  { group: "Database", items: ["PostgreSQL", "MongoDB"] },
  {
    group: "Infrastructure / Deployment",
    items: ["Vercel", "Docker", "Linux", "GitHub Actions"],
  },
  {
    group: "Tools",
    items: [
      "Git",
      "GitHub",
      "npm",
      "Postman",
      "VS Code",
      "Notion",
      "Claude",
      "ChatGPT",
    ],
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const hasEnoughWriting = (count ?? 0) >= 2;

  const featuredProjects = getFeaturedProjects().slice(0, 3);

  return (
    <main>
      {/* Person schema (seo-specification.md §5) — placed once, on Home. */}
      <script type="application/ld+json">
        {JSON.stringify(personJsonLd(PERSON_SAME_AS))}
      </script>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
        <p className="text-small font-medium text-accent-text">
          Full-Stack Developer / Software Engineer
        </p>
        <h1 className="mt-3 text-hero font-semibold text-text-primary">
          Armstrong Omoregie
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-body-lg text-text-secondary">
          I design and build complete web applications — frontend, backend,
          database, and deployment — with an emphasis on solving real problems,
          not just shipping interfaces.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/projects" className={buttonVariants({ size: "lg" })}>
            View Projects
          </Link>
          <Link
            href="/blog"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Read the Blog
          </Link>
        </div>
      </section>

      {/* Engineering Snapshot */}
      <section className="border-t border-border bg-surface-alt/50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-h2 font-semibold text-text-primary">
            Engineering Snapshot
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SNAPSHOT_AREAS.map((area) => (
              <div
                key={area.name}
                className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-accent hover:shadow-md active:-translate-y-1 active:border-accent active:shadow-md dark:hover:bg-surface-alt dark:hover:shadow-none dark:active:bg-surface-alt dark:active:shadow-none"
              >
                <h3 className="text-body-lg font-semibold text-text-primary">
                  {area.name}
                </h3>
                <p className="mt-2 text-small text-text-secondary">
                  {area.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-h2 font-semibold text-text-primary">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-small font-medium text-accent-text underline underline-offset-2"
          >
            View all
          </Link>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="stagger-fade-in mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-md border border-border bg-surface px-6 py-10 text-center text-body text-text-secondary">
            Project write-ups are in progress — check back soon.
          </p>
        )}
      </section>

      {/* Engineering Approach */}
      <section className="border-t border-border bg-surface-alt/50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-h2 font-semibold text-text-primary">
            Engineering Approach
          </h2>
          <ol className="mt-6 flex flex-col gap-3">
            {ENGINEERING_APPROACH.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="text-small font-medium text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-body text-text-secondary">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-h2 font-semibold text-text-primary">
          Technical Stack
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {TECH_STACK.map((group) => (
            <div key={group.group}>
              <h3 className="text-small font-semibold text-text-secondary">
                {group.group}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-surface-alt px-3 py-1 text-small text-text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Writing */}
      <section className="border-t border-border bg-surface-alt/50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-baseline justify-between">
            <h2 className="text-h2 font-semibold text-text-primary">
              Selected Writing
            </h2>
            {hasEnoughWriting ? (
              <Link
                href="/blog"
                className="text-small font-medium text-accent-text underline underline-offset-2"
              >
                Read the blog
              </Link>
            ) : null}
          </div>
          {hasEnoughWriting ? (
            <RecentPosts />
          ) : (
            <p className="mt-6 rounded-md border border-border bg-surface px-6 py-10 text-center text-body text-text-secondary">
              Writing is coming soon.
            </p>
          )}
        </div>
      </section>

      {/* About / Experience Preview */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-h2 font-semibold text-text-primary">
          Behind the Work
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-body text-text-secondary">
          Currently a full-stack developer at Brand-Eng Solutions, building
          end-to-end web applications with TypeScript, React, Next.js, and a
          Supabase/PostgreSQL backend. Before that, several years of frontend
          development work — shipping client websites, translating designs into
          responsive UI, and moving from HTML/CSS into full-stack engineering
          along the way.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-small font-medium text-accent-text underline underline-offset-2"
        >
          Read the full story
        </Link>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border px-6 py-20 text-center">
        <h2 className="text-h2 font-semibold text-text-primary">
          Let&apos;s Build Something
        </h2>
        <p className="mx-auto mt-3 max-w-md text-body text-text-secondary">
          Open to full-stack roles, freelance work, and interesting technical
          collaborations.
        </p>
        <Link
          href="/contact"
          className={buttonVariants({ size: "lg", className: "mt-6" })}
        >
          Get in Touch
        </Link>
        <ContactIconLinks
          ids={["github", "linkedin", "email", "whatsapp"]}
          className="mt-6 justify-center"
        />
      </section>
    </main>
  );
}

async function RecentPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("slug, title, excerpt")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="mt-6 flex flex-col divide-y divide-border">
      {(data ?? []).map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group py-4 first:pt-0"
        >
          <h3 className="text-body-lg font-semibold text-text-primary transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="mt-1 text-small text-text-secondary">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}
