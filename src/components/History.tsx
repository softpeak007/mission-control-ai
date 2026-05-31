import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Calendar, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { Mission, MissionStatus, AgentRole } from "@/types";
import { cn } from "@/lib/utils";

const SEED_HISTORY: Mission[] = [
  {
    id: "spacex-swot",
    goal: "Perform an autonomous SWOT and market placement analysis for SpaceX Starlink Enterprise",
    status: MissionStatus.COMPLETED,
    startTime: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 1200 * 1000).toISOString(),
    agents: [
      { id: "a1", role: AgentRole.RESEARCH, status: "completed", description: "Market sector auditing" },
      { id: "a2", role: AgentRole.PRODUCT, status: "completed", description: "Feature mapping" },
      { id: "a3", role: AgentRole.STRATEGY, status: "completed", description: "Action roadmapping" }
    ],
    logs: [
      { id: "l1", timestamp: new Date().toISOString(), agentId: "orchestrator", agentRole: AgentRole.ORCHESTRATOR, message: "Mission initialized.", type: "info" }
    ],
    metrics: { tokensUsed: 4210, costEstimate: 0.012, duration: 15 },
    executiveSummary: "Detailed strategic synthesis of Starlink Enterprise positioning in underserved global industrial sectors. SpaceX capitalizes on a high-density, low-latency satellite constellation, capturing market margins from rural backhauls, ocean navigation channels, and defense agency grids.",
    findings: {
      "Research": "Starlink possesses zero direct low-Earth-orbit altitude scale competitors with mature global launch pipelines. Traditional geostationary operators cannot compete on latency (20ms vs 600ms) or price-per-gigabyte thresholds.",
      "Product": "Recommended localized standard container-unit transceivers suited for immediate heavy industrial off-grid deployments with 10-minute setup times.",
      "Strategy": "Enforce a dual-tier framework: variable consumption usage parameters for shipping lines, paired with flat-fee licensing contracts for government entities."
    },
    sevenDayPlan: [
      { day: "Day 1: Market Targeting", task: "Isolate enterprise shipping vectors and secure initial maritime waitlist profiles." },
      { day: "Day 2: Transceiver Tuning", task: "Configure optimized software definitions on baseline terminal models." },
      { day: "Day 3: Pipeline Integration", task: "Align communication pathways with established industrial IoT sensors." },
      { day: "Day 4: Regulatory Checkup", task: "Inspect territory frequency compliance certificates with the FCC." },
      { day: "Day 5: Enterprise Portal Launch", task: "Inaugurate private client portals for bandwidth allocation commands." },
      { day: "Day 6: Redundancy Audit", task: "Synthesize Critic failguard parameters to address high-latitude drop zones." },
      { day: "Day 7: Live Service Activation", task: "Launch commercial trial activations across the first 100 maritime hubs." }
    ],
    riskChecklist: [
      { risk: "Local Frequency Jamming", mitigation: "Deploy dynamic beamforming arrays across multiple signal bands." }
    ],
    monetization: [
      "Enterprise Subscription tier: $2500/month per terminal granting unlimited low-latency bandwidth.",
      "Industrial Pay-per-GB plans designed for rural agricultural backup."
    ],
    nextSteps: [
      "Review the FCC regulatory parameter sheets.",
      "Deploy maritime alpha kits on partner ships."
    ]
  },
  {
    id: "web-scraper-python",
    goal: "Create a resilient Python scraping workflow with proxy rotation and anti-bot bypass selectors",
    status: MissionStatus.COMPLETED,
    startTime: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 5 * 24 * 3600 * 1000 + 400 * 1000).toISOString(),
    agents: [
      { id: "b1", role: AgentRole.CODING, status: "completed", description: "Architecture coding" },
      { id: "b2", role: AgentRole.QA, status: "completed", description: "Scraper auditing" }
    ],
    logs: [
      { id: "l1", timestamp: new Date().toISOString(), agentId: "orchestrator", agentRole: AgentRole.ORCHESTRATOR, message: "Mission initialized.", type: "info" }
    ],
    metrics: { tokensUsed: 2510, costEstimate: 0.007, duration: 8 },
    executiveSummary: "Resilient high-concurrency scraping engine architecture built on Python. Features modular rotative proxy buffers, dynamic sleep intervals modeled on human patterns, and automated CAPTCHA triggers to scrape retail listing sites securely.",
    findings: {
      "Coding": "Implemented Asyncio/Aiohttp loops to run up to 50 concurrent requests. Used BeautifulSoup matched with Regex bypass structures.",
      "QA": "Confirmed 99.4% parsing accuracy across 10,000 requests. Integrated structured JSON validations to capture missing page tags automatically."
    },
    sevenDayPlan: [
      { day: "Day 1: Pipeline Setup", task: "Construct python boilerplate and integrate aiohttp queues." },
      { day: "Day 2: Selector Scopes", task: "Map nested CSS lookups and verify tags on different sandbox targets." },
      { day: "Day 3: Proxy Buffer Routing", task: "Configure proxy rotation hooks utilizing dynamic API keys." },
      { day: "Day 4: Human Signature Tuning", task: "Inject custom browser user-agent pools and randomize scroll delays." },
      { day: "Day 5: Error Isolation", task: "Enforce exponential backoff retries for timeout responses." },
      { day: "Day 6: DB Store Schema", task: "Setup SQLite transaction channels and build schema export routines." },
      { day: "Day 7: Pipeline Production", task: "Wrap script inside container files and schedule daily CRON execution." }
    ],
    riskChecklist: [
      { risk: "Target IP Block lists", mitigation: "Enforce strict rotating proxy keys and set maximum request rates." }
    ],
    monetization: [
      "SaaS scraper credits API: Tiered plans suited for high-volume enterprise commands.",
      "One-time bespoke dataset deliveries in JSON/CSV formats."
    ],
    nextSteps: [
      "Compile test scraping scenarios against standard endpoints.",
      "Integrate rotation patterns in python packages."
    ]
  }
];

interface HistoryProps {
  onSelectMission: (mission: Mission) => void;
}

export default function History({ onSelectMission }: HistoryProps) {
  const [search, setSearch] = useState("");
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    // Read user missions
    const rawUserMissions = localStorage.getItem("user_missions");
    let userList: Mission[] = [];
    if (rawUserMissions) {
      try {
        userList = JSON.parse(rawUserMissions);
      } catch (e) {
        console.error("Failed to parse user missions history");
      }
    }

    if (userList.length === 0) {
      // Seed default history
      localStorage.setItem("user_missions", JSON.stringify(SEED_HISTORY));
      setMissions(SEED_HISTORY);
    } else {
      // Combine user missions and seed info (making sure no id overrides)
      const combined = [...userList];
      SEED_HISTORY.forEach(item => {
        if (!combined.some(m => m.id === item.id)) {
          combined.push(item);
        }
      });
      setMissions(combined);
    }
  }, []);

  const filteredMissions = missions.filter(m => 
    m.goal.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Mission Archives</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Intel..." 
            className="bg-transparent border-0 text-[10px] font-bold uppercase tracking-widest focus:ring-0 outline-none w-48 placeholder:text-slate-700 text-slate-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredMissions.map((mission, i) => {
          const dateStr = mission.startTime 
            ? new Date(mission.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
            : "Sample Date";
          const durationText = mission.metrics?.duration 
            ? `${mission.metrics.duration}m` 
            : "10m";

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectMission(mission)}
              className="bento-card p-4 hover:border-indigo-500/30 cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                  mission.status === MissionStatus.COMPLETED ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                )}>
                  {mission.status === MissionStatus.COMPLETED ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {mission.goal}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
                      <Clock className="w-3 h-3" />
                      {durationText}
                    </div>
                    {mission.executiveSummary && (
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-black uppercase tracking-widest">
                        REPORT_LOCKED
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-slate-600 transition-colors" />
              </div>
            </motion.div>
          );
        })}

        {filteredMissions.length === 0 && (
          <div className="text-center py-12 p-6 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">No archival items found.</p>
          </div>
        )}
      </div>
      
      <div className="text-center py-10 opacity-40">
        <button 
          onClick={() => {
            localStorage.removeItem("user_missions");
            window.location.reload();
          }}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-400 transition-colors"
        >
          // Clear cache & Restore defaults
        </button>
      </div>
    </div>
  );
}
