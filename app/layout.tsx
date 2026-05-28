import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevInspector from "@/components/DevInspector";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ABQ ALSYF Project Management Services — We Move The Earth",
    template: "%s | ABQ ALSYF",
  },
  description:
    "ABQ ALSYF Project Management Services — Dubai's premier excavation, earthwork, and material transport company. 500+ projects, 3+ years experience, 1M+ tons moved.",
  keywords: [
    "excavation",
    "earthwork",
    "grading",
    "material transport",
    "land clearing",
    "Dubai",
    "UAE",
    "United Arab Emirates",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body suppressHydrationWarning>
        <DevInspector />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
