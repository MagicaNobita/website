"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 3000 });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(parseInt(latest.toFixed(0))) + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} />;
};

export const StatsSection = () => {
    const stats = [
        { label: "Total Blocks Indexed", value: 14500000, suffix: "+" },
        { label: "Events Processed", value: 890000, suffix: "" },
        { label: "Avg Block Latency", value: 24, suffix: "ms" },
        { label: "Uptime Guaranteed", value: 99, suffix: "%" },
    ];

    return (
        <section className="py-32 bg-background border-y border-black/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-black/5">
                    {stats.map((stat, i) => (
                        <div key={i} className={cn("flex flex-col gap-2 p-4", i % 2 !== 0 && "border-none md:border-l")}>
                            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground font-[family-name:var(--font-space)]">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
