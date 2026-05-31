export interface Project {
  id: number;
  title: string;
  category: "Excavation" | "Earthwork" | "Transport";
  location: string;
  year: number;
  image: string;
  description: string;
  tags: string[];
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  stars: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Stat {
  id: number;
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
}

export interface Value {
  id: number;
  title: string;
  description: string;
}

// ── Navigation ─────────────────────────────────────────
export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ── Stats ───────────────────────────────────────────────
export const stats: Stat[] = [
  { id: 1, value: 50, suffix: "+", label: "Projects Completed" },
  { id: 2, value: 3, suffix: "+", label: "Years Experience" },
  { id: 3, value: 250, suffix: "K+ Tons", label: "Material Moved" },
  { id: 4, value: 10, suffix: "+", label: "Machines in Fleet" },
];

// ── Projects ────────────────────────────────────────────
export const projects: Project[] = [];

// ── Testimonials ─────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "",
    author: "",
    role: "",
    company: "",
    stars: 5,
  },
  {
    id: 2,
    quote: "",
    author: "",
    role: "",
    company: "",
    stars: 5,
  },
  {
    id: 3,
    quote: "",
    author: "",
    role: "",
    company: "",
    stars: 5,
  },
];

// ── Team ─────────────────────────────────────────────────
export const team: TeamMember[] = [
  {
    id: 1,
    name: "",
    role: "",
    image: "/images/alireza.jpeg",
    bio: "",
  },
  {
    id: 2,
    name: "",
    role: "",
    image: "",
    bio: "",
  },
  {
    id: 3,
    name: "",
    role: "",
    image: "",
    bio: "",
  },
  {
    id: 4,
    name: "",
    role: "",
    image: "",
    bio: "",
  },
];

// ── Timeline ─────────────────────────────────────────────
export const timeline: TimelineEvent[] = [
  {
    id: 1,
    year: "2023",
    title: "Founded in Dubai",
    description:
      "ABQ ALSYF Project Management Services was established in Dubai, UAE, with a commitment to quality excavation, earthwork, and material transport.",
  },
  {
    id: 2,
    year: "2024",
    title: "Growing Our Fleet",
    description:
      "Expanded operations across Dubai and the UAE, growing our fleet and delivering projects for a wider range of clients.",
  },
  {
    id: 3,
    year: "2025",
    title: "Building the Future",
    description:
      "Continuing to move the earth and build the UAE's future — one project at a time.",
  },
  {
    id: 4,
    year: "2026",
    title: "Full-Service Operations",
    description:
      "Delivering large-scale excavation, site preparation, and material transport projects across Dubai and the UAE — meeting the demands of a fast-growing market.",
  },
];

// ── Company Values ────────────────────────────────────────
export const values: Value[] = [
  {
    id: 1,
    title: "Safety Without Compromise",
    description:
      "Ten-year perfect safety record. Every operator is OSHA-certified. Every job site is audited before crews move in.",
  },
  {
    id: 2,
    title: "Precision Engineering",
    description:
      "GPS-guided equipment and highly trained operators deliver results within millimeter tolerances, every time.",
  },
  {
    id: 3,
    title: "Reliability You Can Build On",
    description:
      "99% on-time project completion over 3 years. When we commit to a schedule and a budget, we keep it.",
  },
];
