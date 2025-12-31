"use client";

import { motion } from "motion/react";
import Image from "next/image";

const logos = [
    { name: "Vercel", url: "https://res.cloudinary.com/algochurn/image/upload/v1702461298/studio/batteries/vercel.svg" },
    { name: "Next.js", url: "https://res.cloudinary.com/algochurn/image/upload/v1702461298/studio/batteries/nextjs.svg" },
    { name: "Supabase", url: "https://res.cloudinary.com/algochurn/image/upload/v1702461298/studio/batteries/supabase.svg" },
    { name: "Tailwind", url: "https://res.cloudinary.com/algochurn/image/upload/v1702461298/studio/batteries/tailwind.svg" },
    { name: "Framer", url: "https://res.cloudinary.com/algochurn/image/upload/v1702461298/studio/batteries/framer.svg" },
    { name: "Stripe", url: "https://res.cloudinary.com/algochurn/image/upload/v1702461298/studio/batteries/stripe.svg" },
];

export const LogoTicker = () => {
    return (
        <section className="py-20 bg-background overflow-hidden relative">
            <div className="container mx-auto px-6 mb-8 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Trusted by innovative teams</p>
            </div>

            <div className="flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-32 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-32 after:bg-gradient-to-l after:from-background after:to-transparent">
                <motion.div
                    transition={{
                        duration: 20,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    className="flex flex-none gap-24 pr-24 items-center"
                >
                    {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
                        <div key={i} className="relative h-8 w-auto min-w-[100px] flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                            <Image
                                src={logo.url}
                                alt={logo.name}
                                fill
                                sizes="150px"
                                className="object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
