-- categories (backend-specification.md §2.1)

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Seeded with a fixed, well-known id (not gen_random_uuid()) so posts.category_id
-- can default to it deterministically in the same migration set (see
-- 20260911060002_posts.sql) without a follow-up lookup step.
insert into categories (id, name, slug)
values ('00000000-0000-0000-0000-000000000001', 'Uncategorized', 'uncategorized')
on conflict (id) do nothing;

-- The Uncategorized category must never be deletable (§3.3) — enforced here at
-- the database level, not just as an admin-UI convention.
create or replace function prevent_uncategorized_delete()
returns trigger
language plpgsql
as $$
begin
  if old.slug = 'uncategorized' then
    raise exception 'The Uncategorized category cannot be deleted';
  end if;
  return old;
end;
$$;

drop trigger if exists categories_protect_uncategorized on categories;
create trigger categories_protect_uncategorized
before delete on categories
for each row execute function prevent_uncategorized_delete();
