"use client";

import { useCallback, useState } from "react";
import LightSpeed from "./LightSpeed";

type GameState = "idle" | "playing" | "over";

export default function Home() {
  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const handleScore = useCallback((s: number) => setScore(s), []);
  const handleGameOver = useCallback((s: number) => {
    setState("over");
    setScore(s);
    setBest((b) => Math.max(b, s));
  }, []);

  const start = () => {
    setScore(0);
    setState("playing");
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <LightSpeed
        playing={state === "playing"}
        onScore={handleScore}
        onGameOver={handleGameOver}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]" />

      {/* Top-left HUD */}
      <div className="pointer-events-none absolute left-8 top-8 z-10 sm:left-12 sm:top-12">
        <div className="text-xs tracking-[0.4em] text-white/50">
          OMEGA · WARP
        </div>
        <h1 className="mt-3 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
          Into Lightspeed
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/60 sm:text-base">
          Dodge the asteroid field. Use mouse or WASD / arrow keys.
        </p>

        <div className="mt-6 flex items-center gap-6 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Score
            </div>
            <div className="font-mono text-2xl tabular-nums text-white">
              {score.toString().padStart(5, "0")}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Best
            </div>
            <div className="font-mono text-2xl tabular-nums text-white/70">
              {best.toString().padStart(5, "0")}
            </div>
          </div>
        </div>
      </div>

      {/* Center overlay: start / game over */}
      {state !== "playing" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-black/40 px-10 py-8 backdrop-blur-xl">
            {state === "over" ? (
              <>
                <div className="text-xs tracking-[0.4em] text-rose-300/80">
                  IMPACT · SIGNAL LOST
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Final Score
                  </div>
                  <div className="font-mono text-5xl tabular-nums">
                    {score.toString().padStart(5, "0")}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-xs tracking-[0.4em] text-white/60">
                READY TO ENGAGE
              </div>
            )}
            <button
              onClick={start}
              className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              {state === "over" ? "Try Again" : "Start"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom-right HUD */}
      <div className="pointer-events-none absolute bottom-6 right-8 z-10 text-xs tracking-widest text-white/40">
        {state === "playing" ? "SYSTEMS · NOMINAL" : "STANDBY"}
      </div>
    </main>
  );
}
