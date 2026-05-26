import Hero from "@/components/Hero";
import StatsBanner from "@/components/StatsBanner";
import ServicesGrid from "@/components/ServicesGrid";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBanner />
      <ServicesGrid />
      <FeaturedProjects />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </>
  );
}
