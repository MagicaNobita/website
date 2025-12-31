"use client";

import { createContext, useContext, Dispatch, SetStateAction } from "react";

interface PreloaderContextType {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const PreloaderContext = createContext<PreloaderContextType>({
    isLoading: true,
    setIsLoading: () => { },
});

export const usePreloader = () => useContext(PreloaderContext);
