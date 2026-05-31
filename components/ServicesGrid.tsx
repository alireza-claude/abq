"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Excavation",
    href: "/services#excavation",
    description:
      "Precision bulk excavation, trenching, foundation digs, and rock breaking for projects of any scale.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <rect x="4" y="34" width="40" height="7" rx="2" fill="#a0714f" />
        <rect x="8" y="26" width="20" height="8" rx="1" fill="#a0714f" />
        <path d="M26 30L34 18L40 24" stroke="#a0714f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="34" y="10" width="10" height="4" rx="2" fill="#a0714f" />
        <circle cx="10" cy="43" r="3.5" fill="#6b4226" />
        <circle cx="22" cy="43" r="3.5" fill="#6b4226" />
        <circle cx="38" cy="43" r="3.5" fill="#6b4226" />
      </svg>
    ),
    capabilities: [
      "Bulk excavation & mass earthmoving",
      "Foundation & basement digs",
      "Trenching for utilities",
      "Rock breaking & removal",
    ],
  },
  {
    id: 2,
    title: "Earthwork & Grading",
    href: "/services#earthwork",
    description:
      "GPS-guided precision grading, site preparation, compaction, and drainage engineering.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <path
          d="M4 38 Q12 26 20 32 Q28 38 36 24 Q42 14 44 12"
          stroke="#a0714f"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M4 42 Q12 32 20 36 Q28 40 36 28 Q42 20 44 18"
          stroke="#a0714f"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <rect x="2" y="40" width="44" height="6" rx="1" fill="#6b4226" />
        <path d="M18 40 L24 22 L30 40Z" fill="#a0714f" opacity="0.35" />
      </svg>
    ),
    capabilities: [
      "Site preparation & clearing",
      "GPS precision grading",
      "Sub-grade compaction testing",
      "Drainage design & installation",
    ],
  },
  {
    id: 3,
    title: "Material Transport",
    href: "/services#transport",
    description:
      "Modern fleet of dump trucks and haulers for aggregate delivery, debris removal, and logistics.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <rect x="2" y="22" width="28" height="16" rx="2" fill="#a0714f" />
        <path d="M30 28 L38 22 L44 28 L44 38 L30 38Z" fill="#a0714f" />
        <rect x="33" y="25" width="8" height="7" rx="1" fill="#0a1628" opacity="0.35" />
        <rect x="2" y="18" width="22" height="4" rx="1" fill="#6b4226" />
        <circle cx="10" cy="40" r="4" fill="#6b4226" />
        <circle cx="22" cy="40" r="4" fill="#6b4226" />
        <circle cx="38" cy="40" r="4" fill="#6b4226" />
      </svg>
    ),
    capabilities: [
      "Aggregate & sand delivery",
      "Debris & spoil removal",
      "Topsoil supply & delivery",
      "Same-day emergency haulage",
    ],
  },
];

const containerVar: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const cardVar: Variants = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

export default function ServicesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });

  return (
    <section
      className="py-28"
      style={{ backgroundColor: "#0a1628" }}
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Section header ── */}
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-10 bg-accent" />
            <span
              className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase"
            >
              Our Capabilities
            </span>
          </motion.div>
          <motion.h2
            id="services-heading"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "clamp(38px,6.5vw,88px)", lineHeight: 0.95 }}
          >
            WHAT WE DO
          </motion.h2>
        </div>

        {/* ── Service cards ── */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {services.map((service) => (
            <motion.article
              key={service.id}
              variants={cardVar}
              className="group relative p-8 border border-white/[0.06] hover:border-accent/45 transition-all duration-500 cursor-pointer overflow-hidden"
              style={{ backgroundColor: "#0d1e36" }}
            >
              {/* Bottom accent line reveal */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-accent transition-all duration-500" />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,80,10,0.05) 0%, transparent 60%)",
                }}
              />

              {/* Icon */}
              <div
                className="relative w-16 h-16 flex items-center justify-center mb-7 transition-colors duration-300"
                style={{ backgroundColor: "rgba(107,66,38,0.25)" }}
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: "rgba(245,240,234,0.5)" }}>
                {service.description}
              </p>

              <ul className="space-y-2 mb-8">
                {service.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px]" style={{ color: "rgba(245,240,234,0.38)" }}>
                    <span className="w-1 h-1 rounded-full bg-accent/60 flex-shrink-0" />
                    {cap}
                  </li>
                ))}
              </ul>

              <Link
                href={service.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all duration-300"
              >
                Learn More
                <span className="text-base">→</span>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
