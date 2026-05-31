import React from "react";
import { motion } from "motion/react";
import { 
  ShoppingBag, 
  Cpu, 
  Workflow, 
  Users, 
  Globe, 
  Building2, 
  ArrowUpRight, 
  Flame, 
  Clock, 
  CheckCircle2,
  Hourglass
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROADMAP_ITEMS = [
  {
    title: "Multi-Agent Marketplace",
    status: "Planning",
    statusColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    desc: "A public repository where developers can publish and list customized domain-expert agents (e.g. specialized Legal advisors, SEO masters, Tax auditors). Founders can hot-swap agents inside execution loops with 1 click.",
    icon: ShoppingBag,
    timeline: "Q3 2026",
    priority: "High",
    complexity: "Medium"
  },
  {
    title: "Autonomous Goal Execution",
    status: "In Development",
    statusColor: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20 animate-pulse",
    desc: "Fully autonomous loop completion. Not just drafting plans, but executing tasks directly: deploying web splash-pages, creating GitHub repositories, generating real marketing graphics, and verifying API response metrics on-the-fly.",
    icon: Cpu,
    timeline: "Q4 2026",
    priority: "Critical",
    complexity: "High"
  },
  {
    title: "MCP Integrations",
    status: "Under Design",
    statusColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    desc: "Model Context Protocol connections. Empower agents to read and search local directories, plug into external enterprise systems (GitHub, Jira, databases), and leverage secure local computational context effortlessly.",
    icon: Workflow,
    timeline: "Q1 2027",
    priority: "High",
    complexity: "Medium"
  },
  {
    title: "Team Collaboration Channels",
    status: "Spec Drafted",
    statusColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    desc: "Multi-founder boards where team members can up-vote agent paths, leave comments directly on 7-day checklists, assign specific nodes to human team developers, and schedule automated reports straight to Slack.",
    icon: Users,
    timeline: "Q2 2027",
    priority: "Medium",
    complexity: "Low"
  },
  {
    title: "API Marketplace Access",
    status: "Planning",
    statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    desc: "Connect Mission Control's synthesis engine directly to external application wrappers. Fetch verified market criteria and regulatory consensus scores via customized OAuth scopes to automate enterprise reports.",
    icon: Globe,
    timeline: "Q3 2027",
    priority: "High",
    complexity: "High"
  },
  {
    title: "Enterprise Version Dashboard",
    status: "Under Design",
    statusColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    desc: "Deploy Mission Control AI inside a secure local cloud environment behind private VPNs. Support for custom large models, strict local storage rules, complete single sign-on security, and dedicated agent GPU resource pools.",
    icon: Building2,
    timeline: "Q4 2027",
    priority: "Critical",
    complexity: "High"
  }
];

export default function FutureRoadmap() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-indigo-950/10 to-slate-900/40 rounded-2xl border border-indigo-500/10 p-8 relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Workflow className="w-64 h-64 text-indigo-500" />
        </div>
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Autonomous OS Horizons</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
            Our Vision: The Next-Gen <span className="text-indigo-400 italic">Founder Operating System</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-lg">
            We are elevating Mission Control from a strategic planning consultant to a fully closed-loop autonomous multi-agent operating registry. Direct execution coordinates are arriving soon.
          </p>
        </div>
      </section>

      {/* Grid Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ROADMAP_ITEMS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="flex flex-col justify-between p-6 bg-[#0d0d12]/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all group overflow-hidden relative h-[280px]"
          >
            {/* Background Accent glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className={cn("text-[9px] font-mono uppercase px-2.5 py-1 rounded border", item.statusColor)}>
                  {item.status}
                </span>
              </div>

              <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                {item.title}
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </h3>

              <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight line-clamp-4">
                {item.desc}
              </p>
            </div>

            {/* Bottom Status Panel */}
            <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono uppercase font-semibold text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>Target: {item.timeline}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span>Priority: {item.priority}</span>
              </div>
            </div>

          </motion.div>
        ))}
      </section>

      {/* Suggestion block */}
      <section className="bg-[#050508]/40 border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">Do You Need Custom Multi-Agent Workflows?</h4>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight max-w-lg mx-auto">
          We build Custom Enterprise agent parameters matching secure corporate data-stores. Reach out through our Hackathon showcase interface to establish trial access today.
        </p>
      </section>

    </div>
  );
}
