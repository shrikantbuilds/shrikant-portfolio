-- Shrikant OS content model.
-- Run this once in the Supabase SQL editor.
-- The anon key can read published rows. Writes require the admin user.
-- The first signed-in user can claim the empty admins table. Disable public sign-up
-- in Authentication settings so a stranger cannot get there first.
-- Tables are created before functions that reference them (avoids 42P01).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

create or replace function public.admins_exist()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins);
$$;

create table public.site_settings (
  id integer primary key check (id = 1),
  name text not null default '',
  role_line text not null default '',
  headline text not null default '',
  intro text not null default '',
  location text not null default '',
  about_md text not null default '',
  interests text[] not null default '{}',
  github_url text not null default '',
  linkedin_url text not null default '',
  email text not null default '',
  resume_path text not null default '',
  photo_path text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  trash_md text not null default '',
  path_stops jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  summary text not null default '',
  role text not null default '',
  year text not null default '',
  category text not null default '',
  stack text[] not null default '{}',
  cover_path text not null default '',
  gallery text[] not null default '{}',
  body_md text not null default '',
  live_url text not null default '',
  github_url text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.system_designs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  summary text not null default '',
  diagram_path text not null default '',
  body_md text not null default '',
  tradeoffs_md text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint system_designs_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  role_title text not null default '',
  org text not null default '',
  start_label text not null default '',
  end_label text not null default '',
  summary text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  usage text not null default '',
  project_slugs text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  excerpt text not null default '',
  cover_path text not null default '',
  body_md text not null default '',
  tags text[] not null default '{}',
  seo_title text not null default '',
  seo_description text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  alt text not null default '',
  kind text not null default 'image' check (kind in ('image', 'pdf')),
  created_at timestamptz not null default now()
);

create trigger site_settings_updated
before update on public.site_settings
for each row execute function public.set_updated_at();

create trigger projects_updated
before update on public.projects
for each row execute function public.set_updated_at();

create trigger system_designs_updated
before update on public.system_designs
for each row execute function public.set_updated_at();

create trigger experience_updated
before update on public.experience
for each row execute function public.set_updated_at();

create trigger skills_updated
before update on public.skills
for each row execute function public.set_updated_at();

create trigger posts_updated
before update on public.posts
for each row execute function public.set_updated_at();

alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.system_designs enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.posts enable row level security;
alter table public.media enable row level security;

create policy admins_select_self
on public.admins
for select
to authenticated
using (user_id = auth.uid());

create policy admins_bootstrap
on public.admins
for insert
to authenticated
with check (user_id = auth.uid() and not public.admins_exist());

create policy settings_read
on public.site_settings
for select
to anon, authenticated
using (true);

create policy settings_insert
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

create policy settings_update
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

do $$
declare
  t text;
begin
  foreach t in array array['projects', 'system_designs', 'experience', 'skills', 'posts']
  loop
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (published = true)',
      t || '_public_read',
      t
    );
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin())',
      t || '_admin_read',
      t
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin())',
      t || '_admin_insert',
      t
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_admin_update',
      t
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin())',
      t || '_admin_delete',
      t
    );
  end loop;
end $$;

create policy media_read
on public.media
for select
to anon, authenticated
using (true);

create policy media_insert
on public.media
for insert
to authenticated
with check (public.is_admin());

create policy media_delete
on public.media
for delete
to authenticated
using (public.is_admin());

grant select on public.site_settings, public.projects, public.system_designs,
  public.experience, public.skills, public.posts, public.media
  to anon, authenticated;

grant insert, update, delete on public.projects, public.system_designs,
  public.experience, public.skills, public.posts, public.media
  to authenticated;

grant insert, update on public.site_settings to authenticated;
grant select, insert on public.admins to authenticated;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy media_objects_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media');

create policy media_objects_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media' and public.is_admin());

create policy media_objects_update
on storage.objects
for update
to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

create policy media_objects_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'media' and public.is_admin());

-- Seed rows below are DUMMY placeholders for a fresh project.
-- Replace everything in Admin after setup. Do not put real employer or personal details here.
insert into public.site_settings (
  id, name, role_line, headline, intro, location, about_md, interests,
  seo_title, seo_description, trash_md, path_stops
) values (
  1,
  'Alex Rivera',
  'Software Developer',
  'Building reliable software for real users.',
  'Demo intro text. Replace this with your own short introduction in Admin.',
  'Remote',
  $about$This is placeholder About copy for a new portfolio install.

Write your own story in Admin. Keep anything confidential out of the public pages.$about$,
  array['Learning', 'Open source', 'Coffee'],
  'Alex Rivera · Software Developer',
  'Demo portfolio description. Replace in Admin.',
  $trash$Internal notes placeholder. Safe to delete or rewrite in Admin.$trash$,
  '[
    {"label":"Role one","detail":"2023 – 2024","href":"/experience"},
    {"label":"Role two","detail":"2024 – Now","href":"/experience"},
    {"label":"About","detail":"More context","href":"/about"}
  ]'::jsonb
);

insert into public.projects (
  id, slug, title, summary, role, year, category, stack, body_md, sort_order, published
) values (
  'a0000000-0000-4000-8000-000000000001',
  'sample-platform',
  'Sample Platform',
  'A fictional sample project used to demo the portfolio layout. Replace in Admin.',
  'Developer',
  '2024',
  'Platform',
  array['TypeScript', 'PostgreSQL', 'Docker'],
  $project$Sample Platform is demo content only.

## Highlights

- Example feature one
- Example feature two
- Example integration

Replace this write-up with a project you can publish.$project$,
  1,
  true
);

insert into public.system_designs (
  id, slug, title, summary, body_md, tradeoffs_md, sort_order, published
) values (
  'a0000000-0000-4000-8000-000000000002',
  'sample-architecture',
  'Sample architecture',
  'Dummy architecture note for first-run demos. Replace in Admin.',
  $design$A simple public sketch of a sample system.

## Pieces

- Client app
- API layer
- Database
- Metrics

Rewrite with a design you are allowed to share.$design$,
  $trade$Keep the demo honest: prefer clear signals over a busy diagram.$trade$,
  1,
  true
);

insert into public.experience (id, role_title, org, start_label, end_label, summary, sort_order, published)
values
  (
    'a0000000-0000-4000-8000-000000000011',
    'Software Developer',
    'Demo Company',
    '2024',
    'Now',
    'Dummy experience row. Replace with your real role summary in Admin.',
    1,
    true
  ),
  (
    'a0000000-0000-4000-8000-000000000012',
    'Intern',
    'Demo Company',
    '2023',
    '2024',
    'Dummy internship row. Replace in Admin.',
    2,
    true
  ),
  (
    'a0000000-0000-4000-8000-000000000013',
    'B.E. in Computer Engineering',
    'Demo University',
    '2019',
    '2023',
    'Dummy education row. Replace in Admin.',
    3,
    true
  );

insert into public.skills (id, name, usage, project_slugs, sort_order, published)
values
  (
    'a0000000-0000-4000-8000-000000000021',
    'Backend development',
    'Used on the sample platform demo project.',
    array['sample-platform'],
    1,
    true
  ),
  (
    'a0000000-0000-4000-8000-000000000022',
    'System design',
    'Outlined the sample architecture note.',
    array['sample-platform'],
    2,
    true
  ),
  (
    'a0000000-0000-4000-8000-000000000023',
    'Observability',
    'Demo dashboards for the sample platform.',
    array['sample-platform'],
    3,
    true
  ),
  (
    'a0000000-0000-4000-8000-000000000024',
    'DevOps and delivery',
    'Dummy delivery notes for the sample platform.',
    array['sample-platform'],
    4,
    true
  );

insert into public.posts (
  id, slug, title, excerpt, body_md, tags, seo_title, seo_description, published, published_at
) values (
  'a0000000-0000-4000-8000-000000000031',
  'welcome-to-the-portfolio',
  'Welcome to the portfolio',
  'A short dummy post so the Blog page is not empty on first run.',
  $post$This is placeholder blog content.

Edit or delete it in Admin and publish your own notes.$post$,
  array['portfolio', 'notes'],
  'Welcome to the portfolio',
  'Dummy blog post for first-run demos.',
  true,
  now()
);
