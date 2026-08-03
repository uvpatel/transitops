"use client";
import React from "react";
import Link from "next/link";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { Button } from "@/components/ui/button";

export default function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 py-20 text-center">
      <div className="absolute inset-0">
        <ShootingStars />
        <StarsBackground />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <div className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm font-medium text-slate-200 backdrop-blur">
          Fleet operations, simplified
        </div>
        <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          TransitOps keeps every vehicle, driver, and dispatch move in sync.
        </h2>
        <p className="max-w-2xl text-lg text-slate-300">
          Monitor fleets in real time, manage maintenance, and keep compliance workflows organized from one secure dashboard.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="min-w-36">
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="outline" size="lg" className="min-w-36 border-white/20 bg-white/10 text-white hover:bg-white/20">
            <Link href="/sign-up">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
