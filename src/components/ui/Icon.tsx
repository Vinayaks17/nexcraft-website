import {
  Bot,
  BriefcaseBusiness,
  Church,
  HardHat,
  Mail,
  Receipt,
  Share2,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons referenced by name from the content files. Add new entries here when
 * content introduces a new icon.
 */
export const iconRegistry = {
  Bot,
  BriefcaseBusiness,
  Church,
  HardHat,
  Mail,
  Receipt,
  Share2,
  TrendingUp,
  Users,
  Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = iconRegistry[name];
  return <Cmp className={className} aria-hidden />;
}

export default Icon;
