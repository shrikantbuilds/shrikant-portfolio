# Personal portfolio

A multi-page software developer portfolio with a fixed sidebar, dark navy UI, and live content from Supabase. Edit everything at `/admin`. Host on Netlify Free.

Seed SQL and preview fallbacks use **dummy** placeholder content. Replace it in Admin after setup.

No credit card. The free subdomain is `your-site.netlify.app`.

## Run it locally

Use Node 22.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without Supabase keys the site shows starter copy and a preview banner. Admin explains what is missing.

## 1. Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [supabase/migrations/20261110120000_init.sql](supabase/migrations/20261110120000_init.sql).
3. Authentication → Providers → Email. Enable magic link / OTP. After your first login, turn **off** “Allow new users to sign up”.
4. Authentication → URL configuration. Add `http://localhost:3000/admin` and, later, `https://your-site.netlify.app/admin` as redirect URLs.
5. Project Settings → API. Copy the project URL and the `anon` / publishable key into `.env.local`.

Do not copy the service role key into this app. The anon key is enough. Row Level Security blocks writes from everyone except the admin.

Admin login is email-link only. The first account that opens the link claims the empty `admins` table.

## 2. Web3Forms

Create a free access key at [web3forms.com](https://web3forms.com) and set `NEXT_PUBLIC_WEB3FORMS_KEY`. The key is meant to be public.

## 3. GitHub stats

Set `GITHUB_USERNAME` to your public GitHub username. `/api/github-stats` reads the public profile and caches it for an hour. No token.

## 4. Netlify

1. Push the repo to GitHub.
2. New site from Git → this repo. Netlify detects Next.js. [netlify.toml](netlify.toml) pins Node 22.
3. Site settings → Environment variables. Add the same four values as `.env.local`.
4. Deploy. Open `/admin` on the live URL and sign in.

Public pages are cached for about 60 seconds, so a save shows up on the next refresh cycle and a quiet site does not spend the free credit allowance on every visit. If the credits run out, Netlify pauses the site until the next month. It does not charge you.

## 5. Keep the database awake

Free Supabase projects pause after about a week with almost no queries. [.github/workflows/keepalive.yml](.github/workflows/keepalive.yml) reads the settings row twice a week.

Add repository secrets:

- `SUPABASE_URL` — the same project URL
- `SUPABASE_ANON_KEY` — the anon key

## What you can edit

Settings, about, resume PDF, projects, system designs, experience, skills, and blog posts. Images and the PDF go to the public `media` storage bucket. Only the admin can upload. Visitors can read published rows and those files.
