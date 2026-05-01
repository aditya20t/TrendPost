"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Copy, Check, Edit3, Trash2, 
    Type, Bold, Italic, List, Hash, 
    MessageSquare, Link2, 
    Space, Info
} from "lucide-react";
import { useState, useRef } from "react";
import { transformToUnicode, FormatType } from "../utils/unicodeUtils";

export default function DraftEditor({
    draft,
    iterations,
    onDismiss
}: {
    draft: string;
    iterations?: number;
    onDismiss: () => void
}) {
    const [copied, setCopied] = useState(false);
    const [content, setContent] = useState(draft);
    const [commentDraft, setCommentDraft] = useState("");
    const [showComment, setShowComment] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);



    const handleSelection = () => {
        // Selection tracking if needed later
    };

    const handleFormat = (type: FormatType, subType?: string) => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selectedText = content.substring(start, end);

        // If no selection, apply to the whole text for certain types (like spacer)
        if (!selectedText && type !== "spacer") return;

        const targetText = selectedText || content;
        const transformed = transformToUnicode(targetText, type, subType);
        
        if (!selectedText) {
            setContent(transformed);
        } else {
            const newContent = content.substring(0, start) + transformed + content.substring(end);
            setContent(newContent);
            
            // Re-select transformed text
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(start, start + transformed.length);
                }
            }, 0);
        }
    };

    const extractLinksToComment = () => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const links = content.match(urlRegex);
        if (links) {
            setCommentDraft(prev => (prev ? prev + "\n" + links.join("\n") : links.join("\n")));
            setContent(prev => prev.replace(urlRegex, ""));
            setShowComment(true);
        }
    };

    const copyToClipboard = (text: string, isMain: boolean = true) => {
        // Apply invisible spacers to main content before copying
        const finalContent = isMain ? transformToUnicode(text, "spacer") : text;
        navigator.clipboard.writeText(finalContent);
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

            {/* Header */}
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Premium Post Editor</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => copyToClipboard(content)}
                        className="flex-grow sm:flex-grow-0 px-4 py-2 bg-indigo-500 text-white rounded-xl transition-all flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied Post!" : "Copy for LinkedIn"}
                    </button>
                    <button
                        onClick={onDismiss}
                        className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-slate-400 hover:text-red-500 border border-slate-200 dark:border-white/10"
                    >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-4 p-1 sm:p-1.5 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex items-center gap-1 px-1.5 sm:px-2 border-r border-slate-300 dark:border-white/10 mr-1 shrink-0">
                    <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                    <ToolbarButton icon={<Bold size={14} />} label="Strong" onClick={() => handleFormat("bold_serif")} />
                    <ToolbarButton icon={<Italic size={14} />} label="Emphasis" onClick={() => handleFormat("italic_serif")} />
                    <ToolbarButton icon={<span className="font-mono text-[10px] font-bold">A_</span>} label="Code" onClick={() => handleFormat("monospace")} />
                </div>
                
                <div className="w-px h-4 bg-slate-300 dark:border-white/10 mx-1 shrink-0" />
                
                <div className="flex items-center gap-1 shrink-0">
                    <ToolbarButton icon={<List size={14} />} label="Bullet" onClick={() => handleFormat("bullet", "arrow")} />
                    <ToolbarButton icon={<Hash size={14} />} label="Steps" onClick={() => handleFormat("number", "circled")} />
                </div>
                
                <div className="w-px h-4 bg-slate-300 dark:border-white/10 mx-1 shrink-0" />
                
                <div className="flex items-center gap-1 shrink-0">
                    <ToolbarButton icon={<Link2 size={14} />} label="Clean Link" onClick={extractLinksToComment} />
                    <ToolbarButton icon={<div className="w-3.5 h-0.5 bg-slate-400 rounded-full" />} label="Break" onClick={() => handleFormat("divider")} />
                    <ToolbarButton icon={<Space size={14} />} label="Fix Spacing" onClick={() => handleFormat("spacer")} />
                </div>
            </div>

            {/* Main Editor */}
            <div className="relative group flex-grow flex flex-col">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onSelect={handleSelection}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-700 dark:text-slate-200 leading-relaxed resize-none flex-grow min-h-[300px] sm:min-h-[400px] custom-scrollbar"
                    style={{ fontSize: 'var(--editor-font)' }}
                    placeholder="Write your high-impact post here..."
                />
                
                {/* Accessibility Badge */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-[9px] font-bold text-amber-600 uppercase tracking-tighter backdrop-blur-sm">
                        <Info size={10} />
                        Unicode text may affect screen readers
                    </div>
                </div>
            </div>

            {/* Comment Draft Section */}
            <AnimatePresence>
                {showComment && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-indigo-500" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">First Comment Draft</span>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(commentDraft, false)}
                                className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-1"
                            >
                                <Copy size={12} /> Copy Comment
                            </button>
                        </div>
                        <textarea
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 p-3 rounded-xl text-slate-600 dark:text-slate-400 min-h-[80px] focus:ring-1 focus:ring-indigo-500"
                            style={{ fontSize: 'var(--editor-font)', lineHeight: '1.5' }}
                            placeholder="Add links or hashtags for the first comment here..."
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            {!showComment && commentDraft === "" && (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-[11px] text-slate-400 font-medium order-2 sm:order-1">
                        <span className="text-indigo-500 font-bold uppercase tracking-widest mr-2">Tip:</span>
                        Use the toolbar to make your post stand out on LinkedIn.
                    </div>
                    <button
                        onClick={() => setShowComment(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-2"
                    >
                        <MessageSquare size={14} /> Add Comment Draft
                    </button>
                </div>
            )}
        </motion.div>
    );
}

function ToolbarButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-1.5 sm:p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-indigo-500 border border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-sm hover:shadow-md flex items-center gap-1.5 shrink-0"
            title={label}
        >
            {icon}
            <span className="text-[9px] sm:text-[10px] font-bold uppercase hidden sm:inline">{label}</span>
        </button>
    );
}
