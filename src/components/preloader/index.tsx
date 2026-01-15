"use client";

import { useRef, useState, useEffect } from "react";
import { usePreloader } from "./context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export const Preloader = () => {
    const { isLoading, setIsLoading } = usePreloader();

    // Fix Hydration Mismatch: Only render on client
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const motionLayerRef = useRef<HTMLDivElement>(null);
    const fromTextRef = useRef<HTMLParagraphElement>(null);
    const leftGroupRef = useRef<HTMLDivElement>(null);
    const rightGroupRef = useRef<HTMLDivElement>(null);
    const targetLeftRef = useRef<HTMLHeadingElement>(null);
    const targetRightRef = useRef<HTMLHeadingElement>(null);
    const wipeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Must wait for mount and ref
        if (!isMounted || !containerRef.current || !isLoading) return;

        const container = containerRef.current;
        const bg = bgRef.current;
        const motionLayer = motionLayerRef.current;
        const fromText = fromTextRef.current;
        const leftGroup = leftGroupRef.current;
        const rightGroup = rightGroupRef.current;
        const targetLeft = targetLeftRef.current;
        const targetRight = targetRightRef.current;
        const wipe = wipeRef.current;

        if (!bg || !motionLayer || !fromText || !leftGroup || !rightGroup || !targetLeft || !targetRight || !wipe) return;

        // Prevent scrolling while the preloader is active
        const originalOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";

        if (!CustomEase.get("hop")) {
            CustomEase.create("hop", "M0,0 C0.12,0 0.18,0.04 0.22,0.12 0.28,0.26 0.22,0.44 0.34,0.56 0.52,0.74 0.72,1 1,1");
        }

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                document.documentElement.style.overflow = originalOverflow;
            },
        });

        const splitToSpans = (el: HTMLElement, text: string, cls = "pm-char") => {
            el.innerHTML = "";
            const spans: HTMLSpanElement[] = [];
            for (const ch of text) {
                const s = document.createElement("span");
                s.className = cls;
                if (ch === " ") {
                    s.dataset.space = "1";
                    s.innerHTML = "&nbsp;";
                } else {
                    s.textContent = ch;
                }
                s.dataset.char = ch.toLowerCase();
                el.appendChild(s);
                spans.push(s);
            }
            return spans;
        };

        const mapLetters = (
            fromSpans: HTMLSpanElement[],
            toSpans: HTMLSpanElement[],
            fromHost: HTMLElement
        ) => {
            const pool = new Map<string, HTMLSpanElement[]>();
            for (const s of fromSpans) {
                const key = (s.dataset.char || "").toLowerCase();
                if (!pool.has(key)) pool.set(key, []);
                pool.get(key)!.push(s);
            }
            const picked: HTMLSpanElement[] = [];
            const mapping = new Map<HTMLSpanElement, HTMLSpanElement>();
            for (const target of toSpans) {
                const key = (target.dataset.char || "").toLowerCase();
                const bucket = pool.get(key) || [];
                let found: HTMLSpanElement | undefined;
                while (bucket.length) {
                    const cand = bucket.shift()!;
                    if (cand.dataset.space !== "1") {
                        found = cand;
                        break;
                    }
                }
                if (found) {
                    picked.push(found);
                    mapping.set(found, target);
                } else {
                    const fresh = target.cloneNode(true) as HTMLSpanElement;
                    fresh.style.opacity = "0";
                    fresh.style.position = "absolute";
                    fresh.style.left = "0";
                    fresh.style.top = "0";
                    fresh.style.pointerEvents = "none";
                    fresh.classList.add("pm-fresh");
                    fromHost.appendChild(fresh);
                    picked.push(fresh);
                    mapping.set(fresh, target);
                }
            }
            const pickedSet = new Set(picked);
            const unused = fromSpans.filter(
                (s) => !pickedSet.has(s) && s.dataset.space !== "1"
            );
            return { picked, mapping, unused };
        };

        const fromTextValue = fromText.textContent || "Build a modular base for blockchain on EVM.";
        const targetLeftValue = targetLeft.textContent || "Bamboo";
        const targetRightValue = targetRight.textContent || "EVM";

        const fromSpans = splitToSpans(fromText, fromTextValue, "pm-char pm-from");
        const targetLeftSpans = splitToSpans(targetLeft, targetLeftValue, "pm-char pm-target");
        const targetRightSpans = splitToSpans(targetRight, targetRightValue, "pm-char pm-target");
        const targetSpans = [...targetLeftSpans, ...targetRightSpans];

        gsap.set(container, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(bg, { autoAlpha: 1 });
        gsap.set([fromSpans, targetSpans], { display: "inline-block", willChange: "transform,opacity", transform: "translateZ(0)" });
        gsap.set([leftGroup, rightGroup], { autoAlpha: 1 });
        gsap.set(targetSpans, { autoAlpha: 0 });
        gsap.set(fromSpans, { autoAlpha: 0, scale: 0.98, y: 18, transformOrigin: "50% 50%" });
        gsap.set(leftGroup, { x: -320, scale: 1 });
        gsap.set(rightGroup, { x: 320, scale: 1 });
        gsap.set(wipe, { scaleX: 0, transformOrigin: "left center", autoAlpha: 0 });

        tl.to(bg, {
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
        });

        const midIndex = Math.floor(fromSpans.length / 2);
        fromSpans.forEach((span, index) => {
            const dir = index < midIndex ? -1 : 1;
            gsap.set(span, { x: dir * 220 });
        });

        tl.to(fromSpans, {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            stagger: { each: 0.015, from: "edges" },
        }, "-=0.2");

        tl.to(fromText, {
            scaleX: 0.92,
            scaleY: 0.98,
            letterSpacing: "-0.03em",
            duration: 0.6,
            ease: "power3.out",
        }, "+=0.1");

        tl.to(fromText, {
            scaleX: 0.98,
            scaleY: 0.99,
            letterSpacing: "-0.01em",
            duration: 0.5,
            ease: "power2.out",
        });

        tl.addLabel("morph");
        tl.add(() => {
            const motionRect = motionLayer.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const centerX = containerRect.left + containerRect.width / 2;
            const centerY = containerRect.top + containerRect.height / 2;

            const { picked, unused, mapping } = mapLetters(fromSpans, targetSpans, fromText);

            gsap.to(unused, { autoAlpha: 0, duration: 0.25, ease: "power2.in" });

            const movers: HTMLSpanElement[] = [];
            const duration = 1.1;
            const squeezeDuration = 0.3;

            gsap.set(fromText, { transformOrigin: "50% 50%" });
            gsap.to(fromText, {
                scaleX: 0.85,
                scaleY: 0.93,
                letterSpacing: "-0.05em",
                duration: squeezeDuration,
                ease: "power4.in",
            });
            gsap.to(fromText, {
                scaleX: 0.98,
                scaleY: 0.98,
                letterSpacing: "-0.01em",
                duration: duration - squeezeDuration,
                ease: "power3.out",
                delay: squeezeDuration,
            });

            for (const span of picked) {
                const target = mapping.get(span)!;
                const targetBox = target.getBoundingClientRect();
                const sourceBox = span.getBoundingClientRect();

                let fromLeft = sourceBox.left;
                let fromTop = sourceBox.top;
                let fromWidth = sourceBox.width;
                let fromHeight = sourceBox.height;

                const mover = target.cloneNode(true) as HTMLSpanElement;
                mover.classList.add("pm-morph");
                if (span.classList.contains("pm-fresh")) {
                    const fromRect = fromText.getBoundingClientRect();
                    fromLeft = fromRect.left + fromRect.width / 2;
                    fromTop = fromRect.top + fromRect.height / 2;
                    fromWidth = Math.max(1, targetBox.width * 0.5);
                    fromHeight = Math.max(1, targetBox.height * 0.5);
                }
                motionLayer.appendChild(mover);

                mover.style.position = "absolute";
                mover.style.left = `${fromLeft - motionRect.left}px`;
                mover.style.top = `${fromTop - motionRect.top}px`;
                mover.style.width = `${fromWidth}px`;
                mover.style.height = `${fromHeight}px`;
                mover.style.transformOrigin = "top left";
                mover.style.margin = "0";

                movers.push(mover);

                const finalDx = targetBox.left - fromLeft;
                const finalDy = targetBox.top - fromTop;
                const toCenterX = centerX - (fromLeft + fromWidth / 2);
                const toCenterY = centerY - (fromTop + fromHeight / 2);

                gsap.set(mover, { scale: 1, autoAlpha: 1 });
                gsap.to(mover, {
                    keyframes: [
                        {
                            x: toCenterX,
                            y: toCenterY,
                            duration: squeezeDuration,
                            ease: "power4.in",
                        },
                        {
                            x: finalDx,
                            y: finalDy,
                            duration: duration - squeezeDuration,
                            ease: "power3.out",
                        },
                    ],
                });
            }

            gsap.to(picked, { autoAlpha: 0, duration: 0.2, ease: "power1.out" });
            gsap.delayedCall(duration, () => {
                gsap.set(targetSpans, { autoAlpha: 1 });
                gsap.set(fromText, { autoAlpha: 0 });
                for (const mover of movers) mover.remove();
            });
        }, "morph");

        tl.to({}, { duration: 1.1 }, "morph");

        tl.to(leftGroup, {
            x: -140,
            duration: 0.24,
            ease: "power4.inOut",
        }, "+=0.04");
        tl.to(rightGroup, {
            x: 140,
            duration: 0.24,
            ease: "power4.inOut",
        }, "<");

        tl.to(leftGroup, {
            x: -40,
            scale: 0.85,
            duration: 0.2,
            ease: "power4.in",
        });
        tl.to(rightGroup, {
            x: 40,
            scale: 1.6,
            duration: 0.2,
            ease: "power4.in",
        }, "<");

        tl.to({}, { duration: 0.35 });

        tl.to(wipe, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
        });

        tl.to(container, {
            clipPath: "inset(49% 0% 49% 0%)",
            duration: 0.7,
            ease: "power2.inOut",
        }, "<");

        tl.to(container, {
            clipPath: "inset(50% 0% 50% 0%)",
            duration: 0.45,
            ease: "power2.inOut",
        });

        tl.to(container, {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power1.out",
        });

        tl.set(container, { display: "none" });

    }, { scope: containerRef, dependencies: [isMounted] });


    if (!isMounted || !isLoading) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none"
        >
            <div className="absolute inset-0 z-10 bg-primary" />
            <div ref={bgRef} className="absolute inset-0 z-20 bg-black" />

            <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="relative flex items-center justify-center text-black font-[family-name:var(--font-space)] font-semibold tracking-tight">
                    <div ref={motionLayerRef} className="absolute inset-0 pointer-events-none" />
                    <p
                        ref={fromTextRef}
                        className="max-w-4xl text-center text-xl md:text-4xl leading-snug tracking-[-0.02em]"
                    >
                        Build a modular base for blockchain on EVM.
                    </p>
                    <div
                        ref={leftGroupRef}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-8xl font-bold tracking-tight"
                    >
                        <h1 ref={targetLeftRef}>Bamboo</h1>
                    </div>
                    <div
                        ref={rightGroupRef}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-8xl font-bold tracking-tight"
                    >
                        <h1 ref={targetRightRef}>EVM</h1>
                    </div>
                </div>
            </div>

            <div
                ref={wipeRef}
                className="absolute left-0 right-0 top-1/2 z-40 h-[6px] -translate-y-1/2 bg-black"
            />

            <style jsx>{`
                .pm-char {
                    display: inline-block;
                    will-change: transform, opacity;
                    transform: translateZ(0);
                    -webkit-font-smoothing: antialiased;
                    text-rendering: geometricPrecision;
                }
                .pm-char[data-space="1"] {
                    width: 0.35em;
                }
                .pm-morph {
                    position: absolute;
                    will-change: transform, opacity;
                    transform: translateZ(0);
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};
