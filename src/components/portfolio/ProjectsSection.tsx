"use client";

import { useMemo, useState } from "react";

import { ProjectShowcase } from "@/components/portfolio/ProjectShowcase";
import { RevealHeading } from "@/components/ui/RevealHeading";
import {
  projectFilters,
  projects,
  projectsSection,
  type ProjectFilterId,
} from "@/lib/portfolio-content";
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
      {/* Header row: display heading left, mono link-style filters right. */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <RevealHeading
          text={projectsSection.heading}
          as="h2"
          className="text-[2.5rem] sm:text-6xl lg:text-[4rem]"
        />

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
                  "font-mono text-[0.6875rem] tracking-[0.18em] uppercase underline-offset-[6px] transition-colors duration-200",
                  active
                    ? "text-cream underline decoration-primary decoration-1"
                    : "text-cream/55 hover:text-cream hover:underline hover:decoration-cream/40",
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
