export const publicNav = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/about", label: "About Me", icon: "about" },
  { href: "/projects", label: "Projects", icon: "projects" },
  { href: "/experience", label: "Experience", icon: "experience" },
  { href: "/skills", label: "Skills", icon: "skills" },
  { href: "/blog", label: "Blog", icon: "blog" },
  { href: "/resume", label: "Resume", icon: "resume" },
  { href: "/contact", label: "Contact", icon: "contact" },
] as const;

export type NavIcon = (typeof publicNav)[number]["icon"];

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
