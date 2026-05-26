"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import CTABanner from "@/components/CTABanner";

type Category = "All" | "Excavation" | "Earthwork" | "Transport";

const filters: Category[] = ["All", "Excavation", "Earthwork", "Transport"];

function ProjectCard({ project, i }: { project: (typeof projects)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (i % 4) * 0.08, ease: "easeOut" }}
      className="group relative overflow-hidden cursor-pointer"
      style={{ aspectRatio: "4/3" }}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        loading="lazy"
      />

      {/* Gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{
          background:
            "linear-gradient(to top, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.2) 55%, transparent 100%)",
          opacity: 0.8,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <span
          className="inline-block px-2 py-0.5 text-white text-[10px] font-bold tracking-widest uppercase mb-2 self-start"
          style={{ backgroundColor: "#4a90d9" }}
        >
          {project.category}
        </span>
        <h3 className="font-bold text-white text-base leading-tight mb-1">
          {project.title}
        </h3>
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          {project.location} · {project.year}
        </p>
      </div>

      {/* Hover reveal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="px-5 py-3 bg-white text-navy font-bold text-sm tracking-wide">
          View Project →
        </span>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* ── Page Hero ── */}
      <section
        className="relative pt-40 pb-20 grain overflow-hidden"
        style={{ backgroundColor: "#0a1628" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(74,144,217,0.09) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent mb-4">
            <Link href="/" className="hover:text-accent/70 transition-colors">Home</Link>
            {" "}/{" "}
            <span>Projects</span>
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "clamp(44px,8vw,110px)", lineHeight: 0.92 }}
          >
            OUR
            <br />
            <span className="text-accent">PROJECTS</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 h-1 w-24 bg-accent origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 text-lg max-w-xl"
            style={{ color: "rgba(245,240,234,0.5)" }}
          >
            500+ completed projects across New Mexico. Every one built on precision and trust.
          </motion.p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section
        className="py-16"
        style={{ backgroundColor: "#060e1c" }}
        aria-label="Project portfolio"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* ── Filter buttons ── */}
          <div
            className="flex flex-wrap gap-3 mb-12"
            role="group"
            aria-label="Filter projects by category"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className="px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300"
                style={{
                  backgroundColor:
                    activeFilter === filter ? "#4a90d9" : "rgba(255,255,255,0.04)",
                  color:
                    activeFilter === filter ? "#ffffff" : "rgba(255,255,255,0.45)",
                  border: `1px solid ${
                    activeFilter === filter
                      ? "#4a90d9"
                      : "rgba(255,255,255,0.08)"
                  }`,
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* ── Masonry grid ── */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                >
                  <ProjectCard project={project} i={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.3)" }}>
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
