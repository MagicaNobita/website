"use client";

import { useRef } from "react";
import { usePreloader } from "./context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Improved Preloader component that displays a long sentence,
 * then morphs those characters into a short title ("Bamboo"). Timings
 * are deliberately lengthened to approximate the smooth pacing of the
 * pesqueradiez.com preloader. Requires the
 * parent component to provide `isLoading` and `setIsLoading` via
 * PreloaderContext.
 */
export const Preloader = () => {
    const { isLoading, setIsLoading } = usePreloader();
    const containerRef = useRef<HTMLDivElement>(null);
    const motionLayerRef = useRef<HTMLDivElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isLoading) return;

        const paragraph = paragraphRef.current;
        const title = titleRef.current;
        const line = lineRef.current;
        const motionLayer = motionLayerRef.current;
        if (!paragraph || !title || !line || !motionLayer) return;

        // Prevent scrolling while the preloader is active
        const originalOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                document.documentElement.style.overflow = originalOverflow;
            },
        });

        // Helper: break a string into span elements for individual character animation.
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

        // Helper: map characters from the paragraph to the title.
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
                    // if the character is missing, clone from the target
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

        // Build spans up front so the timeline can control them deterministically.
        const paragraphText = paragraph.textContent || "";
        const paragraphSpans = splitToSpans(paragraph, paragraphText, "pm-char pm-from");
        gsap.set(paragraphSpans, {
            display: "inline-block",
            willChange: "transform,opacity",
            transform: "translateZ(0)",
        });

        const titleText = title.textContent || "Bamboo";
        const titleSpans = splitToSpans(title, titleText, "pm-char pm-target");
        titleSpans.forEach((span) => {
            if ((span.dataset.char || "") === "b") {
                span.classList.add("pm-big");
            }
        });
        gsap.set(titleSpans, {
            display: "inline-block",
            willChange: "transform,opacity",
            transform: "translateZ(0)",
        });

        // Initial states: hide everything (but don't use display:none to allow measurement)
        gsap.set(paragraph, { autoAlpha: 0, y: 18 });
        gsap.set(title, { autoAlpha: 0, scale: 0.985 });
        gsap.set(line, { autoAlpha: 0, scaleX: 0, scaleY: 1 });

        // Step 1: long sentence appears immediately (no entrance animation)
        tl.set(paragraph, { autoAlpha: 1, y: 0 });
        tl.set(paragraphSpans, { autoAlpha: 1, x: 0, y: 0, scale: 1 });

        // Pause 1s to read the sentence
        tl.to({}, { duration: 1.0 });

        // Step 2: morph the long sentence into the title (1.0 s)
        tl.addLabel("flip");
        tl.add(() => {
            const motionRect = motionLayer.getBoundingClientRect();
            const titleRect = title.getBoundingClientRect();

            gsap.set(title, { autoAlpha: 1 });
            gsap.set(titleSpans, { autoAlpha: 0 });

            const fromSpans = Array.from(
                paragraph.querySelectorAll("span.pm-char")
            ) as HTMLSpanElement[];
            const { picked, mapping, unused } = mapLetters(fromSpans, titleSpans, paragraph);
            const paragraphRect = paragraph.getBoundingClientRect();
            const forIndex = paragraphText.toLowerCase().indexOf("for");
            const forSpan = forIndex >= 0 ? paragraphSpans[forIndex] : null;
            const forRect = forSpan?.getBoundingClientRect();
            const centerX = forRect ? forRect.left + forRect.width / 2 : titleRect.left + titleRect.width / 2;
            const centerY = forRect ? forRect.top + forRect.height / 2 : titleRect.top + titleRect.height / 2;

            // Fade out letters not used in "Bamboo".
            gsap.to(unused, {
                autoAlpha: 0,
                duration: 0.35,
                ease: "power2.out",
            });

            const movers: HTMLSpanElement[] = [];
            const duration = 1.3;
            const squeezeDuration = 0.45;

            gsap.set(paragraph, { transformOrigin: "50% 50%" });
            gsap.to(paragraph, {
                scaleX: 0.58,
                scaleY: 0.92,
                letterSpacing: "-0.08em",
                duration: squeezeDuration,
                ease: "power4.inOut",
            });
            gsap.to(paragraph, {
                scaleX: 0.85,
                scaleY: 0.98,
                letterSpacing: "-0.02em",
                duration: duration - squeezeDuration,
                ease: "expo.out",
                delay: squeezeDuration,
            });

            for (const span of picked) {
                const target = mapping.get(span)!;
                const targetRect = target.getBoundingClientRect();
                const sourceRect = span.getBoundingClientRect();

                let fromLeft = sourceRect.left;
                let fromTop = sourceRect.top;
                let fromWidth = sourceRect.width;
                let fromHeight = sourceRect.height;

                const mover = target.cloneNode(true) as HTMLSpanElement;
                mover.classList.add("pm-morph");
                if (span.classList.contains("pm-fresh")) {
                    fromLeft = paragraphRect.left + paragraphRect.width / 2;
                    fromTop = paragraphRect.top + paragraphRect.height / 2;
                    fromWidth = Math.max(1, targetRect.width * 0.5);
                    fromHeight = Math.max(1, targetRect.height * 0.5);
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

                const finalDx = targetRect.left - fromLeft;
                const finalDy = targetRect.top - fromTop;
                const isBig = mover.classList.contains("pm-big");
                const startScale = isBig ? 0.6 : 1;

                gsap.set(mover, { scale: startScale, autoAlpha: 1 });
                const toCenterX = centerX - (fromLeft + fromWidth / 2);
                const toCenterY = centerY - (fromTop + fromHeight / 2);
                gsap.to(mover, {
                    keyframes: [
                        {
                            x: toCenterX,
                            y: toCenterY,
                            scale: startScale,
                            duration: squeezeDuration,
                            ease: "power2.in",
                        },
                        {
                            x: finalDx,
                            y: finalDy,
                            scale: 1,
                            duration: duration - squeezeDuration,
                            ease: "expo.out",
                        },
                    ],
                });
            }

            gsap.to(picked, { autoAlpha: 0, duration: 0.2, ease: "power1.out" });
            gsap.delayedCall(duration, () => {
                gsap.set(titleSpans, { autoAlpha: 1 });
                gsap.set(paragraph, { autoAlpha: 0 });
                for (const mover of movers) mover.remove();
            });
        }, "flip");
        tl.to({}, { duration: 1.3 }, "flip");

        // Pause 1s before curtain split
        tl.to({}, { duration: 1.0 });

        // Step 3: draw the cut line with a pulse
        tl.add(() => {
            const rect = title.getBoundingClientRect();
            line.style.top = `${rect.top + rect.height / 2}px`;
        });
        tl.to(line, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.8,
            ease: "expo.inOut",
        });
        tl.to(
            line,
            {
                scaleY: 2,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power2.out",
            },
            "<"
        );

        // Step 4: split curtains and reveal content
        tl.addLabel("split", "+=0.02");
        tl.to(
            title,
            { autoAlpha: 0, duration: 0.2 },
            "split"
        );
        tl.to(
            ".curtain-top",
            { yPercent: -100, duration: 1.2, ease: "power4.inOut" },
            "split"
        );
        tl.to(
            ".curtain-bottom",
            { yPercent: 100, duration: 1.2, ease: "power4.inOut" },
            "split"
        );
        tl.to(
            line,
            { autoAlpha: 0, duration: 0.3 },
            "split+=0.1"
        );
        // Remove the container after the curtains finish
        tl.set(containerRef.current, { display: "none" });
    }, { scope: containerRef });

    if (!isLoading) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none"
        >
            {/* Top Curtain */}
            <div className="curtain-top absolute top-0 left-0 w-full h-[50vh] bg-primary z-20 flex items-end justify-center overflow-hidden"></div>

            {/* Bottom Curtain */}
            <div className="curtain-bottom absolute bottom-0 left-0 w-full h-[50vh] bg-primary z-20 flex items-start justify-center overflow-hidden"></div>

            {/* Content Layer */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center text-white">
                <div
                    ref={motionLayerRef}
                    className="absolute inset-0 z-40 pointer-events-none text-white text-7xl md:text-9xl font-bold font-[family-name:var(--font-space)] tracking-[-0.06em] leading-none"
                />
                {/* Paragraph Stage */}
                <p
                    ref={paragraphRef}
                    className="max-w-2xl text-2xl md:text-4xl font-light leading-snug tracking-tight opacity-0"
                >
                    Build a modular base for blockchain on EVM.
                </p>

                {/* Title Stage */}
                <h1
                    ref={titleRef}
                    className="absolute text-7xl md:text-9xl font-bold font-[family-name:var(--font-space)] tracking-[-0.06em] opacity-0 leading-none"
                >
                    Bamboo
                </h1>
            </div>

            {/* Cut Line */}
            <div
                ref={lineRef}
                className="absolute top-[50%] left-0 w-full h-[2px] bg-white z-40 origin-left -translate-y-1/2 scale-x-0 opacity-0"
            />

            {/* Character styling for morph animation */}
            <style jsx>{`
        .pm-char {
          display: inline-block;
          will-change: transform, opacity;
          transform: translateZ(0);
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
        }
        .pm-from {
          letter-spacing: -0.02em;
        }
        .pm-target {
          letter-spacing: -0.04em;
          vertical-align: middle;
          line-height: 1;
        }
        .pm-big {
          font-size: 2em;
          line-height: 0.9;
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
