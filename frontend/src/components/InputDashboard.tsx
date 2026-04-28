"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Globe, Key, Search, ToggleLeft, ToggleRight, Info, Zap, Brain, Briefcase, Settings2, Edit } from "lucide-react";

export default function InputDashboard({ onGenerate, onDiscoveryChange, compact = false }: { onGenerate: (data: any) => void, onDiscoveryChange?: (isDiscovery: boolean) => void, compact?: boolean }) {
    const [topic, setTopic] = useState("");
    const [field, setField] = useState("Technology");
    const [url, setUrl] = useState("");
    const [context, setContext] = useState("");
    const [keyPoints, setKeyPoints] = useState("");
    const [style, setStyle] = useState("Professional");
    const [provider, setProvider] = useState("gemini");
    const [modelName, setModelName] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [tavilyKey, setTavilyKey] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [targetAudience, setTargetAudience] = useState("Professionals");
    const [goal, setGoal] = useState("thought_leadership");
    const [maxWords, setMaxWords] = useState(300);
    const [includeHashtags, setIncludeHashtags] = useState(true);
    const [includeCTA, setIncludeCTA] = useState(true);
    const [discovery, setDiscovery] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onGenerate({
            topic,
            field,
            url,
            context,
            key_points: keyPoints,
            style,
            target_audience: targetAudience,
            goal,
            max_words: maxWords,
            include_hashtags: includeHashtags,
            include_cta: includeCTA,
            model_provider: provider,
            model_name: modelName,
            api_key: apiKey,
            base_url: baseUrl,
            discovery_mode: discovery,
            tavily_key: tavilyKey
        });
        setLoading(false);
    };

    const handleDiscoveryToggle = () => {
        const newValue = !discovery;
        setDiscovery(newValue);
        if (onDiscoveryChange) onDiscoveryChange(newValue);
    };

    const domains = [
        "Technology", "Finance", "Marketing", "Healthcare", "Education",
        "Entertainment", "E-commerce", "Sustainability", "Venture Capital", "Human Resources"
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card w-full transition-all duration-500 ${compact ? "p-4 sm:p-6" : "p-6 sm:p-10"}`}
        >
            <div className={`flex flex-col ${compact ? "" : "sm:flex-row"} justify-between items-start ${compact ? "" : "sm:items-center"} gap-4 mb-6 ${compact ? "pb-4" : "pb-6"} border-b border-slate-200 dark:border-white/10`}>
                <div className="flex items-center gap-4">
                    <div className={`bg-indigo-500/10 rounded-2xl shadow-inner ${compact ? "p-2.5" : "p-3 sm:p-4"}`}>
                        <Sparkles className={`text-indigo-500 ${compact ? "w-5 h-5" : "w-6 h-6 sm:w-8 sm:h-8"}`} />
                    </div>
                    <div>
                        <h2 className={`${compact ? "text-xl" : "text-2xl sm:text-3xl"} font-bold title-gradient mb-1`}>Draft Your Next Hit</h2>
                        {!compact && <p className="text-slate-500 dark:text-slate-400 text-sm">Tell the agent what's on your mind.</p>}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handleDiscoveryToggle}
                        className={`flex items-center justify-between sm:justify-start gap-3 px-4 py-2 rounded-full transition-all border w-full sm:w-auto ${discovery
                                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                                : "bg-black/5 border-black/10 text-slate-600 hover:text-slate-800 dark:bg-white/5 dark:border-white/10 dark:text-slate-500 dark:hover:text-slate-400"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {discovery ? <Zap className="w-4 h-4 fill-current" /> : <Brain className="w-4 h-4" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{discovery ? "Discovery (Live)" : "Standard (internal)"}</span>
                        </div>
                        {discovery ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    {!compact && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mr-3 mt-1 font-medium">
                            <Info className="w-3 h-3" />
                            <span>{discovery ? "Real-time web research active" : "Uses model's internal knowledge"}</span>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className={`grid grid-cols-1 ${compact ? "gap-6" : "lg:grid-cols-12 gap-8 lg:gap-12"}`}>
                
                {/* Left Column: Core Inputs */}
                <div className={`${compact ? "" : "lg:col-span-7"} space-y-5`}>
                    <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                            <Edit className="w-3.5 h-3.5" /> Topic or Trend Name
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder={discovery ? "e.g. Transformers in AI" : "e.g. Gemini 1.5 Updates"}
                                className={`w-full ${compact ? "text-sm h-[46px]" : "text-base sm:text-lg h-[52px]"}`}
                                required={!url}
                            />
                            {discovery && <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500/50 animate-pulse" />}
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-5`}>
                        <div className="space-y-1.5">
                            <label className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <Briefcase className="w-3.5 h-3.5" /> Broader Field
                            </label>
                            <select
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                                className={`w-full text-sm ${compact ? "h-[46px]" : "h-[52px]"}`}
                            >
                                {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                <option value="Other">Other (Specify in Topic)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <Globe className="w-3.5 h-3.5" /> Target URL <span className="text-[9px] text-slate-400 font-black uppercase px-1.5 py-0.5 bg-black/5 dark:bg-white/5 rounded ml-auto">Optional</span>
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className={`w-full text-sm ${compact ? "h-[46px]" : "h-[52px]"}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex justify-between items-center mb-1">
                            <span>Your Personal Perspective</span>
                            <span className="text-[9px] text-slate-400 font-black uppercase px-1.5 py-0.5 bg-black/5 dark:bg-white/5 rounded">Optional</span>
                        </label>
                        <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            rows={compact ? 3 : (discovery ? 4 : 6)}
                            placeholder="What's your unique take on this?"
                            className={`w-full resize-none ${compact ? "text-sm" : "text-base"}`}
                        />
                    </div>
                </div>

                {/* Right Column: Settings */}
                <div className={`${compact ? "" : "lg:col-span-5"} bg-black/5 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl ${compact ? "p-5" : "p-6 sm:p-8"} space-y-5`}>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
                        <Settings2 className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Generation Settings</h3>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Post Style</label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className={`w-full text-sm font-medium ${compact ? "h-[42px]" : "h-[48px]"}`}
                        >
                            <option>Professional</option>
                            <option>Thought Leader</option>
                            <option>Storytelling</option>
                            <option>Controversial</option>
                            <option>Casual/Witty</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Target Audience</label>
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className={`w-full text-sm font-medium ${compact ? "h-[42px]" : "h-[48px]"}`}
                            placeholder="e.g. CTOs, Growth Hackers..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Primary Goal</label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className={`w-full text-sm font-medium ${compact ? "h-[42px]" : "h-[48px]"}`}
                        >
                            <option value="thought_leadership">Thought Leadership</option>
                            <option value="engagement">Viral Engagement</option>
                            <option value="authority_building">Authority Building</option>
                            <option value="lead_generation">Lead Generation</option>
                            <option value="education">Education/Tutorial</option>
                            <option value="brand_awareness">Brand Awareness</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Max Words</label>
                            <input
                                type="number"
                                value={maxWords}
                                onChange={(e) => setMaxWords(parseInt(e.target.value))}
                                className="w-full text-sm h-[40px]"
                            />
                        </div>
                        <div className="flex flex-col justify-end gap-2 pb-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={includeHashtags}
                                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">Hashtags</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={includeCTA}
                                    onChange={(e) => setIncludeCTA(e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">Include CTA</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Engine</label>
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className={`w-full text-indigo-500 dark:text-indigo-400 font-bold text-sm ${compact ? "h-[42px]" : "h-[48px]"}`}
                        >
                            <option value="gemini">Gemini</option>
                            <option value="vllm">vLLM (Custom)</option>
                            <option value="openai">OpenAI GPT-4o</option>
                            <option value="anthropic">Claude 3.5 Sonnet</option>
                            <option value="huggingface">HuggingFace Inference</option>
                        </select>
                    </div>

                    <div className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Key className="w-3 h-3" /> AI API Key
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Paste API key..."
                                className="w-full text-sm h-[40px]"
                            />
                        </div>

                        {discovery && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="space-y-1.5"
                            >
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Tavily Search Key
                                </label>
                                <input
                                    type="password"
                                    value={tavilyKey}
                                    onChange={(e) => setTavilyKey(e.target.value)}
                                    placeholder="Enter Tavily Key..."
                                    className="w-full text-sm h-[40px]"
                                />
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {provider === "vllm" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1.5"
                                >
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> vLLM Base URL
                                    </label>
                                    <input
                                        type="text"
                                        value={baseUrl}
                                        onChange={(e) => setBaseUrl(e.target.value)}
                                        placeholder="http://localhost:8000/v1"
                                        className="w-full text-sm h-[40px]"
                                    />
                                </motion.div>
                            )}

                            {provider === "huggingface" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1.5"
                                >
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Brain className="w-3 h-3" /> HuggingFace Model ID
                                    </label>
                                    <input
                                        type="text"
                                        value={modelName}
                                        onChange={(e) => setModelName(e.target.value)}
                                        placeholder="e.g. meta-llama/Llama-3.2-3B-Instruct"
                                        className="w-full text-sm h-[40px]"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 group mt-4 rounded-xl font-bold transition-all ${compact ? "h-[48px] text-sm" : "h-[56px] text-base"} ${discovery
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] border-none"
                                : "primary"
                            }`}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                {discovery ? `Hunt Trends in ${field}` : `Draft from Knowledge`}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
