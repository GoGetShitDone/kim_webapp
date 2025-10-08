"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SplashPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "cafe-owner";
  const targetHref = `/dashboard?role=${encodeURIComponent(role)}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(targetHref);
    }, 5000);
    return () => clearTimeout(timer);
  }, [router, targetHref]);

  function handleContinue() {
    router.push(targetHref);
  }

  return (
    <button
      type="button"
      onClick={handleContinue}
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-8 px-6 text-slate-100 transition hover:brightness-105"
    >
      <div className="space-y-3 text-center">
        <h1 className="text-6xl font-semibold text-white">김비서</h1>
        <p className="text-lg text-slate-200">사장님의 든든한 파트너 AI</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span
            className="h-2 w-2 rounded-full bg-sky-400"
            style={{ animation: "splashBlink 1.4s ease-in-out infinite" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-emerald-400"
            style={{ animation: "splashBlink 1.4s ease-in-out infinite", animationDelay: "0.2s" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-rose-400"
            style={{ animation: "splashBlink 1.4s ease-in-out infinite", animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </button>
  );
}
