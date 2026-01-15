"use client";

import Image from "next/image";

const logos = [
    { name: "Ethereum", url: "/chain/Ethereum.svg" },
    { name: "Binance", url: "/chain/Binance.svg" },
    { name: "OKX", url: "/chain/OKX.svg" },
    { name: "Huobi", url: "/chain/Huobi.svg" },
    { name: "Polygon", url: "/chain/Polygon.svg" },
    { name: "Avalance", url: "/chain/Avalance.svg" },
    { name: "Optimism", url: "/chain/Optimism.svg" },
    { name: "Arbitrum", url: "/chain/Arbitrum.svg" },
    { name: "Base", url: "/chain/Base.svg" },
    { name: "ApeNft", url: "/chain/ApeNft.svg" },
    { name: "Ripple", url: "/chain/Ripple.svg" },
    { name: "Phantom", url: "/chain/Phantom.svg" },
    { name: "Gnosis", url: "/chain/Gnosis.svg" },
];

const LogoItem = ({ logo }: { logo: { name: string; url: string } }) => (
    <div className="flex-shrink-0 px-8 h-10 w-[120px] flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
        <Image
            src={logo.url}
            alt={logo.name}
            width={120}
            height={40}
            className="object-contain h-8 w-auto"
        />
    </div>
);

export const LogoTicker = () => {
    // 复制 3 次作为基础组，然后再复制一份确保无缝
    const baseLogos = [...logos, ...logos, ...logos];

    return (
        <section className="py-20 bg-background overflow-hidden relative">
            <div className="container mx-auto px-6 mb-8 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Trusted by innovative teams
                </p>
            </div>

            <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-32 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-32 after:bg-gradient-to-l after:from-background after:to-transparent">
                <div className="inline-flex logo-scroll">
                    {/* 完整的两组 logos，每组 3 倍数量 */}
                    {baseLogos.map((logo, i) => (
                        <LogoItem key={`a-${i}`} logo={logo} />
                    ))}
                    {baseLogos.map((logo, i) => (
                        <LogoItem key={`b-${i}`} logo={logo} />
                    ))}
                </div>
            </div>
        </section>
    );
};
