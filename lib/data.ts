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
  { id: 1, value: 500, suffix: "+", label: "Projects Completed" },
  { id: 2, value: 20, suffix: "+", label: "Years Experience" },
  { id: 3, value: 1, suffix: "M+ Tons", label: "Material Moved" },
  { id: 4, value: 50, suffix: "+", label: "Machines in Fleet" },
];

// ── Projects ────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: 1,
    title: "Downtown Civic Center Foundation",
    category: "Excavation",
    location: "Albuquerque, NM",
    year: 2024,
    image: "https://picsum.photos/seed/proj1/900/700",
    description:
      "Large-scale basement excavation for a 12-story civic center, including rock breaking and dewatering operations.",
    tags: ["Excavation", "Urban", "Commercial"],
  },
  {
    id: 2,
    title: "Rio Grande Industrial Park",
    category: "Earthwork",
    location: "Bernalillo County, NM",
    year: 2024,
    image: "https://picsum.photos/seed/proj2/900/700",
    description:
      "50-acre site preparation with precision grading, drainage installation, and compaction testing.",
    tags: ["Grading", "Industrial", "Large-Scale"],
  },
  {
    id: 3,
    title: "Mesa Vista Highway Expansion",
    category: "Transport",
    location: "Santa Fe, NM",
    year: 2023,
    image: "https://picsum.photos/seed/proj3/900/700",
    description:
      "Over 80,000 tons of base aggregate transported to support a major highway widening project.",
    tags: ["Transport", "Infrastructure", "Highway"],
  },
  {
    id: 4,
    title: "Bosque Ridge Residential Development",
    category: "Earthwork",
    location: "Rio Rancho, NM",
    year: 2023,
    image: "https://picsum.photos/seed/proj4/900/700",
    description:
      "Complete site development for 200-lot subdivision including mass grading and utility corridors.",
    tags: ["Grading", "Residential", "Subdivision"],
  },
  {
    id: 5,
    title: "Sandia Mines Overburden Removal",
    category: "Excavation",
    location: "Bernalillo, NM",
    year: 2023,
    image: "https://picsum.photos/seed/proj5/900/700",
    description:
      "Overburden stripping and precision rock excavation for mineral extraction operation.",
    tags: ["Excavation", "Mining", "Rock Breaking"],
  },
  {
    id: 6,
    title: "I-40 Rest Stop Reconstruction",
    category: "Earthwork",
    location: "Moriarty, NM",
    year: 2022,
    image: "https://picsum.photos/seed/proj6/900/700",
    description:
      "Full earthwork package including demolition, grading, drainage, and surface preparation.",
    tags: ["Grading", "Government", "Infrastructure"],
  },
  {
    id: 7,
    title: "Cottonwood Mall Parking Structure",
    category: "Excavation",
    location: "Albuquerque, NM",
    year: 2022,
    image: "https://picsum.photos/seed/proj7/900/700",
    description:
      "Parking structure excavation with shoring system installation in a tight urban environment.",
    tags: ["Excavation", "Commercial", "Urban"],
  },
  {
    id: 8,
    title: "Southern NM Solar Farm",
    category: "Transport",
    location: "Doña Ana County, NM",
    year: 2022,
    image: "https://picsum.photos/seed/proj8/900/700",
    description:
      "Material logistics and transport for a 500-acre utility-scale solar installation.",
    tags: ["Transport", "Energy", "Large-Scale"],
  },
];

// ── Testimonials ─────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "ABQ Excavation delivered exceptional results on our downtown project. Their precision and professionalism set them apart from every contractor we've worked with.",
    author: "Marcus Rivera",
    role: "Project Manager",
    company: "Sunstone Developers",
    stars: 5,
  },
  {
    id: 2,
    quote:
      "When we needed 40,000 tons of aggregate on a tight timeline, ABQ's transport team came through without a single delay. Truly world-class logistics.",
    author: "Sarah Chen",
    role: "Senior Engineer",
    company: "New Mexico DOT",
    stars: 5,
  },
  {
    id: 3,
    quote:
      "The grading precision on our 50-acre industrial site was outstanding. GPS accuracy, clean execution, and the project came in under budget.",
    author: "James Whitfield",
    role: "Director of Development",
    company: "Mesa Group LLC",
    stars: 5,
  },
];

// ── Team ─────────────────────────────────────────────────
export const team: TeamMember[] = [
  {
    id: 1,
    name: "Robert Castillo",
    role: "Founder & CEO",
    image: "https://picsum.photos/seed/team1/400/400",
    bio: "30 years in heavy civil construction with a vision for precision and reliability.",
  },
  {
    id: 2,
    name: "Diana Morales",
    role: "Operations Director",
    image: "https://picsum.photos/seed/team2/400/400",
    bio: "Logistics expert managing 50+ machines and a fleet of heavy transport vehicles.",
  },
  {
    id: 3,
    name: "Kevin Park",
    role: "Chief Engineer",
    image: "https://picsum.photos/seed/team3/400/400",
    bio: "P.E. with specialty in geotechnical engineering and GPS-guided grading systems.",
  },
  {
    id: 4,
    name: "Linda Torres",
    role: "Safety Manager",
    image: "https://picsum.photos/seed/team4/400/400",
    bio: "Maintaining our 10-year perfect safety record across all active job sites.",
  },
];

// ── Timeline ─────────────────────────────────────────────
export const timeline: TimelineEvent[] = [
  {
    id: 1,
    year: "2004",
    title: "Founded in Albuquerque",
    description:
      "Robert Castillo founded ABQ Excavation with two machines and an uncompromising commitment to quality.",
  },
  {
    id: 2,
    year: "2008",
    title: "Expanded to Material Transport",
    description:
      "Added a full fleet of dump trucks and articulated haulers, becoming a one-stop earthwork solution.",
  },
  {
    id: 3,
    year: "2012",
    title: "GPS Technology Integration",
    description:
      "Became one of the first contractors in New Mexico to adopt GPS-guided grading across the entire fleet.",
  },
  {
    id: 4,
    year: "2017",
    title: "100th Major Project",
    description:
      "Celebrated our 100th major project completion — the Paseo del Norte bridge expansion.",
  },
  {
    id: 5,
    year: "2020",
    title: "50-Machine Fleet",
    description:
      "Grew to 50+ machines, making us the largest independent excavation contractor in New Mexico.",
  },
  {
    id: 6,
    year: "2024",
    title: "500+ Projects Milestone",
    description:
      "Celebrating two decades of moving earth and building New Mexico's future.",
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
      "99% on-time project completion over two decades. When we commit to a schedule and a budget, we keep it.",
  },
];
