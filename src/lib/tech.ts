/** Known tech logos via Simple Icons (real brand marks, not invented artwork). */
export type TechMeta = {
  name: string;
  slug: string;
  color: string;
  category:
    | "Programming"
    | "Frontend"
    | "Backend"
    | "Database"
    | "DevOps and Infrastructure"
    | "Monitoring"
    | "Tools"
    | "Other";
};

export const TECH_CATALOG: Record<string, TechMeta> = {
  python: { name: "Python", slug: "python", color: "3776AB", category: "Programming" },
  javascript: { name: "JavaScript", slug: "javascript", color: "F7DF1E", category: "Programming" },
  "vue.js": { name: "Vue.js", slug: "vuedotjs", color: "4FC08D", category: "Frontend" },
  vue: { name: "Vue.js", slug: "vuedotjs", color: "4FC08D", category: "Frontend" },
  svelte: { name: "Svelte", slug: "svelte", color: "FF3E00", category: "Frontend" },
  react: { name: "React", slug: "react", color: "61DAFB", category: "Frontend" },
  frappe: { name: "Frappe", slug: "frappe", color: "0089FF", category: "Backend" },
  fastapi: { name: "FastAPI", slug: "fastapi", color: "009688", category: "Backend" },
  "node.js": { name: "Node.js", slug: "nodedotjs", color: "5FA04E", category: "Backend" },
  node: { name: "Node.js", slug: "nodedotjs", color: "5FA04E", category: "Backend" },
  "rest apis": { name: "REST APIs", slug: "fastapi", color: "009688", category: "Backend" },
  mariadb: { name: "MariaDB", slug: "mariadb", color: "C49A0C", category: "Database" },
  postgresql: { name: "PostgreSQL", slug: "postgresql", color: "4169E1", category: "Database" },
  postgres: { name: "PostgreSQL", slug: "postgresql", color: "4169E1", category: "Database" },
  redis: { name: "Redis", slug: "redis", color: "FF4438", category: "Database" },
  docker: { name: "Docker", slug: "docker", color: "2496ED", category: "DevOps and Infrastructure" },
  kubernetes: {
    name: "Kubernetes",
    slug: "kubernetes",
    color: "326CE5",
    category: "DevOps and Infrastructure",
  },
  linux: { name: "Linux", slug: "linux", color: "FCC624", category: "DevOps and Infrastructure" },
  prometheus: { name: "Prometheus", slug: "prometheus", color: "E6522C", category: "Monitoring" },
  grafana: { name: "Grafana", slug: "grafana", color: "F46800", category: "Monitoring" },
  victoriametrics: {
    name: "VictoriaMetrics",
    slug: "prometheus",
    color: "621AFF",
    category: "Monitoring",
  },
  git: { name: "Git", slug: "git", color: "F05032", category: "Tools" },
  github: { name: "GitHub", slug: "github", color: "FFFFFF", category: "Tools" },
  postman: { name: "Postman", slug: "postman", color: "FF6C37", category: "Tools" },
  networkx: { name: "NetworkX", slug: "python", color: "3776AB", category: "Programming" },
  "graph algorithms": {
    name: "Graph Algorithms",
    slug: "graphql",
    color: "E10098",
    category: "Programming",
  },
};

/** Home portrait orbit matches the cinematic mockup set. */
export const HOME_ORBIT_TECH = ["Python", "React", "FastAPI", "Docker", "PostgreSQL"] as const;

export const SKILL_GROUPS: { title: string; items: string[] }[] = [
  { title: "Programming", items: ["Python", "JavaScript"] },
  { title: "Frontend", items: ["Vue.js", "Svelte", "React"] },
  { title: "Backend", items: ["Frappe", "Node.js", "REST APIs"] },
  { title: "Database", items: ["MariaDB", "PostgreSQL", "Redis"] },
  { title: "DevOps and Infrastructure", items: ["Docker", "Kubernetes", "Linux"] },
  { title: "Monitoring", items: ["Prometheus", "Grafana", "VictoriaMetrics"] },
  { title: "Tools", items: ["Git", "GitHub", "Postman"] },
];

export function resolveTech(label: string): TechMeta {
  const key = label.trim().toLowerCase();
  return (
    TECH_CATALOG[key] ?? {
      name: label,
      slug: "circle",
      color: "58A6FF",
      category: "Other",
    }
  );
}

/**
 * Prefer jsDelivr (stable). Fall back path used by img onError goes to simpleicons CDN.
 * Colored SVG via simpleicons query keeps brand color readable on dark UI.
 */
export function techIconUrl(label: string) {
  const tech = resolveTech(label);
  if (tech.slug === "circle") return "";
  // Colored mark — works as <img>, no currentColor issues.
  return `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`;
}

export function techIconFallbackUrl(label: string) {
  const tech = resolveTech(label);
  if (tech.slug === "circle") return "";
  return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${tech.slug}.svg`;
}
