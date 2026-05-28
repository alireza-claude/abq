"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { team, timeline, values } from "@/lib/data";
import CTABanner from "@/components/CTABanner";

function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="py-24"
      style={{ backgroundColor: "#060e1c" }}
      aria-labelledby="timeline-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase">
            Our Story
          </span>
        </div>
        <h2
          id="timeline-heading"
          className="font-extrabold text-white tracking-tight mb-16"
          style={{ fontSize: "clamp(32px,5vw,64px)" }}
        >
          THREE YEARS OF<br />MOVING FORWARD.
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{ backgroundColor: "rgba(74,144,217,0.2)" }}
            aria-hidden="true"
          />

          <div className="space-y-12">
            {timeline.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="relative flex gap-8 pl-16"
              >
                {/* Dot */}
                <div
                  className="absolute left-[18px] w-3 h-3 rounded-full border-2 -translate-y-0.5"
                  style={{
                    backgroundColor: "#4a90d9",
                    borderColor: "#060e1c",
                    boxShadow: "0 0 0 4px rgba(74,144,217,0.2)",
                  }}
                  aria-hidden="true"
                />

                <div>
                  <span
                    className="inline-block px-3 py-1 text-[11px] font-bold tracking-widest mb-3"
                    style={{ backgroundColor: "rgba(74,144,217,0.15)", color: "#4a90d9" }}
                  >
                    {event.year}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(245,240,234,0.5)" }}>
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="py-24"
      style={{ backgroundColor: "#0a1628" }}
      aria-labelledby="team-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-10 bg-accent" />
          <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase">
            The People
          </span>
        </div>
        <h2
          id="team-heading"
          className="font-extrabold text-white tracking-tight mb-16"
          style={{ fontSize: "clamp(32px,5vw,64px)" }}
        >
          MEET THE TEAM.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: "easeOut" }}
              className="group"
            >
              <div className="relative h-64 overflow-hidden mb-4">
                {member.image ? (
                  <>
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(107,66,38,0.5) 0%, transparent 60%)",
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(74,144,217,0.06)", border: "2px dashed rgba(74,144,217,0.2)" }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(74,144,217,0.3)" strokeWidth="1.5" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
              {member.name && (
                <h3 className="text-white font-bold text-lg mb-0.5">{member.name}</h3>
              )}
              {member.role && (
                <p className="text-accent text-sm font-medium mb-2">{member.role}</p>
              )}
              {member.bio && (
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(245,240,234,0.45)" }}>
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const icons = [
    // Shield
    <svg key="shield" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>,
    // Target/crosshair
    <svg key="target" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>,
    // Clock
    <svg key="clock" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>,
  ];

  return (
    <section
      ref={ref}
      className="py-24 bg-earth diagonal-bg"
      aria-labelledby="values-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-10 bg-white/40" />
          <span className="text-white/50 text-[11px] font-semibold tracking-[0.25em] uppercase">
            What We Stand For
          </span>
        </div>
        <h2
          id="values-heading"
          className="font-extrabold text-white tracking-tight mb-16"
          style={{ fontSize: "clamp(32px,5vw,64px)" }}
        >
          OUR CORE VALUES.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.12 }}
              className="p-8 border"
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center mb-6 text-white/70"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                {icons[i]}
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{value.title}</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section
        className="relative pt-48 pb-28 grain overflow-hidden"
        style={{ backgroundColor: "#0a1628" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute bottom-0 right-0 w-[700px] h-[500px]"
            style={{
              background:
                "radial-gradient(ellipse at right bottom, rgba(74,144,217,0.1) 0%, transparent 65%)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent mb-4">
            <Link href="/" className="hover:text-accent/70 transition-colors">Home</Link>
            {" "}/{" "}
            <span>About</span>
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "clamp(44px,9vw,120px)", lineHeight: 0.9 }}
          >
            ABQ<br />
            <span className="text-accent">ALSYF</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 h-1 w-24 bg-accent origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 text-xl max-w-xl font-medium"
            style={{ color: "rgba(245,240,234,0.5)" }}
          >
            Founded in Dubai in 2023. Built on precision, trust, and the kind of
            work ethic that makes the earth move.
          </motion.p>
        </div>
      </section>

      <TimelineSection />
      <TeamSection />
      <ValuesSection />
      <CTABanner />
    </>
  );
}
