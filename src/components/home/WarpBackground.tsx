"use client";

import { useEffect, useRef } from "react";

export const WarpBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Bamboo Theme Gradient Mesh
        // Soft, flowing blobs of Green and White
        const blobs = [
            { x: 0.2, y: 0.2, r: 0.4, color: "rgba(220, 252, 231, 0.6)", vx: 0.001, vy: 0.002 }, // Pale Green
            { x: 0.8, y: 0.8, r: 0.5, color: "rgba(187, 247, 208, 0.5)", vx: -0.002, vy: -0.001 }, // Light Green
            { x: 0.5, y: 0.5, r: 0.3, color: "rgba(255, 255, 255, 0.8)", vx: 0.001, vy: -0.002 }, // White Highlight
            { x: 0.8, y: 0.2, r: 0.4, color: "rgba(22, 163, 74, 0.05)", vx: -0.001, vy: 0.001 }, // Deep Green (very subtle)
        ];

        const render = () => {
            // Clear
            ctx.clearRect(0, 0, width, height);

            // Base Background: Off-white
            ctx.fillStyle = "#fafafa"; // Nearly white
            ctx.fillRect(0, 0, width, height);

            // Draw Blobs with blur
            // We use a large blur filter for softness
            ctx.filter = "blur(80px)";

            blobs.forEach((blob) => {
                // Animate position
                blob.x += blob.vx;
                blob.y += blob.vy;

                // Bounce off edges
                if (blob.x < -0.2 || blob.x > 1.2) blob.vx *= -1;
                if (blob.y < -0.2 || blob.y > 1.2) blob.vy *= -1;

                // Draw blob
                const x = blob.x * width;
                const y = blob.y * height;
                const r = blob.r * Math.min(width, height);

                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = blob.color;
                ctx.fill();
            });

            ctx.filter = "none"; // Reset filter
        };

        let animateId = 0;
        const loop = () => {
            render();
            animateId = requestAnimationFrame(loop);
        };
        loop();

        const handleResize = () => {
            if (canvasRef.current) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                width = canvas.width;
                height = canvas.height;
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initialize size

        return () => {
            cancelAnimationFrame(animateId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none block" />
    );
};
