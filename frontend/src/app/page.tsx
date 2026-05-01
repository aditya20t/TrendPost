"use client";

import { useState, useEffect } from "react";
import InputDashboard from "@/components/InputDashboard";
import DraftEditor from "@/components/DraftEditor";
import ResearchPanel from "@/components/ResearchPanel";
import ThoughtProcess from "@/components/ThoughtProcess";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wand2, Sun, Moon, Coffee, Heart } from "lucide-react";

export default function Home() {
  const [draft, setDraft] = useState<string | null>(null);
  const [, setInitialDraft] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const [iterations, setIterations] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isDiscovery, setIsDiscovery] = useState(false);
  
  // Intermediate step data
  const [plannerNotes, setPlannerNotes] = useState("");
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [strategicAngle, setStrategicAngle] = useState("");
  const [critique, setCritique] = useState("");
  const [draftHistory, setDraftHistory] = useState<string[]>([]);

  // Sync theme with body class
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleGenerate = async (data: Record<string, unknown>) => {
    setLoading(true);
    setDraft(null);
    setInitialDraft(null);
    setCitations([]);
    setStatus(data.discovery_mode ? "Hunting for latest niche trends..." : "Gathering context...");
    setAgentStatus(null);
    setPlannerNotes("");
    setSearchQueries([]);
    setStrategicAngle("");
    setCritique("");
    setDraftHistory([]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/generate-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setStatus("Crafting your post...");
      const result = await response.json();
      setDraft(result.draft);
      setInitialDraft(result.initial_draft || null);
      setCitations(result.citations || []);
      setAgentStatus(result.agent_status || null);
      setIterations(result.total_iterations || 0);
      setPlannerNotes(result.planner_notes || "");
      setSearchQueries(result.search_queries || []);
      setStrategicAngle(result.strategic_angle || "");
      setCritique(result.critique || "");
      setDraftHistory(result.draft_history || []);
    } catch (error) {
      console.error("Failed to generate draft:", error);
      alert("Failed to connect to the backend. Is it running?");
    } finally {
      setLoading(false);
      setStatus(null);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <main 
      className="min-h-screen flex flex-col items-center transition-colors duration-500"
      style={{ padding: 'var(--fluid-py) var(--fluid-px)' }}
    >
      <AnimatePresence>
        {isDiscovery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="glow-mesh"
          />
        )}
      </AnimatePresence>
      {/* Top Navigation / Links */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 z-50">
        <a
          href="https://github.com/aditya20t/TrendPost"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full glass-card border border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-all group"
          title="GitHub Repository"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-700 dark:fill-slate-300 group-hover:fill-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors hidden md:inline">GitHub</span>
        </a>
        <a
          href="https://ko-fi.com/aditya20t"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full glass-card border border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-all group"
          title="Buy me a coffee"
        >
          <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors" />
          <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors hidden md:inline">Support</span>
        </a>
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-3 rounded-full glass-card border border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-all group"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
          ) : (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {!draft && !loading && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="text-center mb-10 md:mb-16"
          >
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="font-black mb-6 title-gradient tracking-tighter px-4 leading-[1.1]"
              style={{ fontSize: 'var(--fluid-h1)' }}
            >
              TrendPost.
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto px-6 balance-text">
              Your niche, your voice, powered by <span className="text-indigo-500 font-bold">AI</span>.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full ${draft || loading ? "max-w-7xl 2xl:max-w-screen-2xl flex flex-col lg:flex-row items-start gap-8 lg:gap-12" : "max-w-6xl"} px-6 sm:px-10 lg:px-12 relative z-10 transition-all duration-500`}>
        
        {/* Input Dashboard Column */}
        <div className={`transition-all duration-500 ${draft || loading ? "w-full lg:w-[380px] shrink-0 lg:sticky top-6" : "w-full"}`}>
          <InputDashboard 
            onGenerate={handleGenerate} 
            onDiscoveryChange={setIsDiscovery} 
            compact={draft !== null || loading} 
          />

          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 flex items-center gap-3 px-6 py-4 glass-card border-black/5 dark:border-white/5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
              >
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                <div className="flex flex-col">
                  <span className="text-slate-600 dark:text-slate-300 font-bold text-sm">{status}</span>
                  {agentStatus && (
                    <span className="text-indigo-500/80 font-medium text-[10px] uppercase tracking-wider">{agentStatus}</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Columns */}
        <AnimatePresence mode="wait">
          {(draft || loading) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-grow w-full flex flex-col gap-8 items-stretch"
            >
                <div className="flex-grow w-full space-y-8">
                    {draft ? (
                      <>
                        <DraftEditor 
                          key={`draft-${iterations}`}
                          draft={draft} 
                          iterations={iterations}
                          onDismiss={() => setDraft(null)} 
                        />
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                          <div className="xl:col-span-7">
                            <ThoughtProcess 
                              plannerNotes={plannerNotes}
                              searchQueries={searchQueries}
                              strategicAngle={strategicAngle}
                              critique={critique}
                              draftHistory={draftHistory}
                            />
                          </div>
                          <div className="xl:col-span-5 lg:sticky top-6">
                            <ResearchPanel citations={citations} loading={loading} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="glass-card p-8 md:p-12 h-[500px] flex flex-col items-center justify-center text-center space-y-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative p-5 bg-indigo-500/10 rounded-2xl animate-pulse">
                              <Wand2 className="w-8 h-8 md:w-12 md:h-12 text-indigo-500" />
                            </div>
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2">Drafting your post...</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">Our AI is synthesizing the research and crafting your authentic voice.</p>
                        </div>
                      </div>
                    )}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-16 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a 
            href="https://github.com/aditya20t/TrendPost" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-black/5 dark:border-white/5 hover:border-indigo-500/50 hover:text-indigo-500 transition-all group"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">GitHub</span>
          </a>
          <a 
            href="https://ko-fi.com/aditya20t" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-black/5 dark:border-white/5 hover:border-indigo-500/50 hover:text-indigo-500 transition-all group"
            title="Buy me a coffee"
          >
            <Coffee className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Buy me a coffee</span>
          </a>
        </div>
        <p className="text-slate-500 dark:text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center flex items-center gap-2">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> by Aditya
        </p>
        <p className="text-slate-500/60 dark:text-slate-600/60 text-[9px] font-bold uppercase tracking-[0.2em] text-center">
          Built for the ambitious creator
        </p>
      </footer>
    </main>
  );
}
