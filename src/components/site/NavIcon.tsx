import type { NavIcon as IconName } from "./nav";

export function NavIcon({ name }: { name: IconName | "search" | "menu" | "close" }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M7 10.5V20h10v-9.5" />
        </svg>
      );
    case "about":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 19c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5" />
        </svg>
      );
    case "projects":
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M4 10h16" />
        </svg>
      );
    case "experience":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l2.5 2" />
        </svg>
      );
    case "skills":
      return (
        <svg {...props}>
          <path d="M13 3 5 14h7l-1 7 8-11h-7l1-7z" />
        </svg>
      );
    case "blog":
      return (
        <svg {...props}>
          <path d="M6 4h12v16H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "resume":
      return (
        <svg {...props}>
          <path d="M7 3h7l5 5v13H7z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
      );
    case "contact":
      return (
        <svg {...props}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "menu":
      return (
        <svg {...props}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
  }
}
