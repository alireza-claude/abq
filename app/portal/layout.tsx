export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide site navbar and footer on portal pages */}
      <style>{`
        body > nav, body > footer { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
