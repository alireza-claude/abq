"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CTABanner from "@/components/CTABanner";

const services = [
  {
    id: "excavation",
    title: "Excavation",
    subtitle: "Precision cuts. Any depth. Any scale.",
    description:
      "Our excavation division operates one of the most capable heavy equipment fleets in the UAE. From residential foundation digs to multi-million-dollar commercial earthmoving, we bring decades of operator expertise and modern GPS-equipped machinery to every cut.",
    capabilities: [
      "Bulk excavation & mass earthmoving",
      "Foundation & basement excavation",
      "Trenching for utilities, drainage & pipelines",
      "Rock breaking, drilling & blasting coordination",
      "Confined-space & shoring-assisted excavation",
      "Dewatering & groundwater management",
    ],
    stats: [{ value: "250+", label: "Excavation projects" }, { value: "15+", label: "Excavators & backhoes" }],
    image: "https://picsum.photos/seed/excavation-detail/900/700",
    imageAlt: "Heavy excavator on a large construction site",
  },
  {
    id: "earthwork",
    title: "Earthwork & Grading",
    subtitle: "The perfect canvas for every build.",
    description:
      "Precise grading is the unseen foundation of every successful project. Our GPS-guided dozers, motor graders, and compaction equipment deliver tolerances measured in millimeters. We prepare sites for road construction, commercial development, residential subdivisions, and infrastructure projects.",
    capabilities: [
      "Site clearing & demolition grubbing",
      "Cut-and-fill mass grading operations",
      "GPS-guided fine grading & subgrade prep",
      "Proctor compaction testing & reporting",
      "Drainage channels, swales & retention basins",
      "Land sculpting, contouring & berming",
    ],
    stats: [{ value: "180+", label: "Grading projects" }, { value: "99%", label: "On-time delivery" }],
    image: "https://picsum.photos/seed/earthwork-detail/900/700",
    imageAlt: "Grader on a construction site preparing the ground",
  },
  {
    id: "transport",
    title: "Material Transport",
    subtitle: "The right material. The right place. On time.",
    description:
      "Our transport fleet of 30+ dump trucks and articulated haulers keeps materials flowing so your project never stops. We handle aggregate delivery, topsoil supply, debris removal, and specialized logistics for projects of any scale across Dubai and the UAE.",
    capabilities: [
      "Aggregate, gravel & base material delivery",
      "Topsoil, fill, and engineered soil supply",
      "Construction debris & spoil removal",
      "Asphalt millings & recycled base delivery",
      "Rock, rip-rap & decorative aggregate hauling",
      "Emergency same-day haulage services",
    ],
    stats: [{ value: "1M+", label: "Tons transported" }, { value: "30+", label: "Trucks in fleet" }],
    image: "https://picsum.photos/seed/transport-detail/900/700",
    imageAlt: "Fleet of dump trucks at a construction site",
  },
];

const equipment = [
  "Cat 390 Excavator",
  "Komatsu D155 Dozer",
  "Cat 16M Grader",
  "Volvo A40G Hauler",
  "Bomag BW 226 Compactor",
  "Cat 988 Wheel Loader",
  "Terex TA400 Truck",
  "John Deere 310 Backhoe",
];

function ServiceSection({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <section
      id={service.id}
      ref={ref}
      className="py-24"
      style={{ backgroundColor: index % 2 === 0 ? "#0a1628" : "#060e1c" }}
      aria-labelledby={`service-${service.id}-heading`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
            !isEven ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className={`relative h-80 lg:h-[500px] overflow-hidden ${
              !isEven ? "lg:col-start-2" : ""
            }`}
          >
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Accent border */}
            <div
              className="absolute inset-0 border"
              style={{ borderColor: "rgba(74,144,217,0.2)" }}
            />
            {/* Stats badges */}
            <div className="absolute bottom-5 left-5 flex gap-3">
              {service.stats.map((stat, si) => (
                <div
                  key={si}
                  className="px-4 py-2 backdrop-blur-md"
                  style={{ backgroundColor: "rgba(10,22,40,0.85)" }}
                >
                  <div className="text-accent font-extrabold text-lg leading-none">{stat.value}</div>
                  <div className="text-white/50 text-[11px] tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Content ── */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.12, ease: "easeOut" }}
            className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-accent" />
              <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase">
                {service.subtitle}
              </span>
            </div>
            <h2
              id={`service-${service.id}-heading`}
              className="font-extrabold text-white tracking-tight mb-6"
              style={{ fontSize: "clamp(32px,4.5vw,56px)", lineHeight: 1.05 }}
            >
              {service.title}
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(245,240,234,0.55)" }}>
              {service.description}
            </p>

            <ul className="space-y-3 mb-10">
              {service.capabilities.map((cap, ci) => (
                <li key={ci} className="flex items-center gap-3 text-sm" style={{ color: "rgba(245,240,234,0.7)" }}>
                  <span
                    className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent"
                  />
                  {cap}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white font-semibold text-sm hover:bg-[#3a7fc9] transition-colors duration-200"
            >
              Request a Quote →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function EquipmentStrip() {
  return (
    <div
      className="py-12 border-y"
      style={{ backgroundColor: "#0d1e36", borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-center mb-8"
           style={{ color: "rgba(255,255,255,0.25)" }}>
          Equipment Fleet
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {equipment.map((item, i) => (
            <span
              key={i}
              className="px-4 py-2 border text-sm font-medium"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section
        className="relative pt-40 pb-24 grain overflow-hidden"
        style={{ backgroundColor: "#0a1628" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(74,144,217,0.1) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent mb-4">
            <Link href="/" className="hover:text-accent/70 transition-colors">Home</Link>
            {" "}/{" "}
            <span>Services</span>
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "clamp(44px,8vw,110px)", lineHeight: 0.92 }}
          >
            OUR
            <br />
            <span className="text-accent">SERVICES</span>
          </motion.h1>
          {/* Animated underline */}
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
            style={{ color: "rgba(245,240,234,0.52)" }}
          >
            Three core disciplines. One unstoppable team. Serving Dubai &amp; the UAE since 2023.
          </motion.p>
        </div>
      </section>

      {/* ── Service detail sections ── */}
      {services.map((service, i) => (
        <ServiceSection key={service.id} service={service} index={i} />
      ))}

      <EquipmentStrip />
      <CTABanner />
    </>
  );
}
