const items = [
  "EXCAVATION",
  "EARTHWORK",
  "MATERIAL TRANSPORT",
  "LAND CLEARING",
  "GRADING",
  "ROCK BREAKING",
  "SITE PREPARATION",
  "AGGREGATE DELIVERY",
];

export default function Ticker() {
  return (
    <div
      className="overflow-hidden border-t border-white/[0.07] py-[14px]"
      aria-hidden="true"
      role="presentation"
    >
      <div className="ticker-track flex whitespace-nowrap">
        {/* Duplicate for seamless loop — ticker-track animates -50% */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center text-[10px] font-semibold tracking-[0.22em] text-white/30 uppercase"
          >
            {item}
            <span className="mx-6 text-accent/40 text-base">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
