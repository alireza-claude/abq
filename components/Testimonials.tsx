"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Auto-rotate every 5 s
  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      className="py-28"
      style={{ backgroundColor: "#060e1c" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-10 bg-accent" />
            <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase">
              Client Words
            </span>
            <span className="h-px w-10 bg-accent" />
          </div>
          <h2
            id="testimonials-heading"
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "clamp(30px,5vw,56px)" }}
          >
            TRUSTED BY THE BEST
          </h2>
        </motion.div>

        {/* ── Cards ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          role="list"
          aria-label="Client testimonials"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              role="listitem"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.12 }}
              onClick={() => setActive(i)}
              className={`p-8 border cursor-pointer transition-all duration-500 ${
                i === active
                  ? "border-accent/40 scale-[1.02]"
                  : "border-white/[0.05] hover:border-white/15"
              }`}
              style={{
                backgroundColor:
                  i === active
                    ? "rgba(30,77,140,0.35)"
                    : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5" aria-label={`${t.stars} out of 5 stars`}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <svg key={s} width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M7 1L8.6 5.5H13.5L9.7 8.2L11.3 12.7L7 10L2.7 12.7L4.3 8.2L0.5 5.5H5.4L7 1Z"
                      fill="#4a90d9"
                    />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="text-sm leading-relaxed mb-7"
                style={{ color: "rgba(245,240,234,0.7)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-accent font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: "rgba(74,144,217,0.18)" }}
                >
                  {t.author[0]}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.author}</div>
                  <div
                    className="text-[12px]"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Dot indicators ── */}
        <div
          className="flex justify-center gap-2 mt-10"
          role="tablist"
          aria-label="Testimonial navigation"
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === active ? "24px" : "8px",
                backgroundColor: i === active ? "#4a90d9" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
