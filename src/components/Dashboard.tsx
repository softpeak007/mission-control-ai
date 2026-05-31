import { motion } from "motion/react";
import React, { useState } from "react";
import { 
  Rocket, 
  Search, 
  Code2, 
  Zap, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  ArrowRight,
  Activity,
  Terminal,
  X,
  HelpCircle,
  HelpCircle as OnboardingIcon,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const MODE_CARDS = [
  { id: 'mission', title: 'Mission Mode', desc: 'Execute complete company goals', icon: Target, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'workflow', title: 'Workflow Mode', desc: 'Parallel multi-agent execution', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { id: 'research', title: 'Deep Research', desc: 'Multi-source verification', icon: Search, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'goal', title: 'Goal Mode', desc: 'Auto-pilot until criteria met', icon: Rocket, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

const TEMPLATES = [
  {
    id: "budget_startup",
    title: "AI SaaS on $500 Budget",
    prompt: "Launch an AI SaaS startup for small businesses with $500 budget.",
    icon: Rocket,
    color: "from-violet-500/25 to-violet-900/10 text-violet-400 border-violet-500/20"
  },
  {
    id: "startup",
    title: "Launch a Startup Idea",
    prompt: "Formulate a startup concept for an AI-powered personal automated chef service.",
    icon: Lightbulb,
    color: "from-amber-500/20 to-amber-900/10 text-amber-400 border-amber-500/20"
  },
  {
    id: "mvp",
    title: "Build an App MVP",
    prompt: "Build a scalable Web3 app MVP for local neighborhood resource lending.",
    icon: Code2,
    color: "from-indigo-500/20 to-indigo-900/10 text-indigo-400 border-indigo-500/20"
  },
  {
    id: "marketing",
    title: "Create Marketing Plan",
    prompt: "Create a hyper-targeted guerrilla marketing program for a high-intensity energy bar launch.",
    icon: Target,
    color: "from-rose-500/20 to-rose-900/10 text-rose-400 border-rose-500/20"
  },
  {
    id: "risk",
    title: "Analyze Business Risk",
    prompt: "Conduct a thorough financial and operational risk analysis for entering the autonomous drone delivery space.",
    icon: ShieldCheck,
    color: "from-emerald-500/20 to-emerald-900/10 text-emerald-400 border-emerald-500/20"
  }
];

export default function Dashboard({ onCreateMission }: { onCreateMission: (goal: string) => void }) {
  const [goal, setGoal] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) onCreateMission(goal);
  };

  const handleApplyTemplate = (prompt: string) => {
    setGoal(prompt);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 pb-20">
      
      {/* Onboarding Portal - Dismissible */}
      {showOnboarding && (
        <section className="col-span-12 bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-slate-950/40 rounded-2xl border border-indigo-500/20 p-6 relative overflow-hidden">
          <button 
            onClick={() => setShowOnboarding(false)}
            className="absolute top-4 right-4 rounded-lg p-1 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <OnboardingIcon className="w-6 h-6" />
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Welcome to Mission Control AI Onboarding</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Mission Control is a multi-agent orchestration console designed to turn complex company goals into structured execution intel.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-[10px] text-indigo-400 font-mono uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">Hackathon Judge Mode Active</span>
                  <button
                    onClick={() => onCreateMission("Judge Demo: Automated Cryptographic Family Trust Protocol")}
                    type="button"
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-lg text-white shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                    ⚡ Run Instant Judge Demo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#050508]/40 border border-slate-800 rounded-xl p-4">
                <div>
                  <h4 className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">// 1. STATE GOALS</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight mt-1">
                    Describe your launch goals in plain English or click a precompiled demo templates below.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">// 2. DEPLOY FLEET</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight mt-1">
                    Our master system recruits a custom fleet of agents (Research, Product, Strategy, Critic, etc).
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">// 3. SECURE PLANS</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight mt-1">
                    Let agents refine tasks asynchronously and compile your detailed, exportable 7-day action report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section - Bento Style */}
      <section className="col-span-12 lg:col-span-8 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <div className="w-48 h-48 border-[16px] border-indigo-500 rounded-full animate-pulse"></div>
        </div>
        
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-4 relative z-10"
         >
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase rounded border border-indigo-500/30">Release v1.0.4</span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Autonomous Core Online</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
            Turn Any Goal Into <br /> 
            <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8 italic">Execution.</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
            Mission Control orchestrates a fleet of specialized AI agents to transform your 
            highest-level visions into validated, executable company workflows.
          </p>
        </motion.div>
      </section>

      {/* Stats Quick View */}
      <section className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4">
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 flex flex-col justify-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Daily Throughput</div>
          <div className="text-4xl font-black font-mono tracking-tighter">8.4<span className="text-xl text-slate-500">M</span></div>
          <div className="text-emerald-400 text-[10px] font-bold uppercase mt-2 tracking-tighter group flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            12% Efficiency Gain
          </div>
        </div>
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 flex flex-col justify-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Agent Reliability</div>
          <div className="text-4xl font-black font-mono tracking-tighter">99.8<span className="text-xl text-slate-500">%</span></div>
          <div className="grid grid-cols-6 gap-1 mt-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-1 bg-emerald-500 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Input Field - Full Width Bento */}
      <section className="col-span-12 bg-[#0d0d12] border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-colors shadow-2xl">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex items-center justify-center pl-6 text-slate-500">
            <Terminal className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Command: Define your mission goal (e.g. 'Build a decentralized finance platform')..."
            className="flex-1 bg-transparent border-0 px-4 py-6 text-lg focus:ring-0 placeholder:text-slate-700 outline-none font-bold tracking-tight text-slate-200"
          />
          <button 
            type="submit"
            className="btn-primary px-8 h-auto mr-1"
          >
            Launch Command
          </button>
        </form>
      </section>

      {/* QUICK CLICKS: Demo Mission Templates */}
      <section className="col-span-12 space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Quick-Launch Demo Mission Templates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tmpl) => (
            <div 
              key={tmpl.id}
              onClick={() => handleApplyTemplate(tmpl.prompt)}
              className={cn(
                "p-4 rounded-xl border bg-gradient-to-b cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-[150px] relative group overflow-hidden",
                tmpl.color
              )}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <tmpl.icon className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-[8px] font-mono font-black border border-white/10 px-2 py-0.5 rounded uppercase tracking-widest bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Load
                  </span>
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-wider">{tmpl.title}</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight line-clamp-3">
                  {tmpl.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mode Grid */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-4">
        {MODE_CARDS.map((mode, i) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="bento-card text-left group hover:border-[#1e1b4b]"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110", mode.bg)}>
              <mode.icon className={cn("w-5 h-5", mode.color)} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-2">{mode.title}</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
              {mode.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Fleet Status */}
      <section className="col-span-12 lg:col-span-4 bg-slate-900/40 rounded-2xl border border-slate-800 p-6 flex flex-col">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Active Agent Fleet</h3>
        <div className="space-y-3 flex-1">
          {[
            { role: 'Research', label: 'R', color: 'blue' },
            { role: 'Product', label: 'P', color: 'amber' },
            { role: 'Coding', label: 'C', color: 'emerald' },
            { role: 'QA', label: 'Q', color: 'rose' },
          ].map((agent) => (
            <div key={agent.role} className="flex items-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mr-3 font-black border",
                agent.color === 'blue' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                agent.color === 'amber' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                agent.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                "bg-rose-500/10 text-rose-400 border-rose-500/20"
              )}>
                {agent.label}
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-black uppercase text-slate-200">{agent.role}_Agent</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Status: Standby</div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      {/* Safety Pass banner */}
      <section className="col-span-12 p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
          Safety Protocol Engaged: All generated strategies, monetization vectors, and milestone roadmaps are analytical recommendations structured by AI agents. Users retain total authority and input responsibility.
        </p>
      </section>
    </div>
  );
}
