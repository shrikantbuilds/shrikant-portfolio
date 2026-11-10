import { previewBundle, unavailableBundle } from "./fallback";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./supabase/env";
import type {
  DesktopBundle,
  ExperienceItem,
  Post,
  Project,
  SiteSettings,
  Skill,
  SystemDesign,
} from "./types";

/**
 * Public reads go through PostgREST with a 60 second cache.
 * The anon key is public. Writes are rejected by Row Level Security.
 * Caching keeps Netlify Free from spending a credit on every page view.
 */
async function rest<T>(query: string): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const response = await fetch(`${supabaseUrl()}/rest/v1/${query}`, {
      headers: {
        apikey: supabaseAnonKey(),
        Authorization: `Bearer ${supabaseAnonKey()}`,
      },
      next: { revalidate: 15 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function normalizeSettings(row: SiteSettings | undefined): SiteSettings {
  if (!row) return unavailableBundle.settings;
  return {
    ...unavailableBundle.settings,
    ...row,
    interests: asArray(row.interests),
    path_stops: asArray(row.path_stops),
  };
}

export async function loadBundle(): Promise<DesktopBundle> {
  if (!isSupabaseConfigured()) return previewBundle;

  const [settingsRows, projects, designs, experience, skills, posts] =
    await Promise.all([
      rest<SiteSettings[]>("site_settings?select=*&id=eq.1"),
      rest<Project[]>(
        "projects?select=*&published=eq.true&order=sort_order.asc",
      ),
      rest<SystemDesign[]>(
        "system_designs?select=*&published=eq.true&order=sort_order.asc",
      ),
      rest<ExperienceItem[]>(
        "experience?select=*&published=eq.true&order=sort_order.asc",
      ),
      rest<Skill[]>("skills?select=*&published=eq.true&order=sort_order.asc"),
      rest<Post[]>(
        "posts?select=*&published=eq.true&order=published_at.desc.nullslast",
      ),
    ]);

  if (!settingsRows || !projects || !designs || !experience || !skills || !posts) {
    return unavailableBundle;
  }

  return {
    source: "live",
    settings: normalizeSettings(settingsRows[0]),
    projects: projects.map((project) => ({
      ...project,
      stack: asArray(project.stack),
      gallery: asArray(project.gallery),
    })),
    designs,
    experience,
    skills: skills.map((skill) => ({
      ...skill,
      project_slugs: asArray(skill.project_slugs),
    })),
    posts: posts.map((post) => ({ ...post, tags: asArray(post.tags) })),
  };
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function findBySlug<T extends { slug: string }>(rows: T[], slug: string) {
  if (!SLUG.test(slug)) return null;
  return rows.find((row) => row.slug === slug) ?? null;
}
