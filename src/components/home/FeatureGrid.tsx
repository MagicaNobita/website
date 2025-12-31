"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Layout, Box, ArrowRight } from "lucide-react";
import Link from 'next/link';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const features = [
    {
        icon: <Zap className="w-6 h-6 text-orange-500" />,
        title: "Spring Native",
        desc: "Built directly on the Spring Boot ecosystem. No sidecars, no external node processes. Just pure Java performance.",
        code: `@Service
public class Indexer {
  @EventListener
  public void onBlock(BlockEvent evt) {
    // Zero latency processing
  }
}`,
        color: "bg-orange-500/10 border-orange-500/20 text-orange-600"
    },
    {
        icon: <Layout className="w-6 h-6 text-blue-500" />,
        title: "Auto Schema",
        desc: "Define your schema in Java POJOs. Bamboo automatically handles database migrations and contract decoding.",
        code: `@Entity
public class Transfer {
  @Id String hash;
  String from;
  String to;
  BigInteger value;
}`,
        color: "bg-blue-500/10 border-blue-500/20 text-blue-600"
    },
    {
        icon: <Box className="w-6 h-6 text-green-500" />,
        title: "EVM Ready",
        desc: "Compatible with all EVM chains out of the box. Ethereum, Polygon, Arbitrum, Optimism, and custom subnets.",
        code: `bamboo:
  chain-id: 1
  rpc-url: \${ETH_RPC}
  contracts:
    - 0x123...abc`,
        color: "bg-green-500/10 border-green-500/20 text-green-600"
    }
];

export const FeatureGrid = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        if (!containerRef.current || !rightPanelRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // Pin for 3 screen heights
                pin: true,
                scrub: true,
                onUpdate: (self) => {
                    // Map scroll progress to index (0, 1, 2)
                    const idx = Math.min(
                        features.length - 1,
                        Math.floor(self.progress * features.length)
                    );
                    setActiveIdx(idx);
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section className="relative bg-background">
            <div ref={containerRef} className="h-screen w-full flex items-center overflow-hidden">
                <div className="container mx-auto px-6 h-full flex flex-col md:flex-row gap-12 items-center justify-center">

                    {/* LEFT: Scrollable Text (Driven by Pin) */}
                    <div className="flex-1 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground font-[family-name:var(--font-space)]">
                                Why Bamboo?
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-lg">
                                The only indexer designed for the modern Spring Boot enterprise stack.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "p-6 rounded-2xl border transition-all duration-500 cursor-pointer group",
                                        activeIdx === i
                                            ? "bg-white border-primary/20 shadow-xl scale-100 opacity-100"
                                            : "bg-transparent border-transparent opacity-40 scale-95 hover:opacity-70"
                                    )}
                                    onClick={() => {
                                        // Optional: Add click to scroll logic here
                                        document.documentElement.scrollTop += (i - activeIdx) * window.innerHeight;
                                    }}
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className={cn("p-2 rounded-lg", f.color)}>
                                            {f.icon}
                                        </div>
                                        <h3 className={cn("text-2xl font-bold", activeIdx === i ? "text-foreground" : "text-muted-foreground")}>
                                            {f.title}
                                        </h3>
                                    </div>
                                    <p className={cn("text-lg leading-relaxed", activeIdx === i ? "text-muted-foreground" : "text-transparent h-0 overflow-hidden")}>
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Sticky Visual Panel */}
                    <div className="flex-1 w-full max-w-xl h-[500px] relative perspective-1000">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "absolute inset-0 w-full h-full glass-card p-8 rounded-3xl flex flex-col justify-between transition-all duration-700 ease-out",
                                    activeIdx === i
                                        ? "opacity-100 translate-x-0 rotate-y-0 z-10 scale-100"
                                        : activeIdx > i
                                            ? "opacity-0 -translate-y-10 scale-90 z-0"
                                            : "opacity-0 translate-y-10 scale-90 z-0"
                                )}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                        </div>
                                        <div className="text-xs font-mono text-muted-foreground">MyComponent.java</div>
                                    </div>
                                    <div className="h-px w-full bg-black/5" />
                                    <pre className="font-mono text-sm text-foreground/80 leading-relaxed overflow-x-auto">
                                        <code>{f.code}</code>
                                    </pre>
                                </div>

                                <div className="mt-8 pt-8 border-t border-black/5 flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(avatar => (
                                            <div key={avatar} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                        ))}
                                    </div>
                                    <Link href="/docs" className="flex items-center text-sm font-bold text-primary hover:gap-2 transition-all">
                                        Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};
