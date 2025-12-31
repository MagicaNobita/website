"use client";

import { useEffect, useRef } from "react";

export const AuroraBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Configuration
        const blobs = [
            { x: width * 0.2, y: height * 0.3, r: 400, color: "rgba(74, 222, 128, 0.15)", vx: 0.5, vy: 0.5 }, // Primary green
            { x: width * 0.8, y: height * 0.7, r: 500, color: "rgba(59, 130, 246, 0.15)", vx: -0.5, vy: -0.5 }, // Blue
            { x: width * 0.5, y: height * 0.5, r: 600, color: "rgba(147, 51, 234, 0.10)", vx: 0.3, vy: -0.3 }, // Purple
        ];

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Global blend mode for "Aurora" effect
            ctx.globalCompositeOperation = "screen";

            blobs.forEach(blob => {
                // Move
                blob.x += blob.vx;
                blob.y += blob.vy;

                // Bounce
                if (blob.x < -blob.r || blob.x > width + blob.r) blob.vx *= -1;
                if (blob.y < -blob.r || blob.y > height + blob.r) blob.vy *= -1;

                // Draw
                const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
                gradient.addColorStop(0, blob.color);
                gradient.addColorStop(1, "rgba(0,0,0,0)");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0 opacity-60 mix-blend-plus-lighter"
        />
    );
};
