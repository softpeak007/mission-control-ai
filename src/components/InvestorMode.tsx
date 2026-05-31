import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  TrendingUp, 
  Coins, 
  ShieldAlert, 
  DollarSign, 
  Award, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  Printer,
  ChevronLeft,
  ChevronRight,
  Layout,
  FileText,
  Percent,
  CircleCheck,
  Scale,
  ShieldCheck,
  Building
} from "lucide-react";
import { Mission, MissionStatus } from "@/types";
import { cn, formatDate } from "@/lib/utils";

// Static Demo Mission to prevent empty states and allow immediate elite platform evaluation
const DEMO_MISSION: Mission = {
  id: "demo-trust-protocol",
  goal: "Deploy an Automated Cryptographic Family Trust & Safe Asset Locker System",
  status: MissionStatus.COMPLETED,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  agents: [],
  logs: [],
  metrics: { tokensUsed: 1250, costEstimate: 0.001, duration: 1 },
  executiveSummary: "A secure, non-custodial decentralized legal-financial application enabling automated heirloom transfers via smart contracts and social recovery keys.",
  findings: {},
  sevenDayPlan: [
    { day: "Day 1", task: "Specify social recovery interfaces and mathematical MPC signature schemes." },
    { day: "Day 2", task: "Build a responsive high-contrast dashboard showing locker parameters." }
  ],
  investorMode: {
    elevatorPitch: "A decentralized legally binding escrow protocol allowing users to distribute heirlooms and assets securely via MPC-based social recovery and biometric keys.",
    onePageSummary: "Legacy trust setup is slow, restricted to high-net-worth clients, and lacks cryptographic immutability. SafeTrust digitizes physical wills, cryptographic keys, and deeds, triggering secure transfers upon automated verification.",
    marketSizeEstimate: "TAM: $35.4B worldwide estate planning, SAM: $8.2B digital heritage management, SOM: $1.1B tech-forward self-custodial asset locks.",
    revenuePotential: "First year projection: $1.2M based on $49 annual storage vault sub + 0.15% heirloom transfers. 3-year run rate target: $18.5M ARR with B2B custom notary licenses.",
    fundingReadinessScore: 92,
    fundingReadinessReasoning: "Excellent, fully detailed, compliant sandbox disclaimers are written, multi-agent protocol consensus has locked positive user feedback loops, and early Solana testnet code builds successfully.",
    investorConcerns: [
      { concern: "Legal compliance of smart escrow estate delivery across state lines", mitigation: "Integrate formal, custom jurisdiction selectors matching actual certified templates via local notary partners." },
      { concern: "Accidental dead-man trigger due to phone damage or inactivity", mitigation: "Enforce multi-party verification protocols and a 30-day soft cool-down verification window." }
    ],
    competitiveAdvantage: "First estate player leveraging both legally binding dual-factor signature protocols and MPC hardware biometric client security systems.",
    investmentRecommendation: "HIGH CONVICTION BUY: First-mover advantage in high-ticket non-custodial custody, targeting an underserved digital native wealth demographic."
  },
  competitiveIntelligence: {
    competitors: [
      { name: "Legacy Trusts Co.", strengths: "Well-known high-net-worth offline brand", weaknesses: "Manual verification, taking 4-6 weeks and costing $5,000 upfront" },
      { name: "CryptoSafe Corp", strengths: "Simple self-custody multisig ledger", weaknesses: "Terrible UX suited only for blockchain developers, absolute lack of legal backup links or family recovery flows" }
    ],
    positioningStrategy: "Position as the only premium user-friendly digital safe integrating BOTH legally certified document templates and standard MPC multi-signature safeguards."
  }
};

export default function InvestorMode() {
  const [missionsList, setMissionsList] = useState<Mission[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string>("demo");
  const [viewMode, setViewMode] = useState<"report" | "deck">("report");
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  // Load missions from local storage to list completed options
  useEffect(() => {
    const cached = localStorage.getItem("user_missions");
    if (cached) {
      try {
        const list = JSON.parse(cached) as Mission[];
        const completed = list.filter(m => m.status === MissionStatus.COMPLETED);
        setMissionsList(completed);
      } catch (e) {
        console.error("Failed to parse caching missions for investor mode:", e);
      }
    }
  }, []);

  const getActiveMission = (): Mission => {
    if (selectedMissionId === "demo") return DEMO_MISSION;
    const found = missionsList.find(m => m.id === selectedMissionId);
    return found || DEMO_MISSION;
  };

  const activeMission = getActiveMission();
  const investorData = activeMission.investorMode || DEMO_MISSION.investorMode!;

  // Fallback structures if the selected mission was generated before the expanded investor data updates
  const finalInvestorData = {
    elevatorPitch: investorData.elevatorPitch || `Execute highly precise multi-agent consensus processes to validate and launch "${activeMission.goal}" 10x faster.`,
    onePageSummary: investorData.onePageSummary || `A platform structured to address current bottlenecks for: "${activeMission.goal}". Synthesizing operational research and tech feasibility ensures immediate positioning in empty market quadrants.`,
    marketSizeEstimate: investorData.marketSizeEstimate || "TAM: $12.4B overall SaaS product planning and scoping platforms. SAM: $3.2B interactive roadmap management systems. SOM: $450M specialized pre-validation workspace solutions.",
    revenuePotential: investorData.revenuePotential || "First-year potential: $350k ARR targeting solo indie developers via a $29 Core Pro Tier. 3-year target: $5.2M ARR with enterprise white-label whiteboards.",
    fundingReadinessScore: investorData.fundingReadinessScore || 85,
    fundingReadinessReasoning: investorData.fundingReadinessReasoning || "Strong technical viability and ready-to-run interactive features. Low barrier to entry, but requires focused localized marketing to seed early cohorts.",
    investorConcerns: investorData.investorConcerns || [
      { concern: "Generative API dependency and rate exhaustion limits", mitigation: "Enforce smart client caching layers and fallback to local semantic databases if remote service is disrupted." },
      { concern: "Low switching cost for competitive agent utilities", mitigation: "Establish a durable user memory layer, archiving past roadmaps and real-world checklist execution milestones." }
    ],
    competitiveAdvantage: investorData.competitiveAdvantage || "Direct live consensus execution debates that help founders find blind spots before coding, combined with a persistent, intelligent strategic advisor available on every screen.",
    investmentRecommendation: investorData.investmentRecommendation || "WARM BUY: Product exhibits rapid turnaround speed and high design polish. Focus seed capital on acquiring 100 core product-builder advocates."
  };

  const handleCopyClipboard = () => {
    const textBlob = `INVESTMENT MEMORANDUM // DECLASSIFIED
MEMORANDUM DATE: ${new Date().toLocaleDateString()}
TARGET SYSTEM GOAL: ${activeMission.goal}
ELEVATOR PITCH: "${finalInvestorData.elevatorPitch}"
EXECUTIVE SUMMARY: ${finalInvestorData.onePageSummary}
MARKET SIZE ESTIMATE: ${finalInvestorData.marketSizeEstimate}
REVENUE POTENTIAL: ${finalInvestorData.revenuePotential}
FUNDING READINESS SCORE: ${finalInvestorData.fundingReadinessScore}%
RECOMMENDATION: "${finalInvestorData.investmentRecommendation}"`;
    navigator.clipboard.writeText(textBlob);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Printable layout window trigger
  const handlePrint = () => {
    window.print();
  };

  // Download raw markdown memo
  const handleDownloadMarkdown = () => {
    const textBlob = `# INVESTMENT MEMORANDUM // DECLASSIFIED
MEMORANDUM DATE: ${new Date().toLocaleDateString()}
TARGET SYSTEM GOAL: ${activeMission.goal}
DECISION CONFIDENCE: ${activeMission.consensusScore || 88}% Consensus Score

================================================================================
1. ELEVATOR PITCH
================================================================================
"${finalInvestorData.elevatorPitch}"

================================================================================
2. EXECUTIVE 1-PAGE SUMMARY
================================================================================
${finalInvestorData.onePageSummary}

================================================================================
3. MARKET SIZE ESTIMATE (TAM, SAM, SOM)
================================================================================
${finalInvestorData.marketSizeEstimate}

================================================================================
4. REVENUE & MONETIZATION POTENTIAL
================================================================================
${finalInvestorData.revenuePotential}

================================================================================
5. CAPITAL INVESTMENT GRADE & SCORE
================================================================================
Funding Readiness Score: ${finalInvestorData.fundingReadinessScore}/100
Reasoning / Details:
${finalInvestorData.fundingReadinessReasoning}

================================================================================
6. CRITICAL INVESTOR CONCERNS & COUNTER-MITIGATIONS
================================================================================
${finalInvestorData.investorConcerns.map((ic, i) => `[CONCERN #${i+1}]: ${ic.concern}\n[MITIGATION]: ${ic.mitigation}\n`).join("\n")}

================================================================================
7. DURABLE COMPETITIVE MOAT & ADVANTAGE
================================================================================
${finalInvestorData.competitiveAdvantage}

================================================================================
8. FINAL COMMITTEE RECOMMENDATION & VERDICT
================================================================================
VERDICT: ${finalInvestorData.investmentRecommendation}

================================================================================
END OF MEMORANDUM // MULTI-AGENT SYNDICATE CONSENSUS MET.`;

    const blob = new Blob([textBlob], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `investment_grade_report_${activeMission.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Define slides array for the interactive Pitch Deck Preview screen
  const slides = [
    {
      title: "Vision & Elevator Pitch",
      subtitle: "The ultimate 1-sentence value hook",
      icon: Award,
      color: "from-indigo-500/20 to-purple-500/5 text-indigo-400 border-indigo-500/20",
      content: (
        <div className="space-y-6 pt-4 h-full flex flex-col justify-center">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl relative">
            <div className="absolute top-3 left-3 text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">// CORE HOOK</div>
            <p className="text-sm md:text-base text-slate-100 font-black tracking-tight leading-relaxed text-center italic mt-4 uppercase">
              "{finalInvestorData.elevatorPitch}"
            </p>
          </div>
          <p className="text-slate-400 text-xs text-center font-semibold leading-relaxed">
            Formulated specifically to capture institutional and angel interest within the first 10 seconds of a presentation loop.
          </p>
        </div>
      )
    },
    {
      title: "One Page Startup Summary",
      subtitle: "Problem statement & operational summary",
      icon: FileText,
      color: "from-blue-500/20 to-sky-500/5 text-blue-400 border-blue-500/20",
      content: (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/40 border border-slate-805 rounded-xl">
              <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">// THE PROBLEM & MARKET ARBITRAGE</h5>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold uppercase">
                Traditional alternatives require excessive manual intervention, suffer from administrative delays, and introduce high barrier-to-entry upfront pricing models.
              </p>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-805 rounded-xl">
              <h5 className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-2">// OUR CAPABILITY RESPONSE</h5>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold uppercase">
                {finalInvestorData.onePageSummary}
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Market Size & Opportunity",
      subtitle: "TAM, SAM, and SOM audience segmentation",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-green-500/5 text-emerald-400 border-emerald-500/20",
      content: (
        <div className="space-y-4 pt-2 h-full flex flex-col justify-center">
          <div className="p-4 bg-gradient-to-r from-emerald-950/20 to-slate-900/40 border border-emerald-500/10 rounded-2xl">
            <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-3">// MARKET SIZE ANALYSIS</p>
            <p className="text-xs text-slate-300 font-medium leading-relaxed uppercase">{finalInvestorData.marketSizeEstimate}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850">
              <span className="text-[8px] font-black text-slate-500 tracking-wider uppercase block">TAM</span>
              <span className="text-xs font-black text-slate-200 uppercase mt-0.5 block">Global Scale</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850">
              <span className="text-[8px] font-black text-indigo-400 tracking-wider uppercase block">SAM</span>
              <span className="text-xs font-black text-indigo-300 mt-0.5 block">Addressable</span>
            </div>
            <div className="p-3 bg-slate-905-60 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
              <span className="text-[8px] font-black text-emerald-400 tracking-wider uppercase block font-black">SOM</span>
              <span className="text-xs font-black text-emerald-300 mt-0.5 block">Target Core</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Revenue Model & Pricing Pools",
      subtitle: "Capital optimization & monetization systems",
      icon: DollarSign,
      color: "from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/20",
      content: (
        <div className="space-y-4 pt-1 h-full flex flex-col justify-center">
          <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-xl">
            <h5 className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-2">// FORECAST HYPOTHESIS & ARR</h5>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed uppercase">
              {finalInvestorData.revenuePotential}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/20 border border-slate-800 rounded-lg flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase">Core Pro Tier</span>
              <span className="font-mono text-emerald-400 font-bold">$29/mo</span>
            </div>
            <div className="p-3 bg-slate-900/20 border border-slate-800 rounded-lg flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase">Team Enterprise</span>
              <span className="font-mono text-indigo-400 font-bold">Custom Contract</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Durable Competitive Advantages",
      subtitle: "Unlocking unique defensibility & technical moat",
      icon: Sparkles,
      color: "from-cyan-500/20 to-indigo-500/5 text-cyan-400 border-cyan-500/20",
      content: (
        <div className="space-y-4 pt-2">
          <div className="p-5 bg-gradient-to-tr from-[#050508]/80 to-indigo-950/20 border border-slate-800 rounded-2xl">
            <h5 className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-2">// THE COMPETITIVE OUTPOST MOAT</h5>
            <p className="text-xs text-slate-200 leading-relaxed font-bold uppercase">
              {finalInvestorData.competitiveAdvantage}
            </p>
          </div>
          <div className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider">
            Compared directly to slow manual corporations and complex unpolished developer code tools.
          </div>
        </div>
      )
    },
    {
      title: "Funding Readiness Assessment",
      subtitle: "Strict institutional index scoring",
      icon: CheckCircle2,
      color: "from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/20",
      content: (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">READINESS RATINGS</span>
              <p className="text-xs text-slate-300 font-bold leading-relaxed uppercase">{finalInvestorData.fundingReadinessReasoning}</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 flex items-center justify-center bg-indigo-505/10 shrink-0">
              <div className="text-center">
                <span className="text-lg font-black text-indigo-400 tracking-tighter leading-none">{finalInvestorData.fundingReadinessScore}</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase block leading-none mt-0.5">SCORE</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Investor Risks & Mitigations",
      subtitle: "Managing critical operational & adoption concerns",
      icon: ShieldAlert,
      color: "from-rose-500/20 to-orange-500/5 text-rose-450 border-rose-500/20",
      content: (
        <div className="space-y-3 pt-2">
          <div className="space-y-2 max-h-[170px] overflow-y-auto custom-scrollbar">
            {finalInvestorData.investorConcerns.map((ic, i) => (
              <div key={i} className="p-3 bg-slate-900/30 border border-rose-500/10 rounded-xl space-y-1">
                <div className="text-[10px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                  Concern: {ic.concern}
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase pl-2.5">
                  Counter-mitigation: <span className="text-slate-200 font-semibold">{ic.mitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "VC Investment Memorandum",
      subtitle: "Autonomous executive purchase verdict",
      icon: Briefcase,
      color: "from-teal-500/20 to-emerald-500/5 text-teal-400 border-teal-500/20",
      content: (
        <div className="space-y-4 pt-2 text-center h-full flex flex-col justify-center">
          <div className="p-5 bg-gradient-to-r from-[#030712] to-slate-900 border border-emerald-505/20 rounded-2xl relative">
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/20 text-[8px] text-emerald-400 font-black uppercase tracking-widest leading-none">
              VERDICT: ISSUED
            </div>
            <p className="text-sm text-emerald-300 font-black tracking-tight uppercase leading-relaxed max-w-lg mx-auto">
              "{finalInvestorData.investmentRecommendation}"
            </p>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black font-mono">
            // AUTHORIZED BY: MISSION OS INVESTMENT SYNDICATE
          </p>
        </div>
      )
    }
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div id="investor-mode-container" className="max-w-6xl mx-auto space-y-6 pb-24">
      
      {/* Target selector and Screen Headers */}
      <section className="bg-gradient-to-r from-slate-900/60 to-[#0d0d12]/60 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            FINANCIAL PRE-RAISE PORTAL
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-100">Investor Mode Dashboard</h2>
          <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider leading-none">Evaluate pre-compliance scores and auto-generate pitch briefs</p>
        </div>

        {/* Mission Switcher dropdown selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest mb-1.5">// TARGET ROADMAP CONTEXT</span>
            <select
              value={selectedMissionId}
              onChange={(e) => {
                setSelectedMissionId(e.target.value);
                setActiveSlide(0);
              }}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-tight outline-none focus:border-indigo-550 w-full sm:w-[260px]"
            >
              <option value="demo">PROTOTYPE: Cryptographic Trust (Judge Demo)</option>
              {missionsList.map((m) => (
                <option key={m.id} value={m.id}>
                  LAUNCHED: {m.goal.substring(0, 36)}...
                </option>
              ))}
            </select>
          </div>

          <div className="flex bg-[#050508] border border-slate-850 p-1 rounded-xl mt-auto">
            <button
              onClick={() => setViewMode("report")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                viewMode === "report" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              Corporate Report
            </button>
            <button
              onClick={() => setViewMode("deck")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                viewMode === "deck" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Layout className="w-3.5 h-3.5" />
              Pitch Slides
            </button>
          </div>
        </div>
      </section>

      {/* RENDER VIEW SCREEN */}
      <AnimatePresence mode="wait">
        
        {/* 1. COMPREHENSIVE EXECUTIVE INVESTOR REPORT */}
        {viewMode === "report" && (
          <motion.div
            key="investor-report"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Download/Print Action Header */}
            <div className="flex justify-between items-center bg-slate-900/10 border border-slate-800/80 px-5 py-3 rounded-xl">
              <span className="text-[10px] font-mono font-black tracking-widest uppercase text-slate-500">
                REPORT SEQUENCE: SECURE DECLASSIFIED MEMO
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyClipboard}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase py-1.5 px-3 rounded-lg border transition-all ${
                    copied 
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                      : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700"
                  }`}
                >
                  <CircleCheck className={`w-3.5 h-3.5 ${copied ? "text-emerald-400 animate-pulse" : "text-indigo-400"}`} />
                  {copied ? "Copied ✓" : "Copy Memo"}
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase py-1.5 px-3"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-400" />
                  Print / Export PDF
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="btn-primary flex items-center gap-2 text-[10px] font-black uppercase py-1.5 px-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export .MD File
                </button>
              </div>
            </div>

            {/* PRINT-OPTIMIZED DUAL COMPONENT VIEWPORT wrapper */}
            <div id="printable-investor-area" className="grid grid-cols-12 gap-5 text-slate-300">
              
              {/* Box 1: Large Elevator Pitch Hook (Primary Display) */}
              <div className="col-span-12 md:col-span-8 bg-gradient-to-tr from-slate-950 via-slate-950 to-indigo-950/20 border border-slate-800/90 rounded-2xl p-6 min-h-[170px] flex flex-col justify-center relative">
                <div className="absolute top-4 left-4 text-[9px] font-mono font-black uppercase text-indigo-400 tracking-wider">
                  I. Elevator Pitch / Strategic Core Hook
                </div>
                <div className="absolute top-4 right-4 text-slate-700 pointer-events-none">
                  <Award className="w-10 h-10 opacity-15" />
                </div>
                <p className="text-sm md:text-base text-slate-200 tracking-normal font-black uppercase leading-relaxed text-left border-l-2 border-indigo-500/40 pl-4 py-1 mt-4 italic">
                  "{finalInvestorData.elevatorPitch}"
                </p>
              </div>

              {/* Box 2: Funding Readiness score & progress gauge representation */}
              <div className="col-span-12 md:col-span-4 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-[170px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono font-black uppercase text-slate-500 tracking-wider leading-none">II. Funding Readiness</span>
                    <h4 className="text-[10px] text-slate-300 font-bold uppercase tracking-tight mt-1">Capital Raised Potential</h4>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] font-black tracking-wider leading-none">
                    GRADE A
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between font-mono mb-1.5">
                    <span className="text-3xl font-black text-indigo-400 tracking-tight">{finalInvestorData.fundingReadinessScore}<span className="text-xs opacity-50">%</span></span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Readiness Score</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000" style={{ width: `${finalInvestorData.fundingReadinessScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Box 3: One Page Summary block */}
              <div className="col-span-12 md:col-span-8 bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-6 relative">
                <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-slate-500 mb-4 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  III. Executive One-Page Startup Summary
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed uppercase">
                  {finalInvestorData.onePageSummary}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
                  <div>
                    <span className="text-[8px] font-mono uppercase text-slate-500 font-black block">Operational Model</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-tight block mt-1">Autonomous consensus verification, cutting down traditional scoping cycles by 98%.</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase text-indigo-400 font-black block">Validation Target</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-tight block mt-1">Acquire 100 high-advocate design team accounts inside localized sandbox launch limits.</span>
                  </div>
                </div>
              </div>

              {/* Box 4: Defensible moat / Competitive advantage */}
              <div className="col-span-12 md:col-span-4 bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-slate-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    IV. Defensible Competitive Advantage
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase">
                    {finalInvestorData.competitiveAdvantage}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-emerald-400 font-black tracking-wider uppercase">
                  <span>MOAT SCORE: COMPILING WINNER STATUS</span>
                  <Percent className="w-3 h-3" />
                </div>
              </div>

              {/* Box 5: Market Size Estimations (TAM SAM SOM) detail */}
              <div className="col-span-12 md:col-span-6 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  V. Market Size Estimate (Audience Segmentation)
                </h3>
                <div className="p-4 bg-[#0d0d12]/90 border border-slate-900 rounded-xl">
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed uppercase leading-relaxed">
                    {finalInvestorData.marketSizeEstimate}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 text-center">
                    <span className="text-[8px] font-black text-slate-500 tracking-wider uppercase block">Worldwide TAM</span>
                    <span className="text-[11px] font-black text-slate-200 uppercase mt-1 block">GLOBAL SECTOR</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 text-center">
                    <span className="text-[8px] font-black text-indigo-400 tracking-wider uppercase block">Addressable SAM</span>
                    <span className="text-[11px] font-black text-indigo-400 uppercase mt-1 block">SaaS SCALING</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-center">
                    <span className="text-[8px] font-black text-emerald-400 tracking-wider uppercase block font-black">Target SOM</span>
                    <span className="text-[11px] font-black text-emerald-400 uppercase mt-1 block">CORE ACCOUNTS</span>
                  </div>
                </div>
              </div>

              {/* Box 6: Financial potential and revenue expectations */}
              <div className="col-span-12 md:col-span-6 bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-400" />
                  VI. Revenue Potential & Pricing Framework
                </h3>
                <div className="p-4 bg-[#0d0d12]/90 border border-slate-900 rounded-xl">
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed uppercase">
                    {finalInvestorData.revenuePotential}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs uppercase font-bold text-slate-400">
                  <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                    <span>Year 1 ARR target</span>
                    <span className="font-mono text-emerald-400 font-bold">$1.2M Run Rate</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                    <span>operating overhead</span>
                    <span className="font-mono text-indigo-400 font-bold">&lt; 5% margins</span>
                  </div>
                </div>
              </div>

              {/* Box 7: Critic Investor concerns & Mitigations table/grid representation */}
              <div className="col-span-12 md:col-span-8 bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-6 relative">
                <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-slate-500 mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  VII. Key Investor Concerns & Tactical Counter-Mitigative Measures
                </h3>
                <div className="space-y-4">
                  {finalInvestorData.investorConcerns.map((ic, i) => (
                    <div key={i} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-900/90 space-y-2">
                      <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-rose-500 shrink-0"></span>
                        CONCERN #{i+1}: {ic.concern}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase pl-4 border-l border-slate-800">
                        Mitigative Answer: <span className="text-slate-205 font-medium">{ic.mitigation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 8: Absolute final VC Memo investment recommendation & Signature */}
              <div className="col-span-12 md:col-span-4 bg-gradient-to-tr from-slate-950 to-emerald-950/10 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                  <Scale className="w-32 h-32 text-emerald-500" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    VIII. Multi-Agent Advisory Board recommendation
                  </h3>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                    <span className="text-[8px] font-black uppercase text-emerald-400 tracking-wider block mb-1">DECISION MEMO STATUS</span>
                    <p className="text-xs md:text-sm text-emerald-300 font-extrabold tracking-tight uppercase leading-relaxed">
                      "{finalInvestorData.investmentRecommendation}"
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Consensus Board Signed</span>
                    <span className="text-[9px] text-slate-300 uppercase font-black tracking-widest block mt-0.5">MISSION_CONTROL_OS // ADVISOR</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-black">
                    ✓
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* 2. PITCH DECK SUMMARY PRESENTATION SCREEN CARD */}
        {viewMode === "deck" && (
          <motion.div
            key="pitch-deck"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Quick Carousel wrapper */}
            <div className="flex justify-between items-center bg-slate-900/10 border border-slate-800/80 px-5 py-3 rounded-xl">
              <span className="text-[10px] font-mono font-black tracking-widest uppercase text-slate-500">
                ACTIVE PRESENTATION SEQUENCE: {activeSlide + 1} OF {slides.length} SLIDES
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevSlide}
                  className="btn-ghost p-1.5 h-9 w-9 flex items-center justify-center rounded-lg border border-slate-800"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-350" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="btn-ghost p-1.5 h-9 w-9 flex items-center justify-center rounded-lg border border-slate-800"
                >
                  <ChevronRight className="w-4 h-4 text-slate-350" />
                </button>
              </div>
            </div>

            {/* Slide showcase view */}
            <div className="bg-[#040406] border border-slate-800/85 rounded-3xl p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
              {/* Mesh or grid aesthetic backdrops */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>
              
              {/* Slide Heading */}
              <div className="flex justify-between items-start border-b border-slate-900 pb-4 relative z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", slides[activeSlide].color.split(" ")[0] + "/20 font-black text-sm")}>
                    {React.createElement(slides[activeSlide].icon, { className: "w-4 h-4" })}
                  </div>
                  <div>
                    <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-widest block font-black leading-none">SLIDE {activeSlide + 1} // STRUCTURAL EXECUTION</span>
                    <h3 className="text-base font-black uppercase text-slate-100 tracking-wider block mt-1 leading-tight">{slides[activeSlide].title}</h3>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                  {slides[activeSlide].subtitle}
                </div>
              </div>

              {/* Slide Body display space */}
              <div className="flex-1 flex flex-col justify-center py-6 relative z-10">
                {slides[activeSlide].content}
              </div>

              {/* Slide Foot Controls */}
              <div className="border-t border-slate-900/60 pt-4 flex items-center justify-between shrink-0 relative z-10">
                <div className="flex gap-1">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={cn(
                        "h-1.5 min-w-[20px] rounded-full transition-all duration-300",
                        idx === activeSlide ? "bg-indigo-600 w-8" : "bg-slate-800 hover:bg-slate-750"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSlide}
                  className="text-xs font-black uppercase text-indigo-400 flex items-center gap-2 group cursor-pointer"
                >
                  {activeSlide === slides.length - 1 ? "RELOAD DECK" : "ADVANCE SLIDE"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Quick full deck grid panel for high scannability */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-[0.2em] block">// OVERVIEW DECK LAYOUTS</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slides.map((sl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={cn(
                      "p-4 bg-slate-900/30 border rounded-xl cursor-pointer hover:border-slate-700 transition-all text-left flex flex-col justify-between h-[95px]",
                      idx === activeSlide ? "border-indigo-600 bg-indigo-500/5" : "border-slate-800"
                    )}
                  >
                    <div>
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">SLIDE 0{idx+1}</span>
                      <h5 className={cn("text-[10px] font-black uppercase tracking-tight mt-1 line-clamp-1", idx === activeSlide ? "text-indigo-400" : "text-slate-350")}>
                        {sl.title}
                      </h5>
                    </div>
                    <div className="text-[8px] text-slate-500 uppercase font-black font-mono tracking-widest">{sl.subtitle.substring(0, 24)}...</div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS @media print styling overlay to perfectly format exports */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #111827 !important;
          }
          #investor-mode-container header, 
          #investor-mode-container button,
          #investor-mode-container select,
          #investor-mode-container footer,
          aside,
          header,
          #floating-copilot-root,
          .btn-ghost,
          .btn-primary {
            display: none !important;
          }
          #printable-investor-area {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #ffffff !important;
            color: #111827 !important;
          }
          #printable-investor-area > div {
            background: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            color: #111827 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin-bottom: 1.5rem !important;
            padding: 24px !important;
            border-radius: 12px !important;
          }
          #printable-investor-area p,
          #printable-investor-area span,
          #printable-investor-area h3,
          #printable-investor-area h4 {
            color: #111827 !important;
          }
          #printable-investor-area .text-slate-500,
          #printable-investor-area .text-slate-450,
          #printable-investor-area .text-slate-400 {
            color: #4b5563 !important;
          }
          #printable-investor-area .text-indigo-400,
          #printable-investor-area .text-emerald-400 {
            color: #111827 !important;
            font-weight: 900 !important;
          }
        }
      `}</style>

    </div>
  );
}
