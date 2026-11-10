export type PathStop = {
  label: string;
  detail: string;
  href: string;
};

export type SiteSettings = {
  id: number;
  name: string;
  role_line: string;
  headline: string;
  intro: string;
  location: string;
  about_md: string;
  interests: string[];
  github_url: string;
  linkedin_url: string;
  email: string;
  resume_path: string;
  photo_path: string;
  seo_title: string;
  seo_description: string;
  trash_md: string;
  path_stops: PathStop[];
  updated_at: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  role: string;
  year: string;
  category: string;
  stack: string[];
  cover_path: string;
  gallery: string[];
  body_md: string;
  live_url: string;
  github_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type SystemDesign = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  diagram_path: string;
  body_md: string;
  tradeoffs_md: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ExperienceItem = {
  id: string;
  role_title: string;
  org: string;
  start_label: string;
  end_label: string;
  summary: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  usage: string;
  project_slugs: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_path: string;
  body_md: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentSource = "preview" | "live" | "unavailable";

export type DesktopBundle = {
  source: ContentSource;
  settings: SiteSettings;
  projects: Project[];
  designs: SystemDesign[];
  experience: ExperienceItem[];
  skills: Skill[];
  posts: Post[];
};

export type GithubStats = {
  configured: boolean;
  username?: string;
  publicRepos?: number;
  followers?: number;
  latest?: { label: string; at: string } | null;
  error?: string;
};
