import { TechIcon } from "@/components/site/TechIcon";
import { resolveTech } from "@/lib/tech";

export function TechLogo({
  label,
  size = 16,
  withName = false,
}: {
  label: string;
  size?: number;
  withName?: boolean;
}) {
  const tech = resolveTech(label);

  return (
    <span className="tech-pill" title={tech.name}>
      <TechIcon label={label} size={size} />
      {withName ? tech.name : null}
    </span>
  );
}
