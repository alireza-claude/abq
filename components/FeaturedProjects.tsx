"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";

const containerVar: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVar: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function FeaturedProjects() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Show 4 featured projects in asymmetric grid
  const featured = projects.slice(0, 4);

  return (
    <section
      className="py-28"
      style={{ backgroundColor: "#060e1c" }}
      aria-labelledby="projects-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header row ── */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-10 bg-accent" />
              <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase">
                Our Work
              </span>
            </motion.div>
            <motion.h2
              id="projects-heading"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
              className="font-extrabold text-white tracking-tight"
              style={{ fontSize: "clamp(38px,6.5vw,88px)", lineHeight: 0.95 }}
            >
              OUR WORK<br />SPEAKS.
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium pb-1 border-b transition-colors hover:text-white"
              style={{
                color: "rgba(255,255,255,0.45)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              View All Projects →
            </Link>
          </motion.div>
        </div>

        {/* ── Asymmetric grid  ──
            3-column on desktop:
            [Card 1 — col-span-2] [Card 2 — col-span-1]
            [Card 3 — col-span-1] [Card 4 — col-span-2]
        ── */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ gridAutoRows: "320px" }}
        >
          {featured.map((project, i) => {
            const isWide = i === 0 || i === 3;
            return (
              <motion.article
                key={project.id}
                variants={cardVar}
                className={`group relative overflow-hidden ${
                  isWide ? "sm:col-span-2" : "sm:col-span-1"
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.3) 50%, transparent 100%)",
                    opacity: 0.85,
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span
                    className="inline-block px-2 py-1 text-white text-[10px] font-bold tracking-wider uppercase mb-2 self-start"
                    style={{ backgroundColor: "#E8500A" }}
                  >
                    {project.category}
                  </span>
                  <h3 className="font-bold text-white text-lg leading-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {project.location} · {project.year}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="px-5 py-3 bg-white text-navy font-bold text-sm tracking-wide">
                    View Project →
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
