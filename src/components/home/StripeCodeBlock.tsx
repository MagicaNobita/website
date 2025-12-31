"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Terminal as TerminalIcon } from "lucide-react";

const CODE_LINES = [
    "@Component",
    "public class PaymentListener {",
    "",
    "  @EventListener",
    "  public void onTransfer(TransferEvent evt) {",
    "    log.info(\"Payment received: \" + evt.amount);",
    "  }",
    "}"
];

const LOG_LINES = [
    { text: "$ java -jar bamboo-app.jar", color: "text-muted-foreground" },
    { text: "> Bamboo Indexer v1.0.0 started", color: "text-green-400" },
    { text: "2024-03-15 10:00:01 [INFO] Connected to Ethereum RPC", color: "text-blue-400" },
    { text: "2024-03-15 10:00:02 [INFO] Schemas synchronized", color: "text-blue-400" },
    { text: "2024-03-15 10:00:05 [INFO] Payment received: 5000 USDT", color: "text-green-400" },
];

export const StripeCodeBlock = () => {
    const [activeTab] = useState("PaymentListener.java");
    const [typedLines, setTypedLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [autocompleteSelected, setAutocompleteSelected] = useState(false);
    const [logs, setLogs] = useState<typeof LOG_LINES>([]);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    // Constants for animation
    const AUTOCOMPLETE_TRIGGER_LINE = 5; // The line where autocomplete appears
    const AUTOCOMPLETE_TRIGGER_CHAR = 12; // "log.info" - trigger after "log."

    // Typing Effect
    useEffect(() => {
        // Log streaming logic
        if (isTypingComplete) {
            let logIndex = 0;
            const logInterval = setInterval(() => {
                if (logIndex < LOG_LINES.length) {
                    const nextLog = LOG_LINES[logIndex];
                    if (nextLog) {
                        setLogs(prev => [...prev, nextLog]);
                    }
                    logIndex++;
                } else {
                    clearInterval(logInterval);
                }
            }, 800);
            return () => clearInterval(logInterval);
        }

        // Typing logic
        if (currentLineIndex >= CODE_LINES.length) {
            setIsTypingComplete(true);
            return;
        }

        const currentLineText = CODE_LINES[currentLineIndex];

        // Autocomplete Logic
        if (currentLineIndex === AUTOCOMPLETE_TRIGGER_LINE && currentCharIndex === AUTOCOMPLETE_TRIGGER_CHAR && !autocompleteSelected) {
            setShowAutocomplete(true);
            const timeout = setTimeout(() => {
                setAutocompleteSelected(true);
                setShowAutocomplete(false);
            }, 1500);
            return () => clearTimeout(timeout);
        }

        if (showAutocomplete) return; // Pause typing while showing autocomplete

        const timeout = setTimeout(() => {
            setTypedLines((prev) => {
                const newLines = [...prev];
                if (!newLines[currentLineIndex]) newLines[currentLineIndex] = "";
                newLines[currentLineIndex] = currentLineText.slice(0, currentCharIndex + 1);
                return newLines;
            });

            if (currentCharIndex < currentLineText.length - 1) {
                setCurrentCharIndex((prev) => prev + 1);
            } else {
                setCurrentLineIndex((prev) => prev + 1);
                setCurrentCharIndex(0);
            }
        }, 30 + Math.random() * 50); // Random typing speed

        return () => clearTimeout(timeout);
    }, [currentLineIndex, currentCharIndex, isTypingComplete, showAutocomplete, autocompleteSelected]);


    return (
        <div className="w-full max-w-4xl mx-auto font-mono text-sm shadow-2xl rounded-xl overflow-hidden bg-[#0d1117] border border-white/10 flex flex-col h-[600px] md:h-[700px]">

            {/* TOP PANE: CODE EDITOR (60%) */}
            <div className="flex-[1.5] flex flex-col border-b border-white/5 relative bg-[#0d1117]">
                {/* Tab Bar */}
                <div className="flex items-center px-4 py-2 border-b border-white/5 bg-white/5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <span className="ml-4">{activeTab}</span>
                </div>

                {/* Editor Content */}
                <div className="p-6 overflow-hidden relative flex-1">
                    <div className="absolute left-4 top-6 bottom-0 w-8 text-right text-muted-foreground/30 select-none leading-relaxed">
                        {CODE_LINES.map((_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>

                    <div className="ml-10 leading-relaxed z-10 relative">
                        {typedLines.map((line, i) => (
                            <div key={i} className="min-h-[1.5em] whitespace-pre">
                                <SyntaxHighlight text={line} />
                                {i === currentLineIndex && !isTypingComplete && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="inline-block w-2 h-4 bg-primary align-middle ml-0.5"
                                    />
                                )}

                                {/* Simulated Autocomplete Popup */}
                                {i === AUTOCOMPLETE_TRIGGER_LINE && showAutocomplete && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute left-20 mt-6 bg-[#1c2128] border border-white/10 rounded-lg shadow-xl p-1 w-48 z-50 overflow-hidden"
                                    >
                                        <div className="px-2 py-1 text-xs text-muted-foreground border-b border-white/5 mb-1">Suggestions</div>
                                        <div className="px-2 py-1.5 bg-primary/20 text-primary rounded flex items-center justify-between cursor-pointer">
                                            <span>info(String msg)</span>
                                            <span className="text-[10px] opacity-50">Logger</span>
                                        </div>
                                        <div className="px-2 py-1.5 text-muted-foreground opacity-50">warn(String msg)</div>
                                        <div className="px-2 py-1.5 text-muted-foreground opacity-50">error(String msg)</div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-primary text-black px-3 py-1 text-[10px] flex justify-between font-bold uppercase tracking-wider">
                    <span>Normal Mode</span>
                    <span>Java SE 21</span>
                </div>
            </div>

            {/* BOTTOM PANE: TERMINAL (40%) */}
            <div className="flex-1 bg-black/40 flex flex-col min-h-0">
                <div className="flex items-center px-4 py-2 border-b border-white/5 bg-white/5 text-xs text-muted-foreground gap-2">
                    <TerminalIcon size={12} />
                    <span>Terminal</span>
                </div>
                <div className="p-4 font-mono text-xs flex-1 overflow-y-auto">
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn("mb-2 break-all", log?.color || "text-foreground")} // Safe access
                            >
                                {log?.text || ""}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTypingComplete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="animate-pulse text-primary mt-2"
                        >
                            _
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Simple Syntax Highlighter (Regex based for demo)
const SyntaxHighlight = ({ text }: { text: string }) => {
    if (!text) return null;

    // Very basic tokenization
    const parts = text.split(/(\s+|"[^"]*"|[(){};.])/);

    return (
        <>
            {parts.map((part, i) => {
                let className = "text-gray-300";
                if (part.startsWith("@")) className = "text-yellow-400"; // Annotation
                else if (["public", "class", "void"].includes(part)) className = "text-purple-400"; // Keywords
                else if (part.startsWith('"')) className = "text-green-400"; // Strings
                else if (["log", "PaymentListener", "TransferEvent"].includes(part)) className = "text-blue-400"; // Classes/Objects

                return <span key={i} className={className}>{part}</span>;
            })}
        </>
    );
};
