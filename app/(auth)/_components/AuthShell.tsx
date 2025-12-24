import Image from "next/image";

export default function AuthShell({
  left,
  rightTitle,
  rightSubtitle,
  rightImageSrc,
  footerBlocks,
  stats,
  reverseOnMobile = false,
}: {
  left: React.ReactNode;
  rightTitle: string;
  rightSubtitle: string;
  rightImageSrc: string;
  footerBlocks?: React.ReactNode;
  stats?: React.ReactNode;
  reverseOnMobile?: boolean;
}) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg">
        <div
          className={`grid min-h-[650px] grid-cols-1 md:grid-cols-2 ${
            reverseOnMobile ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Left Panel */}
          <section className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">{left}</div>
          </section>

          {/* Right Panel */}
          <section className="relative flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 p-6 md:p-10">
            <div className="w-full max-w-md text-center text-white">
              <div className="mx-auto mb-6 w-full overflow-hidden rounded-xl bg-white/10 p-6">
                <div className="relative mx-auto aspect-[4/3] w-full">
                  <Image
                    src={rightImageSrc}
                    alt="Auth Visual"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold">{rightTitle}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-white/85">
                {rightSubtitle}
              </p>

              {stats && <div className="mt-7">{stats}</div>}
              {footerBlocks && <div className="mt-7">{footerBlocks}</div>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
