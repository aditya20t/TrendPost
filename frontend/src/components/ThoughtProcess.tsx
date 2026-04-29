"use client";

import { motion } from "framer-motion";
import { Brain, Search, Target, PenTool, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ThoughtProcessProps {
    plannerNotes: string;
    searchQueries: string[];
    strategicAngle: string;
    critique: string;
    draftHistory: string[];
    loading?: boolean;
}

export default function ThoughtProcess({
    plannerNotes,
    searchQueries,
    strategicAngle,
    critique,
    draftHistory,
    loading
}: ThoughtProcessProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (loading) {
        return (
            <div className="glass-card p-6 w-full animate-pulse">
                <div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded-lg mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-100 dark:bg-white/5 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const hasData = plannerNotes || strategicAngle || draftHistory.length > 0;

    if (!hasData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden w-full border-l-4 border-l-indigo-500 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]"
        >
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                        <Brain className="text-indigo-500 w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-800 dark:text-white tracking-tight text-lg">AI Thought Process</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Internal Monologue & Strategy</p>
                    </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {isExpanded && (
                <div className="p-6 pt-0 space-y-8 max-h-[500px] sm:max-h-[700px] overflow-y-auto custom-scrollbar">
                    {/* Planner Phase */}
                    {plannerNotes && (
                        <Step 
                            icon={<Target className="w-4 h-4 text-rose-500" />}
                            title="Strategic Planning"
                            content={plannerNotes}
                            subContent={searchQueries.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {searchQueries.map((q, i) => (
                                        <span key={i} className="px-3 py-1 bg-rose-500/5 border border-rose-500/10 rounded-full text-[10px] font-medium text-rose-600 dark:text-rose-400">
                                            🔍 {q}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        />
                    )}

                    {/* Strategist Phase */}
                    {strategicAngle && (
                        <Step 
                            icon={<Search className="w-4 h-4 text-amber-500" />}
                            title="Angle Selection"
                            content={strategicAngle}
                        />
                    )}

                    {/* Writing & Review Loops */}
                    {draftHistory.length > 0 && (
                        <div className="space-y-6">
                            {draftHistory.map((draft, idx) => (
                                <div key={idx} className="space-y-4">
                                    <Step 
                                        icon={<PenTool className="w-4 h-4 text-emerald-500" />}
                                        title={`Draft Version ${idx + 1}`}
                                        content={draft}
                                        isDraft
                                    />
                                    {idx === 0 && critique && draftHistory.length > 1 && (
                                        <Step 
                                            icon={<MessageSquare className="w-4 h-4 text-indigo-500" />}
                                            title="Strategic Critique"
                                            content={critique}
                                            isCritique
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

function Step({ icon, title, content, subContent, isDraft, isCritique }: { 
    icon: React.ReactNode, 
    title: string, 
    content: string, 
    subContent?: React.ReactNode,
    isDraft?: boolean,
    isCritique?: boolean
}) {
    return (
        <div className="relative pl-8 border-l border-slate-200 dark:border-white/10 ml-2 py-1">
            <div className="absolute -left-2.5 top-0 p-1 bg-white dark:bg-[#0f172a] rounded-full border border-slate-200 dark:border-white/10">
                {icon}
            </div>
            <div className="flex flex-col">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    {title}
                    {isDraft && <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded uppercase">Content</span>}
                    {isCritique && <span className="text-[9px] bg-indigo-500/10 text-indigo-600 px-1.5 py-0.5 rounded uppercase">Feedback</span>}
                </h4>
                <div className={`text-sm leading-relaxed ${isCritique ? "text-indigo-600 dark:text-indigo-400 font-medium italic" : "text-slate-600 dark:text-slate-300"}`}>
                    {content}
                </div>
                {subContent}
            </div>
        </div>
    );
}
