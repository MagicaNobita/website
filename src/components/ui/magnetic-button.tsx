"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    strength?: number; // How strong the magnetic pull is (default: 0.3)
}

export const MagneticButton = ({
    children,
    className,
    strength = 0.3,
    ...props
}: MagneticButtonProps) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        const text = textRef.current;
        if (!button || !text) return;

        const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        // For text, we move it slightly less for a parallax feel
        const xToText = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yToText = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = button.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * strength);
            yTo(y * strength);

            xToText(x * (strength * 0.5));
            yToText(y * (strength * 0.5));
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
            xToText(0);
            yToText(0);
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return (
        <div
            ref={buttonRef}
            className={cn("relative isolate inline-block", className)}
            {...props}
        >
            <span ref={textRef} className="relative z-10 block pointer-events-none">
                {children}
            </span>
        </div>
    );
};
