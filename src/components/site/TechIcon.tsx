"use client";

import { useState } from "react";
import { resolveTech, techIconFallbackUrl, techIconUrl } from "@/lib/tech";

/** Brand mark that stays visible on the dark theme, with CDN fallback. */
export function TechIcon({
  label,
  size = 22,
}: {
  label: string;
  size?: number;
}) {
  const tech = resolveTech(label);
  const primary = techIconUrl(label);
  const fallback = techIconFallbackUrl(label);
  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(!primary);

  if (failed || !src) {
    return (
      <span className="tech-icon-fallback" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.55 }}>
        {tech.name.slice(0, 1)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="tech-icon"
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (src !== fallback && fallback) {
          setSrc(fallback);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
