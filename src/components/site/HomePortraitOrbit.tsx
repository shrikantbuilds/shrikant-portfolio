"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TechIcon } from "@/components/site/TechIcon";
import { HOME_ORBIT_TECH } from "@/lib/tech";

function position(index: number, total: number, radius: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius}%`,
  };
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function HomePortraitOrbit({
  photoUrl,
  name,
}: {
  photoUrl: string;
  name: string;
}) {
  const reduce = useReducedMotion();
  const initials = initialsFor(name || "Alex Rivera");

  return (
    <div className="home-orbit" aria-label="Profile and technologies">
      <div className="home-orbit-glow" aria-hidden="true" />
      <div className="home-orbit-ring" aria-hidden="true" />
      <div className="home-portrait">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} />
        ) : (
          <div className="home-portrait-fallback" aria-hidden="true">
            <span>{initials}</span>
          </div>
        )}
      </div>
      <motion.div
        className="home-orbit-spin"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 56, ease: "linear", repeat: Infinity }}
      >
        {HOME_ORBIT_TECH.map((label, index) => {
          const style = position(index, HOME_ORBIT_TECH.length, 46);
          return (
            <motion.div
              key={label}
              className="orbit-node home-orbit-node"
              style={style}
              tabIndex={0}
              animate={reduce ? undefined : { rotate: -360 }}
              transition={reduce ? undefined : { duration: 56, ease: "linear", repeat: Infinity }}
            >
              <span className="orbit-tip">{label}</span>
              <TechIcon label={label} size={20} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
