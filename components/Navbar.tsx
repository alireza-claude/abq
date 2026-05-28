"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(10,22,40,0.88)] backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="ABQ ALSYF Project Management Services home">
              <div className="w-9 h-9 bg-accent flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2 20L7 6L13 14L19 3L22 20H2Z" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-[17px] tracking-tight text-white">
                  ABQ <span className="text-accent">ALSYF</span>
                </span>
                <span className="text-[9px] font-medium tracking-[0.12em] uppercase text-white/50 mt-0.5">
                  Project Management Services
                </span>
              </div>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-1" role="list">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="listitem"
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                    pathname === link.href ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-px bg-accent transition-transform duration-300 origin-left ${
                      pathname === link.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:block">
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-yellow-400 text-navy text-sm font-semibold hover:bg-yellow-300 transition-colors duration-200 active:scale-95"
              >
                Get a Quote
              </Link>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="md:hidden relative z-10 p-2 text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <div className="flex flex-col justify-between w-6 h-[18px]">
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-[8px]" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-[8px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[rgba(10,22,40,0.98)] backdrop-blur-xl flex flex-col justify-center px-8 md:hidden"
          >
            <nav aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.35 }}
                >
                  <Link
                    href={link.href}
                    className={`block text-4xl font-bold py-4 border-b border-white/[0.07] transition-colors ${
                      pathname === link.href ? "text-accent" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <Link
                  href="/contact"
                  className="block w-full text-center py-4 bg-yellow-400 text-navy text-lg font-bold hover:bg-yellow-300 transition-colors"
                >
                  Get a Free Quote
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
