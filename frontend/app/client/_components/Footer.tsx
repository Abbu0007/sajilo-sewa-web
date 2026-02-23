import GlassCard from "./ui/GlassCard";

export default function Footer() {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-950 opacity-90" />
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      <GlassCard className="relative px-6 py-6 border border-white/25 bg-white/5 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-lg font-extrabold">Sajilo Sewa</div>
            <div className="mt-2 text-sm text-white/80">
              Nepal’s home service booking platform — find services, book providers, track requests.
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-white/95">Contact</div>
            <div className="mt-2 text-sm text-white/80 space-y-1">
              <div>Email: <span className="font-semibold text-white/95">dhamalaabhishek@sajilosewa.com</span></div>
              <div>Phone: <span className="font-semibold text-white/95">+977 9861344894</span></div>
              <div>Address: <span className="font-semibold text-white/95">Kathmandu, Nepal</span></div>
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold text-white/95">Links</div>
            <div className="mt-2 text-sm text-white/80 space-y-1">
              <div className="hover:text-white transition cursor-pointer">Services</div>
              <div className="hover:text-white transition cursor-pointer">Help Center</div>
              <div className="hover:text-white transition cursor-pointer">Privacy Policy</div>
              <div className="hover:text-white transition cursor-pointer">Terms &amp; Conditions</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/75">
          <div>© 2026 Sajilo Sewa. All rights reserved.</div>
        </div>
      </GlassCard>
    </div>
  );
}