"use client";

import { useState } from "react";
import { PreloaderContext } from "./context";
import { Preloader } from "./index";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <PreloaderContext.Provider value={{ isLoading, setIsLoading }}>
            <Preloader />
            {children}
        </PreloaderContext.Provider>
    );
};
