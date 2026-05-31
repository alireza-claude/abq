"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Ticker from "./Ticker";

const headline = ["WE", "MOVE", "THE", "EARTH."];

const containerVar: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.45 } },
};

const wordVar: Variants = {
  hidden: { opacity: 0, y: 90, skewX: 6 },
  visible: {
    opacity: 1,
    y: 0,
    skewX: 0,
    transition: { duration: 0.95, ease: "easeOut" },
  },
};

const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease: "easeOut" },
  },
});

// ── Abstract terrain SVG ────────────────────────────────
function TerrainLines() {
  const paths = [
    "M-60 720 Q180 670 380 695 T780 678 T1180 700 T1500 665",
    "M-60 770 Q180 725 400 745 T810 730 T1220 752 T1500 718",
    "M-60 620 Q180 580 360 598 T740 582 T1140 604 T1500 568",
    "M-60 520 Q180 490 340 504 T700 490 T1080 510 T1500 475",
    "M-60 420 Q180 400 320 410 T660 398 T1020 415 T1500 382",
    "M-60 320 Q180 308 300 315 T620 304 T960 318 T1500 290",
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E8500A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1e4d8c" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="url(#terrainGrad)"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 3, delay: 0.2 + i * 0.3, ease: "easeInOut" },
            opacity: { duration: 1, delay: 0.2 + i * 0.3 },
          }}
        />
      ))}
      {/* Subtle grid dots */}
      {Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 15 }, (_, col) => (
          <motion.circle
            key={`${row}-${col}`}
            cx={col * 100 + 30}
            cy={row * 120 + 40}
            r="1.2"
            fill="#E8500A"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 1.2 + (row + col) * 0.018, duration: 0.3 }}
          />
        ))
      )}
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grain"
      style={{ backgroundColor: "#0a1628" }}
      aria-labelledby="hero-headline"
    >
      {/* ── Radial glow atmospherics ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[18%] left-[8%] w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,80,10,0.14) 0%, transparent 68%)",
          }}
        />
        <div
          className="absolute bottom-[8%] right-[6%] w-[550px] h-[550px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(30,77,140,0.18) 0%, transparent 68%)",
          }}
        />
      </div>

      {/* ── Terrain SVG (low opacity) ── */}
      <div className="absolute inset-0 opacity-[0.09]" aria-hidden="true">
        <TerrainLines />
      </div>

      {/* ── Decorative oversized text ── */}
      <div
        className="absolute bottom-16 right-0 select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-extrabold leading-none tracking-[-0.04em] text-white"
          style={{
            fontSize: "clamp(80px,16vw,220px)",
            opacity: 0.018,
          }}
        >
          EARTH
        </span>
      </div>

      {/* ── Parallax content wrapper ── */}
      <motion.div style={{ y, opacity }} className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent text-[11px] font-semibold tracking-[0.28em] uppercase">
              Dubai, UAE · Est. 2023
            </span>
          </motion.div>

          {/* ── Split-text headline ── */}
          <motion.h1
            id="hero-headline"
            variants={containerVar}
            initial="hidden"
            animate="visible"
            className="mb-9 overflow-visible"
            style={{ perspective: "1200px" }}
          >
            {headline.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVar}
                style={{
                  display: "inline-block",
                  marginRight: "0.16em",
                  fontSize: "clamp(50px,8.8vw,130px)",
                  fontWeight: 800,
                  lineHeight: 0.92,
                  letterSpacing: "-0.025em",
                  color: "#ffffff",
                }}
              >
                {/* Last word: "EARTH." gets accent dot */}
                {i === headline.length - 1 ? (
                  <>
                    EARTH
                    <span style={{ color: "#E8500A" }}>.</span>
                  </>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp(1.1)}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl max-w-lg leading-relaxed mb-12"
            style={{ color: "rgba(245,240,234,0.52)" }}
          >
            Premier excavation, earthwork &amp; material transport serving Dubai and the UAE for over 3 years.
            Precision. Scale. Reliability.
          </motion.p>

          {/* ── CTA buttons ── */}
          <motion.div
            variants={fadeUp(1.3)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/services"
              className="inline-flex items-center px-7 py-4 border-2 text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white hover:text-navy"
              style={{ borderColor: "rgba(255,255,255,0.28)" }}
            >
              Our Services
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-7 py-4 bg-yellow-400 text-navy text-sm font-semibold tracking-wide hover:bg-yellow-300 transition-all duration-300"
              style={{ boxShadow: "0 8px 30px rgba(250,204,21,0.35)" }}
            >
              View Projects
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Ticker bar ── */}
      <div className="relative z-10 mt-auto">
        <Ticker />
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-[72px] right-8 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
          className="w-px h-12"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
          }}
        />
        <span
          className="text-[9px] font-semibold tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.22)", writingMode: "vertical-rl" }}
        >
          scroll
        </span>
      </motion.div>
    </section>
  );
}
