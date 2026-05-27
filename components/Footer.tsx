import Link from "next/link";
import { navLinks } from "@/lib/data";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/[0.05]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* ── Brand ── */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6" aria-label="ABQ ALSYF Project Management Services home">
              <div className="w-9 h-9 bg-accent flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2 20L7 6L13 14L19 3L22 20H2Z" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-[19px] tracking-tight text-white">
                ABQ<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              ABQ ALSYF Project Management Services — Dubai&apos;s premier excavation, earthwork, and material transport company. 3 years of moving the earth.
            </p>
            <div className="flex items-center gap-3 mt-6" aria-label="Social media links">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-9 h-9 bg-white/[0.05] hover:bg-accent text-white/40 hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Nav links ── */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+971582250785" className="text-white/45 hover:text-white transition-colors">
                  +971 58 225 0785
                </a>
              </li>
              <li>
                <a href="mailto:info@abqalsyf.ae" className="text-white/45 hover:text-white transition-colors">
                  info@abqalsyf.ae
                </a>
              </li>
              <li>
                <address className="not-italic text-white/45 leading-relaxed">
                  Dubai,<br />
                  United Arab Emirates
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} ABQ ALSYF Project Management Services. All rights reserved.
          </p>
          <p className="text-[11px] text-white/25">
            Licensed · Bonded · Insured · UAE Registered
          </p>
        </div>
      </div>
    </footer>
  );
}
