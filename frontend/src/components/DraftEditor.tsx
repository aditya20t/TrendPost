"use client";

import { motion } from "framer-motion";
import { Copy, Check, Share2, Edit3, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function DraftEditor({
    draft,
    iterations,
    onDismiss
}: {
    draft: string;
    iterations?: number;
    citations: string[];
    onDismiss: () => void
}) {
    const [copied, setCopied] = useState(false);
    const [content, setContent] = useState(draft);

    // Update content if draft prop changes (e.g. new generation)
    useEffect(() => {
        setContent(draft);
    }, [draft]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full relative overflow-hidden flex flex-col shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]"
            style={{ padding: 'clamp(1.25rem, 6vw, 2.5rem)' }}
        >
            <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-indigo-500" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl shrink-0">
                        <Edit3 className="text-indigo-500 w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center flex-wrap gap-2">
                            <h3 className="text-xl sm:text-2xl font-bold title-gradient">Workspace</h3>
                            {iterations !== undefined && iterations > 0 && (
                                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">
                                    {iterations} Refined
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Final Post Editor</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={copyToClipboard}
                        className="flex-grow sm:flex-grow-0 px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                        onClick={onDismiss}
                        className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-slate-400 hover:text-red-500 border border-slate-200 dark:border-white/10"
                    >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-700 dark:text-slate-200 leading-relaxed text-base sm:text-lg resize-none flex-grow min-h-[300px] sm:min-h-[450px]"
                placeholder="Final post content will appear here..."
            />

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[11px] text-slate-400 font-medium order-2 sm:order-1">
                    <span className="text-indigo-500 font-bold uppercase tracking-widest mr-2">Tip:</span>
                    Edit directly before pushing to LinkedIn.
                </div>
                <button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.1)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] order-1 sm:order-2"
                >
                    <Share2 className="w-4 h-4" />
                    Push to Linkedin
                </button>
            </div>
        </motion.div>
    );
}
