"use client";

import { useRef, useState } from "react";
import { usePreloader } from "./context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Preloader = () => {
    const { isLoading, setIsLoading } = usePreloader();
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [currentWord, setCurrentWord] = useState("Initializing");

    useGSAP(() => {
        if (!isLoading) return;

        // Lock Body Scroll
        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                document.body.style.overflow = "";
            }
        });

        // 1. Text Sequence
        const words = ["Initializing", "Syncing", "Indexing", "BAMBOO"];

        // Manual Word Cycle via Timeline callbacks for precise control
        words.forEach((word, i) => {
            // Change word
            tl.call(() => setCurrentWord(word));

            // Animate In
            tl.fromTo(textRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
            );

            // Wait (unless it's the last word)
            if (i < words.length - 1) {
                tl.to(textRef.current, {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    delay: 0.1
                });
            } else {
                // Last word (BAMBOO) stays longer
                tl.to(textRef.current, { duration: 0.8 });

                // Then fade out text
                tl.to(textRef.current, {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    ease: "power2.in"
                });
            }
        });

        // 2. Curtain Split Animation
        tl.to(".curtain-top", {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "<+=0.1");

        tl.to(".curtain-bottom", {
            yPercent: 100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "<"); // Run simultaneously

        // 3. Fade out container (cleanup)
        tl.to(containerRef.current, {
            display: "none",
            duration: 0
        });

    }, { scope: containerRef });

    if (!isLoading) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none">
            {/* Top Curtain */}
            <div className="curtain-top absolute top-0 left-0 w-full h-[50vh] bg-primary z-20"></div>

            {/* Bottom Curtain */}
            <div className="curtain-bottom absolute bottom-0 left-0 w-full h-[50vh] bg-primary z-20"></div>

            {/* Text Container */}
            <div className="relative z-30 overflow-hidden mix-blend-difference">
                <h1 ref={textRef} className="text-white text-5xl md:text-8xl font-bold tracking-tighter uppercase font-[family-name:var(--font-space)]">
                    {currentWord}
                </h1>
            </div>
        </div>
    );
};
