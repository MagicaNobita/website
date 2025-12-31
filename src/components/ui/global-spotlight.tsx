"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export const GlobalSpotlight = () => {
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const spotlight = spotlightRef.current;
        if (!spotlight) return;

        // Use quickTo for high performance mouse tracking
        const xTo = gsap.quickTo(spotlight, "x", { duration: 0.6, ease: "power3", anchor: 0.5 });
        const yTo = gsap.quickTo(spotlight, "y", { duration: 0.6, ease: "power3", anchor: 0.5 });

        const handleMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={spotlightRef}
            className="fixed top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen -translate-x-1/2 -translate-y-1/2"
            style={{
                willChange: "transform",
                // Initially hide until first move to prevent jumping? 
                // Or start centered. Let's start at -1000,-1000 to be hidden.
            }}
        />
    );
};
