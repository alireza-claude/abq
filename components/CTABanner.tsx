"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1e4d8c 0%, #0a1628 55%)",
        paddingTop: "96px",
        paddingBottom: "96px",
        clipPath: "polygon(0 6%, 100% 0, 100% 94%, 0 100%)",
        margin: "-2px 0",
      }}
      aria-labelledby="cta-heading"
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(74,144,217,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
        >
          <p className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">
            Let&apos;s Build Together
          </p>
          <h2
            id="cta-heading"
            className="font-extrabold text-white tracking-tight mb-5"
            style={{ fontSize: "clamp(32px,6vw,76px)", lineHeight: 0.95 }}
          >
            READY TO START<br />YOUR PROJECT?
          </h2>
          <p className="text-lg mb-12 max-w-lg mx-auto" style={{ color: "rgba(245,240,234,0.5)" }}>
            Get a free, no-obligation quote within 24 hours. Our team is standing by.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-sm tracking-wide hover:bg-[#3a7fc9] active:scale-95 transition-all duration-200"
            style={{ boxShadow: "0 12px 40px rgba(74,144,217,0.3)" }}
          >
            Request a Free Quote →
          </Link>
          <a
            href="tel:+15055550100"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 text-white font-semibold text-sm tracking-wide hover:bg-white hover:text-navy transition-all duration-300"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.64a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            (505) 555-0100
          </a>
        </motion.div>
      </div>
    </section>
  );
}
