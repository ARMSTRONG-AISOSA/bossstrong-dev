import type { Metadata } from "next";
import Link from "next/link";
import { getResumeUrl } from "@/lib/resume-status";

export const metadata: Metadata = {
  title: "About",
};

// about-specification.md §3-4. Content sourced from the owner's real CV
// (ArmstrongOmoregie-CV-15-09-2026.pdf) and their own account of their
// journey — nothing invented (§7, Claude Instructions #3).
const EXPERIENCE = [
  {
    company: "Brand-Eng Solutions",
    role: "Full-Stack Developer",
    dates: "April 2025 – Present",
    points: [
      "Shipped end-to-end web applications using TypeScript, React, and Next.js, helping small and medium businesses digitize and scale online to over 1,000 users.",
      "Designed relational database schemas in PostgreSQL and Supabase, implementing row-level security via Prisma ORM to manage over 200 unique items.",
      "Built server-side logic with Express.js and Firebase, including REST APIs with JWT authentication serving over 1,000 users.",
      "Containerized local development environments with Docker on Linux to keep local and server environments in parity.",
      "Converted Figma designs into modular, responsive frontend components with Tailwind CSS and Material UI.",
    ],
  },
  {
    company: "Spruce Creative Hub",
    role: "Frontend Developer & Digital Specialist",
    dates: "March 2023 – October 2024",
    points: [
      "Led frontend development for over 10 client websites using JavaScript, HTML5, and CSS3, prioritizing cross-browser compatibility.",
      "Integrated backend services and optimized data fetching and state handling to improve page load speed.",
      "Translated brand marketing requirements into functional web layouts, helping raise client conversion rates from 0.8% to 1.5%.",
      "Managed UI assets and visual layouts in Canva and Figma, bridging design concepts and working code.",
    ],
  },
  {
    company: "Youlead Africa",
    role: "Jr. Frontend Developer",
    dates: "May 2022 – March 2023",
    points: [
      "Maintained user-facing web platforms with semantic HTML5, CSS3, and JavaScript.",
      "Built responsive views and interactive forms that cut page load time by more than 50%.",
      "Took part in monthly technical scoping sessions, turning client feedback into functional UI updates.",
      "Ran cross-device testing and debugging, meaningfully speeding up client handoff versus prior baselines.",
    ],
  },
];

const SKILLS: [string, string][] = [
  ["Languages", "JavaScript, TypeScript, Python, Rust, C, HTML5, CSS3, SQL"],
  [
    "Frontend",
    "React, Next.js, React Native, Tailwind CSS, Bootstrap, Material UI, Responsive Design",
  ],
  ["Backend", "Express.js, Node.js, Firebase, Prisma ORM"],
  ["Databases", "PostgreSQL, Supabase, Relational Database Design"],
  ["APIs", "REST APIs, JWT Authentication"],
  [
    "DevOps / Deployment",
    "Docker, Linux (Mint/Debian), Vercel, GitHub Actions, CI/CD Baselines",
  ],
  ["Tools", "Git, GitHub, Figma, Canva, GIMP, Notion, Trello"],
];

export default async function AboutPage() {
  const resumeUrl = await getResumeUrl();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <section>
        <h1 className="text-h1 font-semibold text-text-primary">About</h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          I&apos;m Armstrong Omoregie, a full-stack developer working across
          TypeScript, React, and Next.js on the frontend, and Express.js,
          Firebase, PostgreSQL, and Supabase on the backend. I like taking a
          business problem all the way from a database schema to a working,
          responsive interface — and I&apos;m especially drawn to work where
          system design and data modeling matter as much as what the user
          actually sees.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">My Journey</h2>
        <p className="mt-3 text-body text-text-secondary">
          I studied Plant Biology and Biotechnology at the University of Benin,
          graduating in 2019. I enjoyed the course, but I&apos;d already become
          fascinated with computers — how they worked, and the software and
          programming side of them. In my final year, I bought an old HP
          EliteBook and started getting familiar with it. I was working
          full-time as a business developer/consultant at the time, and it
          wasn&apos;t until late 2021 that I actually started learning to code,
          beginning with HTML, CSS, and then JavaScript. By 2023 I had already
          been working as a frontend developer for a while, and I&apos;ve since
          moved into full-stack work, picking up backend, database design, and
          deployment along the way.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">Experience</h2>
        <div className="mt-3 flex flex-col gap-6 text-body text-text-secondary">
          {EXPERIENCE.map((job) => (
            <div key={job.company}>
              <p className="font-medium text-text-primary">
                {job.company} — {job.role} — {job.dates}
              </p>
              <ul className="mt-1 flex flex-col gap-1">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden="true">·</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">
          Engineering Philosophy
        </h2>
        <p className="mt-3 text-body text-text-secondary">
          I try to start from the actual data and business rules before writing
          any UI — a well-designed schema with the right constraints, like
          row-level security, prevents a lot of bugs before they can happen. I
          care more about code that&apos;s easy to change later than code
          that&apos;s merely clever. Cross-device testing and catching a layout
          bug myself before a client does isn&apos;t optional for me. I&apos;m
          comfortable picking up new tools when a problem actually calls for
          them — I went from plain HTML/CSS to a full
          TypeScript/React/Next.js/Supabase stack over a few years — but I
          don&apos;t reach for something new just because it&apos;s trendy.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-h2 font-semibold text-text-primary">
          Skills &amp; Technologies
        </h2>
        <dl className="mt-3 flex flex-col gap-3 text-body">
          {SKILLS.map(([label, value]) => (
            <div key={label} className="flex flex-col sm:flex-row sm:gap-3">
              <dt className="w-40 shrink-0 font-medium text-text-primary">
                {label}
              </dt>
              <dd className="text-text-secondary">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-primary px-6 py-3 text-small font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Download Resume
          </a>
        ) : (
          <span
            aria-disabled="true"
            title="Resume not available yet"
            className="cursor-not-allowed rounded-full border border-border px-6 py-3 text-small font-medium text-text-secondary opacity-50"
          >
            Resume not available yet
          </span>
        )}
        <Link
          href="/projects"
          className="rounded-full border border-border px-6 py-3 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
        >
          View Projects
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-border px-6 py-3 text-small font-medium text-text-primary transition-colors hover:bg-surface-alt"
        >
          Get in Touch
        </Link>
      </section>
    </main>
  );
}
