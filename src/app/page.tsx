import { Suspense } from "react";
import LandingClient from "./landing-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[color:var(--bg-0)] text-white">
          <div className="lux-container flex min-h-screen items-center justify-center">
            <div className="glass-panel">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                ЛОК VERA
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Загрузка страницы...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <LandingClient />
    </Suspense>
  );
}
