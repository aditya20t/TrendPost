"use client";

import { useState, useEffect } from "react";
import InputDashboard from "@/components/InputDashboard";
import DraftEditor from "@/components/DraftEditor";
import ResearchPanel from "@/components/ResearchPanel";
import ThoughtProcess from "@/components/ThoughtProcess";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wand2, Sun, Moon } from "lucide-react";

export default function Home() {
  const [draft, setDraft] = useState<string | null>(null);
  const [initialDraft, setInitialDraft] = useState<string | null>(null);
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

  const handleGenerate = async (data: any) => {
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
    <main className="min-h-screen px-4 py-8 md:px-12 md:py-24 flex flex-col items-center transition-colors duration-500">
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

      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full glass-card border border-black/10 dark:border-white/10 hover:border-indigo-500/50 transition-all z-50 group"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400 group-hover:text-white transition-colors" />
        )}
      </button>

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
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-500 uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.2)]">Alpha v3.0</span>
            </motion.div>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 title-gradient tracking-tighter px-4 leading-[1.1]">
              TrendPost.
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto px-6">
              Your niche, your voice, powered by <span className="text-indigo-500 font-bold">AI</span>.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full ${draft || loading ? "max-w-[1600px] flex flex-col xl:flex-row items-start gap-6 lg:gap-8" : "max-w-6xl"} px-4 xl:px-0 relative z-10 transition-all duration-500`}>
        
        {/* Input Dashboard Column */}
        <div className={`transition-all duration-500 ${draft || loading ? "w-full xl:w-[380px] shrink-0 xl:sticky top-6" : "w-full"}`}>
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
              className="flex-grow w-full flex flex-col gap-6 lg:gap-8 items-stretch"
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                <div className="flex-grow w-full space-y-6 lg:space-y-8">
                    {draft ? (
                      <>
                        <DraftEditor 
                          draft={draft} 
                          iterations={iterations}
                          citations={citations} 
                          onDismiss={() => setDraft(null)} 
                        />
                        <ThoughtProcess 
                          plannerNotes={plannerNotes}
                          searchQueries={searchQueries}
                          strategicAngle={strategicAngle}
                          critique={critique}
                          draftHistory={draftHistory}
                        />
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
                <div className="w-full lg:w-[400px] shrink-0">
                  <ResearchPanel citations={citations} loading={loading} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-16 text-slate-500 dark:text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">
        Built for the ambitious creator.
      </footer>
    </main>
  );
}
