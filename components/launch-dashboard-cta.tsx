"use client";

import { useMockAuth } from "@/components/mock-auth-provider";
import Link from "next/link";

export function LaunchDashboardCta() {
  const { signIn } = useMockAuth();

  return (
    <Link
      href="/auth"
      onClick={signIn}
      className="inline-flex w-full max-w-md items-center justify-center rounded-xl bg-electric-mix px-8 py-4 text-center text-base font-semibold tracking-wide text-veritas-bg shadow-glow-electric transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veritas-electric focus-visible:ring-offset-2 focus-visible:ring-offset-veritas-bg sm:w-auto sm:py-5 sm:text-lg"
    >
      Launch VERITAS Command Center
    </Link>
  );
}
