-- Supabase Storage: Bucket für generierte Instagram-Post-Assets. Öffentlich
-- lesbar (damit der Download-Link im Admin-Bereich direkt funktioniert),
-- Schreibzugriff nur für Admins.
insert into storage.buckets (id, name, public)
values ('instagram-posts', 'instagram-posts', true)
on conflict (id) do nothing;

create policy instagram_posts_bucket_public_read
  on storage.objects for select
  using (bucket_id = 'instagram-posts');

create policy instagram_posts_bucket_admin_write
  on storage.objects for insert
  with check (bucket_id = 'instagram-posts' and public.is_admin());

create policy instagram_posts_bucket_admin_delete
  on storage.objects for delete
  using (bucket_id = 'instagram-posts' and public.is_admin());
