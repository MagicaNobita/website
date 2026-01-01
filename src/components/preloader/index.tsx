"use client";

import { useRef, useState } from "react";
import { usePreloader } from "./context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Preloader = () => {
    const { isLoading, setIsLoading } = usePreloader();
    const containerRef = useRef<HTMLDivElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isLoading) return;

        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                document.body.style.overflow = "";
            }
        });

        // 0. Initial States
        gsap.set(paragraphRef.current, { opacity: 0, y: 20, filter: "blur(0px)" });
        gsap.set(titleRef.current, { opacity: 0, scale: 0.8, filter: "blur(10px)", display: "none" });
        gsap.set(lineRef.current, { scaleX: 0, opacity: 1, transformOrigin: "left" }); // Line visible but scale 0

        // 1. Show Paragraph
        tl.to(paragraphRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });

        // 2. Morph: Paragraph -> Bamboo
        // Paragraph collapses/blurs out
        tl.to(paragraphRef.current, {
            opacity: 0,
            scale: 0.9,
            filter: "blur(10px)",
            duration: 0.8,
            ease: "power2.inOut",
            delay: 0.5 // Reading time
        }, "morph");

        // Bamboo expands/focuses in (simulating evolution)
        tl.set(titleRef.current, { display: "block" }, "morph"); // Ensure block before animating
        tl.to(titleRef.current, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out"
        }, "morph+=0.2"); // Slight overlap for smooth transition

        // 3. Draw the Line (The Cut) - Only AFTER text morph is fully done
        tl.to(lineRef.current, {
            scaleX: 1,
            duration: 0.6,
            ease: "expo.inOut"
        });

        // 4. Split and Reveal
        // Title splits/fades with the cut
        tl.to(titleRef.current, {
            opacity: 0,
            duration: 0.2
        }, "split");

        tl.to(".curtain-top", {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "split");

        tl.to(".curtain-bottom", {
            yPercent: 100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "split");

        tl.to(lineRef.current, {
            opacity: 0,
            duration: 0.3
        }, "split+=0.1");

        // Cleanup
        tl.to(containerRef.current, {
            display: "none",
            duration: 0
        });

    }, { scope: containerRef });

    if (!isLoading) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none">
            {/* Top Curtain */}
            <div className="curtain-top absolute top-0 left-0 w-full h-[50vh] bg-primary z-20 flex items-end justify-center overflow-hidden border-b border-white/10"></div>

            {/* Bottom Curtain */}
            <div className="curtain-bottom absolute bottom-0 left-0 w-full h-[50vh] bg-primary z-20 flex items-start justify-center overflow-hidden border-t border-white/10"></div>

            {/* Content Layer */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center text-white mix-blend-difference">
                {/* Paragraph Stage */}
                <p ref={paragraphRef} className="max-w-xl text-xl md:text-3xl font-light leading-snug tracking-tight">
                    lightweight, Spring Boot native indexer for high-performance EVM applications.
                </p>

                {/* Title Stage - Absolute center to overlap perfectly for morph */}
                <h1 ref={titleRef} className="absolute text-7xl md:text-9xl font-bold tracking-tighter uppercase font-[family-name:var(--font-space)] hidden">
                    Bamboo
                </h1>
            </div>

            {/* Cut Line */}
            <div ref={lineRef} className="absolute top-[50%] left-0 w-full h-[2px] bg-white z-40 origin-left" />
        </div>
    );
};
