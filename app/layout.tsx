import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ABQ Excavation — We Move The Earth",
    template: "%s | ABQ Excavation",
  },
  description:
    "Albuquerque's premier excavation, earthwork, and material transport contractor. 500+ projects, 20+ years experience, 1M+ tons moved.",
  keywords: [
    "excavation",
    "earthwork",
    "grading",
    "material transport",
    "land clearing",
    "Albuquerque",
    "New Mexico",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
