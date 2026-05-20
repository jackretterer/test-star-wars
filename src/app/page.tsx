import LightSpeed from "./LightSpeed";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <LightSpeed />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-8 py-12 sm:px-16">
        <header className="flex w-full max-w-6xl items-center justify-between">
          <span className="text-sm font-medium tracking-[0.3em] text-white/70">
            OMEGA · WARP
          </span>
          <span className="text-xs tracking-widest text-white/40">
            VELOCITY · 9.99c
          </span>
        </header>

        <div className="flex flex-col items-center text-center">
          <h1 className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-6xl font-semibold tracking-tight text-transparent sm:text-8xl">
            Into Lightspeed
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/60 sm:text-lg">
            Strap in. We&apos;re punching through the dark — past stars, past
            time, past everything you thought was the edge.
          </p>
          <div className="mt-10 flex gap-4">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90">
              Engage
            </button>
            <button className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10">
              Star Charts
            </button>
          </div>
        </div>

        <footer className="flex w-full max-w-6xl items-center justify-between text-xs tracking-widest text-white/40">
          <span>SECTOR · 0xA17C</span>
          <span>SYSTEMS · NOMINAL</span>
        </footer>
      </div>
    </main>
  );
}
