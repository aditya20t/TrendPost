"use client";

import { motion } from "framer-motion";
import { ExternalLink, Search, Globe, Library, Info } from "lucide-react";

export default function ResearchPanel({ citations, loading }: { citations: string[], loading?: boolean }) {
    // If not loading and no citations, show a placeholder
    const hasCitations = citations && citations.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card w-full h-fit border-t-4 border-t-indigo-500 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]"
            style={{ padding: 'clamp(1.25rem, 5vw, 1.5rem)' }}
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                    <Library className="text-indigo-500 w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white tracking-tight text-lg">Research Sources</h3>
            </div>

            <div 
                className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2"
                style={{ padding: '0 clamp(0.5rem, 2vw, 1rem)' }}
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative animate-spin rounded-full h-10 w-10 border-2 border-indigo-500/30 border-t-indigo-500" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold tracking-widest animate-pulse uppercase">Hunting for trends...</span>
                    </div>
                ) : hasCitations ? (
                    citations.map((url, i) => (
                        <motion.a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            transition={{ delay: i * 0.1 }}
                            className="group flex flex-col gap-1 p-3 sm:p-4 bg-black/[0.03] dark:bg-white/[0.03] hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 rounded-2xl border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-all font-medium shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5" />
                                    {new URL(url).hostname}
                                </span>
                                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors mt-1">
                                {url}
                            </span>
                        </motion.a>
                    ))
                ) : (
                    <div className="p-6 bg-black/[0.03] dark:bg-white/[0.03] rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center">
                        <Info className="w-6 h-6 text-slate-400 mx-auto mb-3" />
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            No live sources found. Using internal knowledge.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-400 dark:text-slate-500 italic flex items-center gap-2 font-medium">
                <Search className="w-4 h-4" />
                Verified sources for factual accuracy.
            </div>
        </motion.div>
    );
}
