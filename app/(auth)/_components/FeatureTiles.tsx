function Tile({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-4 text-center text-sm font-semibold">
      {title}
    </div>
  );
}

export default function FeatureTiles() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Tile title="Verified Providers" />
      <Tile title="Quick Booking" />
      <Tile title="Quality Assured" />
      <Tile title="24/7 Support" />
    </div>
  );
}
