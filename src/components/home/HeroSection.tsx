"use client";

import Link from "next/link";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { WarpBackground } from "@/components/home/WarpBackground";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

import { usePreloader } from "@/components/preloader/context";

export const HeroSection = () => {
    const { isLoading } = usePreloader();
    const [copied, setCopied] = useState(false);

    // Refs for GSAP animation
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (isLoading) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Set initial state (autoAlpha handles visibility + opacity)
        gsap.set([titleRef.current, descRef.current], {
            y: 50,
            autoAlpha: 0
        });

        tl.to(titleRef.current, { y: 0, autoAlpha: 1, duration: 1 })
            .to(descRef.current, { y: 0, autoAlpha: 1, duration: 1 }, "-=0.8");

    }, [isLoading]);

    const handleCopy = () => {
        navigator.clipboard.writeText("npm install bamboo-starter");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <section ref={containerRef} className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
            {/* Warped Grid Background */}
            <WarpBackground />

            <div className="relative z-10 container px-4 md:px-6 w-full max-w-7xl h-full flex flex-col md:flex-row items-center justify-center text-center mt-20 md:mt-0">

                {/* Center Content since Right Visual is gone */}
                <div className="flex-1 flex flex-col items-center space-y-8 max-w-4xl">
                    <h1
                        ref={titleRef}
                        className="invisible text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] text-foreground font-[family-name:var(--font-space)]"
                    >
                        Index The <br />
                        Future with <br />
                        <span className="text-primary">Bamboo</span>
                    </h1>

                    <div ref={descRef} className="invisible space-y-8 flex flex-col items-center">
                        <p className="text-sm md:text-xl text-foreground/80 max-w-xl leading-relaxed">
                            The lightweight, <strong>Spring Boot native</strong> indexer for high-performance EVM applications. Sync events, automate schemas, and scale effortlessly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            {/* Documentation Button */}
                            <Link
                                href="/docs"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:shadow-[0_0_20px_-5px_var(--color-primary)] hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                Read Documentation
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>

                            {/* Copy Command Button */}
                            <button
                                onClick={handleCopy}
                                className="group relative inline-flex items-center justify-between gap-4 px-6 py-4 rounded-full bg-white/40 border border-black/5 backdrop-blur-md hover:bg-white/60 transition-all cursor-pointer min-w-[300px]"
                            >
                                <span className="font-mono text-sm text-foreground/80">npm install bamboo-starter</span>
                                <div className="p-2 rounded-full bg-black/5 text-foreground/60 group-hover:bg-primary group-hover:text-white transition-colors">
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </div>
                                {copied && (
                                    <span className="absolute -top-8 right-0 text-xs font-bold text-primary bg-white px-2 py-1 rounded shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
