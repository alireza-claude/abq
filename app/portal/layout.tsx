import { Vazirmatn } from "next/font/google";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-vazir",
});

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={vazir.variable}>
      <style>{`
        body > nav, body > footer { display: none !important; }
        [data-portal] {
          font-family: var(--font-vazir), Poppins, system-ui, sans-serif;
        }
        [data-portal] * {
          font-family: inherit;
        }
      `}</style>
      <div data-portal="">
        {children}
      </div>
    </div>
  );
}
