export default function StatsStrip() {
  const items = [
    { big: "500+", small: "Service Providers" },
    { big: "50k+", small: "Happy Customers" },
    { big: "24/7", small: "Support" },
  ];

  return (
    <div className="mt-6 grid grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.big} className="text-center">
          <div className="text-xl font-bold">{it.big}</div>
          <div className="text-[11px] text-white/80">{it.small}</div>
        </div>
      ))}
    </div>
  );
}
