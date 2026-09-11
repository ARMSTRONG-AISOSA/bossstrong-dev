-- Storage buckets and policies (backend-specification.md §5).
-- Uses the real admin UID (99e3ce55-500e-474b-bf26-0bd098c38a67) — see the RLS migration.

-- post-images: 3MB limit + MIME allowlist enforced at the bucket level (§5.1) —
-- this is the real gate, not just client-side validation.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  3145728, -- 3MB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- resume-files: 2MB, PDF only, fixed-filename upsert convention (§5.2) —
-- enforced entirely by this bucket config + application code, no DB table.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resume-files',
  'resume-files',
  true,
  2097152, -- 2MB
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- post-images policies
create policy "Public can view post images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'post-images');

create policy "Admin can upload post images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'post-images' and auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');

create policy "Admin can delete post images"
on storage.objects for delete
to authenticated
using (bucket_id = 'post-images' and auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');

-- resume-files policies
create policy "Public can view resume"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'resume-files');

create policy "Admin can upload or replace resume"
on storage.objects for insert
to authenticated
with check (bucket_id = 'resume-files' and auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');

create policy "Admin can update resume"
on storage.objects for update
to authenticated
using (bucket_id = 'resume-files' and auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');

create policy "Admin can delete resume"
on storage.objects for delete
to authenticated
using (bucket_id = 'resume-files' and auth.uid() = '99e3ce55-500e-474b-bf26-0bd098c38a67');
