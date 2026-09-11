-- posts (backend-specification.md §2.2)

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  body text not null,
  cover_image_url text,
  cover_image_alt text,
  category_id uuid not null
    references categories(id)
    on delete set default
    default '00000000-0000-0000-0000-000000000001',
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Supports both "published posts by category" and the base "published posts"
-- listing query (§3.4).
create index if not exists idx_posts_status_category on posts (status, category_id);

-- updated_at moves on every ordinary edit; never spoofable from the client (§7).
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
before update on posts
for each row execute function set_updated_at();

-- published_at is set (or re-set) only on a transition INTO 'published'.
-- Editing a published post's content without changing status never touches it —
-- only updated_at moves. Unpublish/republish updates it again to the new time,
-- per the locked-in behavior in §2.2 (the original publish date is not
-- preserved across an unpublish/republish cycle).
create or replace function set_published_at_on_update()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and old.status is distinct from 'published' then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists posts_set_published_at_update on posts;
create trigger posts_set_published_at_update
before update on posts
for each row execute function set_published_at_on_update();

-- Same rule on insert, in case a post is ever created already-published.
create or replace function set_published_at_on_insert()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists posts_set_published_at_insert on posts;
create trigger posts_set_published_at_insert
before insert on posts
for each row execute function set_published_at_on_insert();
