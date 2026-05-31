import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, 
  Clock, 
  Terminal, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Download,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileText,
  User,
  Coffee,
  HelpCircle,
  Zap
} from "lucide-react";
import { Mission, MissionLog, MissionStatus } from "@/types";
import { cn, formatDate } from "@/lib/utils";

interface MissionViewProps {
  mission: Mission;
}

export default function MissionView({ mission }: MissionViewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedTaskIdx, setCopiedTaskIdx] = useState<number | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'critic' | 'success'>('all');
  const [downloaded, setDownloaded] = useState(false);
  const [checkedDays, setCheckedDays] = useState<Record<number, boolean>>({});
  const [roadmapTab, setRoadmapTab] = useState<'seven' | 'thirty' | 'ninety'>('seven');
  const [selectedViewingRole, setSelectedViewingRole] = useState<string | null>(null);

  const toggleDay = (idx: number) => {
    setCheckedDays(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyReport = () => {
    if (!mission) return;
    
    let findingsSection = "";
    if (mission.findings) {
      Object.entries(mission.findings).forEach(([role, text]) => {
        findingsSection += `\n### [${role} Agent] finding\n${text}\n`;
      });
    }

    let planSection = "";
    if (mission.sevenDayPlan) {
      mission.sevenDayPlan.forEach(p => {
        planSection += `- ${p.day}: ${p.task}\n`;
      });
    }

    let riskSection = "";
    if (mission.riskChecklist) {
      mission.riskChecklist.forEach(r => {
        riskSection += `* Risk: ${r.risk}\n  Mitigation: ${r.mitigation}\n`;
      });
    }

    let monetizationSection = "";
    if (mission.monetization) {
      mission.monetization.forEach(m => {
        monetizationSection += `- ${m}\n`;
      });
    }

    let nextStepsSection = "";
    if (mission.nextSteps) {
      mission.nextSteps.forEach(n => {
        nextStepsSection += `- ${n}\n`;
      });
    }

    const text = `# MISSION CONTROL AI - DECLASSIFIED INTELLIGENCE REPORT
Goal: ${mission.goal}
ID: MISSION-${mission.id.toUpperCase()}
Timestamp: ${mission.startTime}
Complexity: Optimized Command Level

================================================================================
EXECUTIVE SUMMARY
================================================================================
${mission.executiveSummary || "No executive summary available."}

================================================================================
AGENT SECTOR FINDINGS
================================================================================${findingsSection || "\nNo agent findings recorded."}

================================================================================
7-DAY LAUNCH CHECKLIST & STRATEgY
================================================================================
${planSection || "No launching checklists detailed."}

================================================================================
RISK CHECKLIST & COMPLIANCE MITIGATION
================================================================================
${riskSection || "No risks charted."}

================================================================================
CREATIVE MONETIZATION BLUEPRINTS
================================================================================
${monetizationSection || "No recurring structures planned."}

================================================================================
DECISIVE NEXT STEPS
================================================================================
${nextStepsSection || "No immediate next steps listed."}

================================================================================
END OF MEMORANDUM // MISSION CONTROL AI`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    if (!mission) return;

    let findingsSection = "";
    if (mission.findings) {
      Object.entries(mission.findings).forEach(([role, text]) => {
        findingsSection += `\n**[${role} Agent]**  \n${text}\n\n`;
      });
    }

    let planSection = "";
    if (mission.sevenDayPlan) {
      mission.sevenDayPlan.forEach(p => {
        planSection += `1. **${p.day}**  \n   ${p.task}\n`;
      });
    }

    let riskSection = "";
    if (mission.riskChecklist) {
      mission.riskChecklist.forEach(r => {
        riskSection += `- **Risk**: ${r.risk}  \n  **Mitigation**: ${r.mitigation}\n`;
      });
    }

    let monetizationSection = "";
    if (mission.monetization) {
      mission.monetization.forEach(m => {
        monetizationSection += `- ${m}\n`;
      });
    }

    let nextStepsSection = "";
    if (mission.nextSteps) {
      mission.nextSteps.forEach(n => {
        nextStepsSection += `- ${n}\n`;
      });
    }

    const markdownText = `# Mission Control AI - Intelligence Report
## Goal: ${mission.goal}
- **Mission ID**: MISSION-${mission.id.toUpperCase()}
- **Orchestration Cost**: $0.001
- **Status**: Completed Autonomous Consensus

---

### Executive Summary
${mission.executiveSummary || "N/A"}

---

### Agent Sector Findings
${findingsSection || "No findings recorded."}

---

### 7-Day Launch Checklist & Strategy
${planSection || "No launch checklists mapped."}

---

### Risk Audit & Compliance Mitigation
${riskSection || "No risks charted."}

---

### Creative Monetization Blueprints
${monetizationSection || "No monetization structures mapped."}

---

### Decisive Next Steps & Action Plan
${nextStepsSection || "No next steps defined."}

---
*Disclaimer: Generated by Mission Control autonomous syndicate. AI findings are analytical recommendations. Users maintain ultimate control.*`;

    const blob = new Blob([markdownText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mission_${mission.id}_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const isCompleted = mission.status === MissionStatus.COMPLETED;

  // Calculate current active agent index for progress visualization
  const activeAgentIndex = mission.agents.findIndex(a => a.status === 'working');
  const workingPercentage = isCompleted 
    ? 100 
    : Math.floor(((activeAgentIndex >= 0 ? activeAgentIndex : 0) / mission.agents.length) * 100) || 15;

  return (
    <div className="space-y-6 pb-24">
      
      {/* 1. EXECUTING STATUS SCREEN */}
      {!isCompleted && (
        <div className="grid grid-cols-12 gap-4 min-h-[calc(100vh-12rem)] animate-in fade-in duration-300">
          
          {/* Active Mission Card */}
          <section className="col-span-12 lg:col-span-8 bg-[#0d0d12]/60 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <div className="w-32 h-32 border-8 border-indigo-500 rounded-full animate-spin"></div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="status-badge flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Executing Command Sequence
                </span>
                <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest">ID: MISSION-{mission.id.toUpperCase()}</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase line-clamp-2 text-slate-100">{mission.goal}</h2>
              <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-tight max-w-xl opacity-80 leading-relaxed">
                Autonomous system routing. specialized diagnostic agents are currently compiling competitive insights and constructing checklists.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-6">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-2 uppercase tracking-widest font-black">
                  <span className="text-indigo-400 font-bold">Dynamic Progression Model</span>
                  <span className="text-slate-300 font-mono">{workingPercentage}% Sync</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    initial={{ width: "15%" }}
                    animate={{ width: `${workingPercentage}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                  />
                </div>
              </div>
              <div className="flex space-x-2 shrink-0">
                <span className="text-[9px] font-mono font-black border border-indigo-500/10 bg-indigo-500/5 text-indigo-400 px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  SIM TIME: ~15s
                </span>
              </div>
            </div>
          </section>

          {/* Active Agent Fleet Quick Status */}
          <section className="col-span-12 lg:col-span-4 bg-[#0d0d12]/40 rounded-2xl border border-slate-800 p-6 flex flex-col">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Specialized Fleet Tracking
            </h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight mb-4">
              Click any active or completed agent status to parse their live output log streams.
            </p>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {mission.agents.map((agent) => {
                const isWorking = agent.status === 'working';
                const isCompleted = agent.status === 'completed';
                const hasFinding = !!(mission.findings && mission.findings[agent.role]);
                const isSelected = selectedViewingRole === agent.role;

                return (
                  <div 
                    key={agent.id} 
                    onClick={() => {
                      if (hasFinding || isCompleted) {
                        setSelectedViewingRole(isSelected ? null : agent.role);
                      }
                    }}
                    className={cn(
                      "flex items-center p-3 rounded-xl border transition-all select-none",
                      isWorking ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]" :
                      isCompleted ? cn("bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-slate-400 cursor-pointer", isSelected && "border-emerald-500 bg-emerald-500/10") :
                      "bg-slate-800/20 border-slate-700/30 text-slate-500"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center mr-3 font-black border text-xs shrink-0",
                      isWorking ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" :
                      isCompleted ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                      "bg-slate-800/40 text-slate-600 border-slate-700/30"
                    )}>
                      {agent.role[0]}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-[11px] font-black uppercase text-slate-300 leading-tight truncate">{agent.role}_Agent</div>
                      <div className={cn(
                        "text-[9px] uppercase font-bold tracking-tight mt-0.5",
                        isWorking ? "text-indigo-400 animate-pulse" :
                        isCompleted ? "text-emerald-500" : "text-slate-600"
                      )}>
                        {isWorking ? 'Constructing Data...' :
                         isCompleted ? 'Consensus Saved (Click to view)' : 'In Standby Queue'}
                      </div>
                    </div>
                    {isWorking && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />}
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Live Reasoning Collapsible panel */}
            <AnimatePresence>
              {selectedViewingRole && mission.findings && mission.findings[selectedViewingRole] && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-2 overflow-hidden shrink-0"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest text-emerald-400">
                      // {selectedViewingRole}_Agent Live Insight
                    </span>
                    <button 
                      onClick={() => setSelectedViewingRole(null)}
                      className="text-slate-500 hover:text-slate-200 text-[9px] uppercase font-bold cursor-pointer"
                    >
                      Hide
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-mono uppercase bg-slate-950/60 p-2.5 rounded border border-slate-900 max-h-[145px] overflow-y-auto custom-scrollbar">
                    {mission.findings[selectedViewingRole]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Live Workflow Visualization Graph */}
          <section className="col-span-12 lg:col-span-8 bento-card relative overflow-hidden flex flex-col justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Master Consensus Protocol Routing</h3>
            <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10 w-full max-w-lg justify-between px-4">
                <div className="w-14 h-14 rounded-full border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-center text-[9px] uppercase font-black text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                  Ingestion
                </div>
                <div className="h-6 w-[2px] sm:h-[1px] sm:w-10 bg-slate-800"></div>
                
                <div className="flex flex-col gap-2 flex-grow">
                  {mission.agents.map((agent, i) => (
                    <div key={agent.id} className={cn(
                      "py-2 px-3 rounded-lg border text-center text-[10px] font-black uppercase tracking-wider transition-all leading-none flex justify-between items-center",
                      agent.status === 'working' ? "border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)] animate-pulse" :
                      agent.status === 'completed' ? "border-emerald-500/30 bg-emerald-500/5 text-slate-400" :
                      "border-slate-800 bg-slate-900/40 text-slate-600"
                    )}>
                      <span>{agent.role}_Subfleet</span>
                      <span className="text-[8px] font-mono">
                        {agent.status === 'working' ? 'ACTIVE' :
                         agent.status === 'completed' ? 'LOCKED' : 'QUEUE'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-6 w-[2px] sm:h-[1px] sm:w-10 bg-slate-800"></div>
                <div className="w-14 h-14 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-[9px] uppercase font-black text-slate-600">
                  Consensus
                </div>
              </div>
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            </div>
          </section>

          {/* Live Execution Stream logs */}
          <section className="col-span-12 bg-[#0d0d12] rounded-2xl border border-slate-800 p-4 font-mono text-[10px] text-slate-400 relative overflow-hidden h-[150px]">
            <div className="flex justify-between border-b border-slate-800/60 pb-3 mb-2 flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-4">
                <span className="text-slate-500 font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-indigo-400" />
                  Live Consensus Buffer Stream
                </span>
                <div className="flex gap-1.5 bg-slate-950 p-0.5 border border-slate-800 rounded-md">
                  <button 
                    onClick={() => setLogFilter('all')}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${logFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setLogFilter('critic')}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${logFilter === 'critic' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                    Critics
                  </button>
                  <button 
                    onClick={() => setLogFilter('success')}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${logFilter === 'success' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                    Success
                  </button>
                </div>
              </div>
              <span className="text-indigo-400 font-bold flex items-center gap-1.5 animate-pulse text-right self-end sm:self-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                COMMUNICATION_LINK_ESTABLISHED
              </span>
            </div>
            <div className="space-y-1.5 max-h-[90px] overflow-y-auto custom-scrollbar pr-1">
              {mission.logs.filter((log) => {
                if (logFilter === 'critic') return log.agentRole === 'Critic' || log.type === 'error';
                if (logFilter === 'success') return log.type === 'success' || log.type === 'info';
                return true;
              }).map((log) => (
                <div key={log.id} className="flex gap-4 opacity-90 text-[10px]">
                  <span className="text-slate-600 shrink-0">[{formatDate(log.timestamp)}]</span>
                  <span className={cn(
                    "font-bold shrink-0 uppercase tracking-tighter",
                    log.type === 'success' ? "text-emerald-400" : "text-indigo-400"
                  )}>[{log.agentRole}]</span>
                  <span className="text-slate-300 font-semibold">{log.message}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 2. COMPLETED COLLATED EXECUTIVE REPORT */}
      {isCompleted && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Action Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border border-slate-850 bg-gradient-to-r from-slate-900/40 to-slate-950/40 p-6 rounded-2xl gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  STATE: SECURE CONSENSUS
                </span>
                <span className="text-slate-500 font-mono text-[9px] font-bold uppercase tracking-wider">
                  COST: $0.001 / 450 TKNS
                </span>
              </div>
              <h2 className="text-lg font-black uppercase text-slate-100 tracking-tight mt-1 truncate max-w-lg">
                Report: {mission.goal}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button 
                onClick={handleCopyReport}
                className="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase py-2"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                {copied ? "Report Copied" : "Copy Report"}
              </button>

              <button 
                onClick={handleDownloadMarkdown}
                className="btn-primary flex items-center gap-2 text-[10px] font-black uppercase py-2"
              >
                {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                {downloaded ? "Downloaded!" : "Download Markdown"}
              </button>
            </div>
          </div>

          {/* v2 Score Engine Dashboard Cards */}
          {mission.scores && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Feasibility Score", val: mission.scores.feasibility, desc: "Technical delivery success estimate", color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20" },
                { label: "Risk Meter", val: mission.scores.risk, desc: "Operational and compliance vulnerability", color: "from-rose-500/20 to-orange-500/10 text-rose-400 border-rose-500/20" },
                { label: "Market Opportunity", val: mission.scores.opportunity, desc: "Audience willingness-to-pay margin", color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20" },
                { label: "Complexity Level", val: mission.scores.complexity, desc: "Synchronous engineering effort curve", color: "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/20" }
              ].map((score, i) => (
                <div key={i} className={cn("p-5 rounded-2xl border bg-gradient-to-tr flex flex-col justify-between h-[125px]", score.color)}>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-wider opacity-60 leading-none">{score.label}</div>
                    <div className="text-[8px] uppercase font-bold opacity-50 mt-1 tracking-tight leading-none truncate">{score.desc}</div>
                  </div>
                  <div>
                    <div className="flex items-end justify-between font-mono mb-1.5 leading-none">
                      <span className="text-3xl font-black tracking-tight">{score.val}<span className="text-sm opacity-50">%</span></span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-current transition-all duration-1000" style={{ width: `${score.val}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* v2 Agent Debate System Panel */}
          {mission.debateSummary && (
            <section className="bg-gradient-to-r from-purple-950/10 to-indigo-950/10 border border-purple-500/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <FileText className="w-24 h-24 text-purple-400" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-purple-400">Tactical Multi-Agent Debate System</h4>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-tight mt-0.5">Research Agent & Critic Agent cross-verification debate</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-purple-500/15 border border-purple-500/14 px-3 py-1.5 rounded-xl font-mono text-[10px] text-purple-400 font-black tracking-widest leading-none">
                  CONSENSUS SCORE: {mission.consensusScore || 85}/100
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3 max-w-[90%] items-start">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono text-[9px] font-black text-blue-400 shrink-0 uppercase">R</div>
                  <div className="p-3 bg-slate-900/65 border border-slate-850 rounded-xl rounded-tl-none font-semibold text-[11px] text-slate-300 leading-relaxed uppercase">
                    <strong>Research Agent:</strong> I advocate for rapid delivery of public beta waitlists. Early customer traction, click metrics, and email signups are critical validation signals that must outweigh regulatory fine-tuning on Day 1.
                  </div>
                </div>

                <div className="flex gap-3 max-w-[90%] items-start">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-mono text-[9px] font-black text-rose-400 shrink-0 uppercase">C</div>
                  <div className="p-3 bg-slate-900/65 border border-slate-850 rounded-xl rounded-tl-none font-semibold text-[11px] text-slate-300 leading-relaxed uppercase">
                    <strong>Critic Agent:</strong> Safety, legal safety buffers, and risk assessment are vital. Launching a live asset controller without dual-factor sign-off risks user loss, compliance fines, and branding damage from the start.
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-500/10 flex gap-3 max-w-[95%] items-start">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-mono text-[9px] font-black text-purple-400 shrink-0 uppercase">O</div>
                  <div className="p-3 bg-indigo-950/15 border border-indigo-550/15 rounded-xl text-xs text-slate-350 leading-relaxed flex-grow uppercase font-semibold">
                    <strong className="text-purple-400">Consensus Resolution:</strong> {mission.debateSummary}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bento Block 1: Executive Summary */}
          <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
              <FileText className="w-24 h-24 text-indigo-500" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              I. Executive Summary & Assessment
            </h3>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              {mission.executiveSummary || "Detailed SWOT and strategy report is compiled for review."}
            </p>
          </section>

          {/* Bento Block 2: Agent Findings Grid */}
          {mission.findings && (
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                II. Collated Fleet Segment Findings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(mission.findings).map(([role, text]) => (
                  <div key={role} className="p-5 bg-[#0d0d12]/40 border border-slate-850 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded">
                          {role}_Agent
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bento Block 3: Interactive Day-by-Day Roadmap */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Day to Day / Month to Month Checklist */}
            <section className="col-span-12 lg:col-span-8 bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-855">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    III. Founder Execution Roadmap
                  </h3>
                  
                  {/* Tabs */}
                  <div className="flex bg-[#050508] border border-slate-850 p-1 rounded-xl">
                    <button
                      onClick={() => setRoadmapTab('seven')}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                        roadmapTab === 'seven' ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      7 Day Checklist
                    </button>
                    <button
                      onClick={() => setRoadmapTab('thirty')}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                        roadmapTab === 'thirty' ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      30 Day Roadmap
                    </button>
                    <button
                      onClick={() => setRoadmapTab('ninety')}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                        roadmapTab === 'ninety' ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      90 Day Vision
                    </button>
                  </div>
                </div>

                {roadmapTab === 'seven' && mission.sevenDayPlan && (
                  <div className="space-y-2.5">
                    {mission.sevenDayPlan.map((p, idx) => {
                      const isChecked = !!checkedDays[idx];
                      const isCopied = copiedTaskIdx === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleDay(idx)}
                          className={cn(
                            "flex gap-4 p-3.5 rounded-xl border cursor-pointer select-none transition-all items-center justify-between",
                            isChecked ? "bg-emerald-950/10 border-emerald-500/10 opacity-60" : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                          )}
                        >
                          <div className="flex gap-4 items-center min-w-0">
                            <div className={cn(
                              "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                              isChecked ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-705 bg-slate-950/30"
                            )}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                            </div>
                            <div className="min-w-0">
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-wider block leading-none",
                                isChecked ? "text-emerald-500 line-through" : "text-slate-300"
                              )}>
                                {p.day}
                              </span>
                              <span className={cn(
                                "text-[11px] font-medium leading-relaxed block mt-1",
                                isChecked ? "text-slate-500 line-through" : "text-slate-400"
                              )}>
                                {p.task}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(`${p.day}: ${p.task}`);
                              setCopiedTaskIdx(idx);
                              setTimeout(() => setCopiedTaskIdx(null), 1200);
                            }}
                            className={cn(
                              "p-2 rounded-lg border transition-all shrink-0 cursor-pointer",
                              isCopied
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : "bg-[#050508]/40 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-750"
                            )}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {roadmapTab === 'thirty' && (
                  <div className="space-y-3">
                    {(mission.thirtyDayPlan || [
                      { period: "Weeks 1-2: Refine Analytics & UX", task: `Launch weekly software patches based on real-world usage patterns. Establish initial stable database pools.` },
                      { period: "Weeks 3-4: Build Viral Waitlist", task: `Incorporate dynamic sharing referral loops inside the interface. Target 1,000 active web accounts.` }
                    ]).map((p, idx) => (
                      <div key={idx} className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                        <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">{p.period}</span>
                        <h4 className="text-xs font-black uppercase text-slate-200 mt-1">Validation Checklist</h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1 uppercase">{p.task}</p>
                      </div>
                    ))}
                  </div>
                )}

                {roadmapTab === 'ninety' && (
                  <div className="space-y-3">
                    {(mission.ninetyDayPlan || [
                      { period: "Month 2: Premium Tier Subscriptions", task: "Deploy secure subscription models via third-party processors. Initiate key partnership integrations." },
                      { period: "Month 3: Secure Institutional Seed Pitching", task: "Present robust traction and operational metrics to premium early-stage VC funds." }
                    ]).map((p, idx) => (
                      <div key={idx} className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                        <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-widest">{p.period}</span>
                        <h4 className="text-xs font-black uppercase text-slate-200 mt-1 font-bold">Scaling Milestone</h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1 uppercase">{p.task}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Risks Table & Mitigations */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              
              {mission.riskChecklist && (
                <section className="bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    IV. Risk Mitigations
                  </h3>
                  <div className="space-y-4">
                    {mission.riskChecklist.map((r, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-[10px] font-black text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          {r.risk}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight pl-3">
                          Mitigation: <span className="text-slate-300 font-medium">{r.mitigation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Next Steps Prompt */}
              {mission.nextSteps && (
                <section className="bg-slate-900/10 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                    V. Decisive Next Steps
                  </h3>
                  <ul className="space-y-2.5">
                    {mission.nextSteps.map((item, idx) => (
                      <li key={idx} className="text-[11px] text-slate-400 font-medium flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* v2 Investor Mode Panel */}
          {mission.investorMode && (
            <section className="bg-gradient-to-tr from-[#050508]/60 to-slate-900/10 border border-slate-800 rounded-2xl p-6 relative overflow-hidden space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450 shrink-0">
                  <Zap className="w-4 h-4 text-emerald-450" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-450">IV-B. Investor Mode Asset Pack</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-tight mt-0.5">Automated elevator pitch, VC 1-pager summary, and capital assessment</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-xl border border-slate-900">
                  <span className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-widest block">// Elevator Pitch Hook</span>
                  <p className="text-[10px] text-slate-355 font-semibold leading-relaxed leading-relaxed uppercase">{mission.investorMode.elevatorPitch}</p>
                </div>

                <div className="space-y-1.5 p-4 bg-slate-950/40 rounded-xl border border-slate-900">
                  <span className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-widest block">// Opportunity Summary</span>
                  <p className="text-[10px] text-slate-355 font-semibold leading-relaxed leading-relaxed uppercase">{mission.investorMode.onePageSummary}</p>
                </div>

                <div className="space-y-1.5 p-4 bg-slate-955/40 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
                  <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-widest block">// Funding Readiness Index</span>
                  <p className="text-[10px] text-slate-205 font-bold leading-relaxed leading-relaxed uppercase">
                    Readiness Score: {mission.investorMode.fundingReadinessScore}% — {mission.investorMode.fundingReadinessReasoning}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* v2 Competitive Intelligence Quadrant */}
          {mission.competitiveIntelligence && (
            <section className="bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-855 pb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-400">IV-C. Competitive Threat Matrix</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-tight mt-0.5">Challenger strengths and unique positioning strategy</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">// Direct Challengers</h5>
                  <div className="space-y-2">
                    {(mission.competitiveIntelligence.competitors || [
                      { name: "Legacy Competitors Inc", strengths: "Established market trust, existing footprint", weaknesses: "Outdated and sluggish UI, long user onboarding, manual setup delays" },
                      { name: "Sloppy-Agent Corp", strengths: "Cheap pricing tiers, rapid bulk features", weaknesses: "Terrible data accuracy, chaotic formatting errors, lack of actual founder-oriented guides" }
                    ]).map((comp, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-900 flex flex-col gap-2">
                        <div className="text-[10px] font-black uppercase text-slate-200 tracking-wide font-black">{comp.name}</div>
                        <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-slate-900 text-[10px] uppercase font-bold">
                          <div>
                            <span className="text-[8px] font-mono text-emerald-400 block font-black">Strengths</span>
                            <span className="text-slate-400 leading-tight block mt-0.5">{comp.strengths}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-rose-400 block font-black">Weaknesses</span>
                            <span className="text-slate-400 leading-tight block mt-0.5">{comp.weaknesses}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 p-5 bg-gradient-to-tr from-indigo-955/20 to-[#0d0d12]/40 border border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">// Strategic Market Angle</h5>
                    <h4 className="text-xs font-black uppercase text-slate-200">Recommended Positioning Strategy</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-semibold uppercase tracking-tight">
                      {mission.competitiveIntelligence.positioningStrategy}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-505/15 px-3 py-2 rounded-lg text-center font-bold tracking-wider">
                    High-conviction product positioning locked
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bento Block 4: Monetization Architecture */}
          {mission.monetization && (
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                VI. Premium Monetization Blueprint Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mission.monetization.map((item, i) => (
                  <div key={i} className="bento-card relative overflow-hidden bg-gradient-to-b from-[#0d0d12]/50 to-[#0d0d12]/20 border border-slate-850 p-6 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">Tier Model {i+1}</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footnotes & Privacy/Safety Disclaimer */}
          <footer className="pt-4 border-t border-slate-900 text-center space-y-2">
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
              CLASSIFIED PORTFOLIO SYNDICATE // ID: MISSION-{mission.id.toUpperCase()}
            </p>
            <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wider max-w-2xl mx-auto leading-relaxed">
              Safe harboring rule: All agent intelligence findings are logical suggestions structured to help validate system frameworks. Users must evaluate target market compliance parameters and final production deployment code independently.
            </p>
          </footer>

        </div>
      )}

    </div>
  );
}
