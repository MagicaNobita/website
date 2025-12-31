"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "rgba(74, 222, 128, 0.25)", // Default electric green glow
}: {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const div = divRef.current;
        const spotlight = spotlightRef.current;
        if (!div || !spotlight) return;

        // Use quickTo for high performance mouse tracking
        const xTo = gsap.quickTo(spotlight, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(spotlight, "y", { duration: 0.4, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
            const rect = div.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            xTo(x);
            yTo(y);

            // Also subtly fade in/out based on proximity/enter/leave could be handled by CSS group-hover
            // But keeping opacity managed by CSS is fine for performance.
        };

        div.addEventListener("mousemove", handleMouseMove);

        return () => {
            div.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={divRef}
            className={cn(
                "relative rounded-3xl border border-border/50 bg-card/40 overflow-hidden group isolate",
                className
            )}
        >
            <div
                ref={spotlightRef}
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen"
                style={{
                    width: "600px",
                    height: "600px",
                    left: "-300px", // Center the spotlight
                    top: "-300px",
                    background: `radial-gradient(circle closest-side, ${spotlightColor}, transparent)`,
                    transform: "translate(0,0)" // Initial transform
                }}
            />
            <div className="relative h-full z-10">{children}</div>
        </div>
    );
};
