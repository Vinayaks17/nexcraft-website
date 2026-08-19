"use client";

import { useMemo, useState } from "react";

import { ProjectShowcase } from "@/components/portfolio/ProjectShowcase";
import {
  FuelSectionMeta,
  fuelHeadline,
  fuelLabel,
} from "@/components/fuel/FuelPrimitives";
import {
  projectFilters,
  projects,
  projectsSection,
  type ProjectFilterId,
} from "@/lib/portfolio-content";
import { stripAccent } from "@/components/ui/AccentWord";
import { cn } from "@/lib/utils";

const matches = (filter: ProjectFilterId, hasUrl: boolean) =>
  filter === "all" || (filter === "live" ? hasUrl : !hasUrl);

export function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilterId>("all");

  const visible = useMemo(
    () => projects.filter((p) => matches(filter, p.url !== null)),
    [filter],
  );

  return (
    <>
      <FuelSectionMeta num="02" label="Selected projects" />

      {/* Header row: display heading left, mono link-style filters right. */}
      <div className="mt-12 flex flex-col gap-8 sm:mt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2 className={cn(fuelHeadline, "text-cream")}>
          {stripAccent(projectsSection.heading)}
        </h2>

        <div
          role="group"
          aria-label="Filter projects"
          className="flex flex-wrap items-center gap-x-7 gap-y-3"
        >
          {projectFilters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={cn(
                  fuelLabel,
                  "underline-offset-[6px] transition-colors duration-200",
                  active
                    ? "text-cream underline decoration-primary decoration-1"
                    : "text-cream/50 hover:text-cream hover:underline hover:decoration-cream/40",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {projects.length} projects.
      </p>

      {/* Keyed on the filter so a change remounts the grid: the entrance
          animation replays and the editorial slot rhythm re-derives from the
          new index order rather than keeping the old large/small pattern. */}
      <ProjectShowcase key={filter} projects={visible} />
    </>
  );
}

export default ProjectsSection;
