"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const differentiators = [
  "GPS-guided precision on every excavation and grade",
  "OSHA-certified operators & rigorous safety protocols",
  "Modern fleet of 50+ machines, maintained to spec",
  "99% on-time project completion over 3 years",
  "Licensed, bonded & insured in the UAE",
];

export default function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-28 bg-cream"
      aria-labelledby="why-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: Bold statement ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-earth" />
              <span
                className="text-[11px] font-semibold tracking-[0.25em] uppercase text-earth"
              >
                Why Choose Us
              </span>
            </div>

            <h2
              id="why-heading"
              className="font-extrabold text-navy leading-tight tracking-tight mb-8"
              style={{ fontSize: "clamp(36px,5vw,68px)" }}
            >
              THE STANDARD<br />
              <span className="text-earth">OTHERS</span><br />
              MEASURE BY.
            </h2>

            <p className="text-navy/60 text-lg leading-relaxed max-w-sm">
              3 years of moving earth means 3 years of solving problems, meeting deadlines,
              and exceeding expectations. We don&apos;t just complete projects — we build legacies.
            </p>

            {/* Earth accent marks */}
            <div className="flex gap-3 mt-10" aria-hidden="true">
              <span className="h-1 w-10 bg-earth inline-block" />
              <span className="h-1 w-7 bg-earth/50 inline-block" />
              <span className="h-1 w-4 bg-earth/25 inline-block" />
            </div>
          </motion.div>

          {/* ── Right: Differentiators ── */}
          <div className="space-y-4">
            {differentiators.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: 0.18 + i * 0.1,
                  ease: "easeOut",
                }}
                className="flex items-start gap-4 p-5 bg-white border border-navy/[0.06] hover:border-accent/40 transition-colors duration-300"
              >
                {/* Animated check */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: "rgba(74,144,217,0.12)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <motion.path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="#4a90d9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    />
                  </svg>
                </div>
                <p className="text-navy font-medium text-[15px] leading-snug">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
