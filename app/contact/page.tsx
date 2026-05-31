"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://dobakloaicmugeifdhpp.supabase.co",
  "sb_publishable_rm3aseepmsO7xtzdMaIWKA_A9tow5KM"
);

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const serviceOptions = [
  { value: "", label: "Select a service..." },
  { value: "excavation", label: "Excavation" },
  { value: "earthwork", label: "Earthwork & Grading" },
  { value: "transport", label: "Material Transport" },
  { value: "multiple", label: "Multiple Services" },
  { value: "other", label: "Other / Not Sure" },
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email.";
  if (!data.service) errors.service = "Please select a service.";
  if (!data.description.trim() || data.description.trim().length < 20)
    errors.description = "Please describe your project (at least 20 characters).";
  return errors;
}

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(232,80,10,0.15)" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <motion.path
            d="M4 12L9 17L20 6"
            stroke="#E8500A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </svg>
      </motion.div>
      <h3 className="text-white font-bold text-2xl mb-3">Quote Request Sent!</h3>
      <p style={{ color: "rgba(245,240,234,0.55)" }} className="text-base max-w-xs leading-relaxed">
        We&apos;ve received your request. Our team will reach out within 24 hours with your free estimate.
      </p>
    </motion.div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      // 1. Send email via Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "9a031078-ed55-4ff7-ae08-59f461deb19a",
          subject: `New Quote Request from ${formData.name}`,
          from_name: "ABQ ALSYF Website",
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.description,
        }),
      });
      const data = await response.json();

      // 2. Save to Supabase (regardless of email result)
      await supabase.from("inquiries").insert({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.description,
      });

      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again or call us directly.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full px-4 py-3.5 text-sm font-medium border bg-transparent text-white placeholder:text-white/25 focus:outline-none transition-colors duration-200";
  const inputNormal = `${inputBase} border-white/[0.12] focus:border-accent`;
  const inputError = `${inputBase} border-red-500/60 focus:border-red-400`;

  return (
    <>
      {/* ── Page Hero ── */}
      <section
        className="relative pt-40 pb-20 grain overflow-hidden"
        style={{ backgroundColor: "#0a1628" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 right-0 w-[500px] h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(232,80,10,0.1) 0%, transparent 65%)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent mb-4">
            <Link href="/" className="hover:text-accent/70 transition-colors">Home</Link>
            {" "}/{" "}
            <span>Contact</span>
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "clamp(44px,8vw,110px)", lineHeight: 0.92 }}
          >
            GET A<br />
            <span className="text-accent">FREE QUOTE</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 h-1 w-24 bg-accent origin-left"
          />
        </div>
      </section>

      {/* ── Main: Split layout ── */}
      <section
        ref={ref}
        className="py-20"
        style={{ backgroundColor: "#060e1c" }}
        aria-label="Contact information and quote request form"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ── Left: Contact info ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="font-extrabold text-white text-3xl mb-8">
                Let&apos;s Talk About<br />Your Project.
              </h2>
              <p className="text-[15px] leading-relaxed mb-12" style={{ color: "rgba(245,240,234,0.52)" }}>
                Whether it&apos;s a small residential excavation or a multi-million-dollar
                commercial earthwork package, we&apos;re ready to give you a
                detailed, no-obligation estimate within 24 hours.
              </p>

              {/* Contact details */}
              <div className="space-y-5 mb-12">
                {[
                  {
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.64a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    ),
                    label: "Phone",
                    value: "+971 58 225 0785",
                    href: "tel:+971582250785",
                  },
                  {
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    label: "Email",
                    value: "info@abqalsyf.ae",
                    href: "mailto:info@abqalsyf.ae",
                  },
                  {
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    label: "Address",
                    value: "Dubai,\nUnited Arab Emirates",
                    href: "https://maps.google.com",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("https") ? "_blank" : undefined}
                    rel={item.href.startsWith("https") ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 group"
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center mt-0.5 transition-colors duration-200 text-white/50 group-hover:text-accent"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {item.label}
                      </div>
                      <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line group-hover:text-white transition-colors">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map placeholder */}
              <div
                className="relative h-52 border flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: "rgba(30,77,140,0.1)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(232,80,10,0.05) 0px, rgba(232,80,10,0.05) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(232,80,10,0.05) 0px, rgba(232,80,10,0.05) 1px, transparent 1px, transparent 32px)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative text-center">
                  <div
                    className="w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2"
                    style={{ backgroundColor: "rgba(232,80,10,0.2)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8500A" aria-hidden="true">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Dubai, UAE
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
            >
              <div
                className="p-8 border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <h3 className="text-white font-bold text-xl mb-8">Request a Free Quote</h3>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <SuccessState key="success" />
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      noValidate
                      aria-label="Quote request form"
                      className="space-y-5"
                    >
                      {/* Name + Company */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-[11px] font-semibold tracking-wider uppercase mb-2"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            aria-required="true"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            className={errors.name ? inputError : inputNormal}
                          />
                          {errors.name && (
                            <p id="name-error" className="mt-1.5 text-[12px] text-red-400" role="alert">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="company"
                            className="block text-[11px] font-semibold tracking-wider uppercase mb-2"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            Company
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            autoComplete="organization"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Company name"
                            className={inputNormal}
                          />
                        </div>
                      </div>

                      {/* Email + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-[11px] font-semibold tracking-wider uppercase mb-2"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            Email *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@company.com"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            className={errors.email ? inputError : inputNormal}
                          />
                          {errors.email && (
                            <p id="email-error" className="mt-1.5 text-[12px] text-red-400" role="alert">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-[11px] font-semibold tracking-wider uppercase mb-2"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            Phone
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+971 58 225 0785"
                            className={inputNormal}
                          />
                        </div>
                      </div>

                      {/* Service */}
                      <div>
                        <label
                          htmlFor="service"
                          className="block text-[11px] font-semibold tracking-wider uppercase mb-2"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          Service Type *
                        </label>
                        <div className="relative">
                          <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            aria-required="true"
                            aria-invalid={!!errors.service}
                            aria-describedby={errors.service ? "service-error" : undefined}
                            className={`${errors.service ? inputError : inputNormal} pr-10 cursor-pointer`}
                            style={{ backgroundColor: "#0a1628" }}
                          >
                            {serviceOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="6 9 12 15 18 9" style={{ color: "rgba(255,255,255,0.4)" }} />
                            </svg>
                          </div>
                        </div>
                        {errors.service && (
                          <p id="service-error" className="mt-1.5 text-[12px] text-red-400" role="alert">
                            {errors.service}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-[11px] font-semibold tracking-wider uppercase mb-2"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          Project Description *
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={5}
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your project — location, scope, timeline, any special requirements..."
                          aria-required="true"
                          aria-invalid={!!errors.description}
                          aria-describedby={errors.description ? "desc-error" : undefined}
                          className={`${errors.description ? inputError : inputNormal} resize-none`}
                        />
                        {errors.description && (
                          <p id="desc-error" className="mt-1.5 text-[12px] text-red-400" role="alert">
                            {errors.description}
                          </p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 font-bold text-sm tracking-wide text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#E8500A" }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          "Submit Quote Request →"
                        )}
                      </button>

                      <p className="text-center text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                        We respond within 24 hours · No obligation
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
