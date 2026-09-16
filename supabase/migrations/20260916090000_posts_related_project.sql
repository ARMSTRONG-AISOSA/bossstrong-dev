-- Related Content (blog-admin-specification.md §3.2, Governing Principle 2):
-- an article can optionally link to a companion project. Projects aren't
-- database-backed (they live in lib/data/projects.ts as a static file), so
-- this can't be a real foreign key — it's a plain nullable slug, validated
-- at the application layer (the post editor only offers a dropdown of real
-- project slugs, so a dangling/typo'd value can't be entered).
alter table posts
  add column related_project_slug text;
