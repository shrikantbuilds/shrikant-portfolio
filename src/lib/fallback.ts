import type {
  DesktopBundle,
  ExperienceItem,
  Post,
  Project,
  SiteSettings,
  Skill,
  SystemDesign,
} from "./types";

const now = "2026-01-01T00:00:00.000Z";

export const emptySettings: SiteSettings = {
  id: 1,
  name: "Alex Rivera",
  role_line: "",
  headline: "Content is unavailable",
  intro:
    "The database did not respond. If this is a free Supabase project, open the dashboard and resume it.",
  location: "",
  about_md: "",
  interests: [],
  github_url: "",
  linkedin_url: "",
  email: "",
  resume_path: "",
  photo_path: "",
  seo_title: "Portfolio",
  seo_description: "Personal portfolio.",
  trash_md: "",
  path_stops: [],
  updated_at: now,
};

const settings: SiteSettings = {
  id: 1,
  name: "Alex Rivera",
  role_line: "Software Developer",
  headline: "Building reliable software for real users.",
  intro: "Demo intro text. Replace this with your own short introduction in Admin.",
  location: "Remote",
  about_md: `This is placeholder About copy for local preview mode.

Write your own story in Admin after connecting Supabase.`,
  interests: ["Learning", "Open source", "Coffee"],
  github_url: "",
  linkedin_url: "",
  email: "",
  resume_path: "",
  photo_path: "",
  seo_title: "Alex Rivera · Software Developer",
  seo_description: "Demo portfolio description. Replace in Admin.",
  trash_md: "",
  path_stops: [
    { label: "Role one", detail: "2023 – 2024", href: "/experience" },
    { label: "Role two", detail: "2024 – Now", href: "/experience" },
  ],
  updated_at: now,
};

const projects: Project[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    slug: "sample-platform",
    title: "Sample Platform",
    summary: "A fictional sample project used to demo the portfolio layout. Replace in Admin.",
    role: "Developer",
    year: "2024",
    category: "Platform",
    stack: ["TypeScript", "PostgreSQL", "Docker"],
    cover_path: "",
    gallery: [],
    body_md: `## Overview

Sample Platform is demo content only. Replace this write-up in Admin.`,
    live_url: "",
    github_url: "",
    sort_order: 1,
    published: true,
    created_at: now,
    updated_at: now,
  },
];

const designs: SystemDesign[] = [
  {
    id: "a0000000-0000-4000-8000-000000000010",
    slug: "sample-architecture",
    title: "Sample architecture",
    summary: "Dummy architecture note for first-run demos. Replace in Admin.",
    diagram_path: "",
    body_md: `Client app, API layer, database, and metrics. Rewrite with a design you can publish.`,
    tradeoffs_md: `Keep the demo honest: prefer clear signals over a busy diagram.`,
    sort_order: 1,
    published: true,
    created_at: now,
    updated_at: now,
  },
];

const experience: ExperienceItem[] = [
  {
    id: "a0000000-0000-4000-8000-000000000011",
    role_title: "Software Developer",
    org: "Demo Company",
    start_label: "2024",
    end_label: "Now",
    summary: "Dummy experience row. Replace with your real role summary in Admin.",
    sort_order: 1,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "a0000000-0000-4000-8000-000000000012",
    role_title: "Intern",
    org: "Demo Company",
    start_label: "2023",
    end_label: "2024",
    summary: "Dummy internship row. Replace in Admin.",
    sort_order: 2,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "a0000000-0000-4000-8000-000000000013",
    role_title: "B.E. in Computer Engineering",
    org: "Demo University",
    start_label: "2019",
    end_label: "2023",
    summary: "Dummy education row. Replace in Admin.",
    sort_order: 3,
    published: true,
    created_at: now,
    updated_at: now,
  },
];

const skills: Skill[] = [
  {
    id: "a0000000-0000-4000-8000-000000000021",
    name: "Python",
    usage: "Used on the sample platform demo project.",
    project_slugs: ["sample-platform"],
    sort_order: 1,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "a0000000-0000-4000-8000-000000000022",
    name: "Docker",
    usage: "Packaging the sample platform services.",
    project_slugs: ["sample-platform"],
    sort_order: 2,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "a0000000-0000-4000-8000-000000000023",
    name: "PostgreSQL",
    usage: "Relational data for the sample platform.",
    project_slugs: ["sample-platform"],
    sort_order: 3,
    published: true,
    created_at: now,
    updated_at: now,
  },
];

const posts: Post[] = [
  {
    id: "a0000000-0000-4000-8000-000000000031",
    slug: "welcome-to-the-portfolio",
    title: "Welcome to the portfolio",
    excerpt: "A short dummy post so the Blog page is not empty on first run.",
    cover_path: "",
    body_md: `This is placeholder blog content.

Edit or delete it in Admin and publish your own notes.`,
    tags: ["portfolio", "notes"],
    seo_title: "Welcome to the portfolio",
    seo_description: "Dummy blog post for first-run demos.",
    published: true,
    published_at: now,
    created_at: now,
    updated_at: now,
  },
];

export const previewBundle: DesktopBundle = {
  source: "preview",
  settings,
  projects,
  designs,
  experience,
  skills,
  posts,
};

export const unavailableBundle: DesktopBundle = {
  source: "unavailable",
  settings: emptySettings,
  projects: [],
  designs: [],
  experience: [],
  skills: [],
  posts: [],
};
