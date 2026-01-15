"use client"

import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { CodePreview } from "@/components/home/CodePreview";
import { CTASection } from "@/components/home/CTASection";
import { LogoTicker } from "@/components/home/LogoTicker";
import { StatsSection } from "@/components/home/StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background dotted-bg overflow-x-hidden text-foreground">
      <div className="w-full flex flex-col items-center">
        <HeroSection />

        {/* Full Width Ticker */}
        <LogoTicker />

        <div className="container px-4 md:px-6 flex flex-col items-center w-full max-w-7xl gap-20 py-20">
          <CodePreview />

          <StatsSection />

          <FeatureGrid />

          <CTASection />
        </div>
      </div>
    </div>
  );
}
