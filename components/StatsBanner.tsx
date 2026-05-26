"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { stats } from "@/lib/data";

export default function StatsBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative py-20 bg-earth diagonal-bg overflow-hidden"
      aria-label="Company statistics"
    >
      {/* Decorative oversized number */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="font-extrabold leading-none tracking-tighter text-white"
          style={{ fontSize: "clamp(100px,22vw,320px)", opacity: 0.025 }}
        >
          20+
        </span>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: i * 0.11,
                ease: "easeOut",
              }}
              className="text-center px-4 lg:border-r lg:last:border-r-0"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              <div
                className="font-extrabold text-white leading-none mb-2"
                style={{ fontSize: "clamp(36px,5vw,64px)" }}
              >
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div
                className="text-[11px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: "rgba(255,255,255,0.48)" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
