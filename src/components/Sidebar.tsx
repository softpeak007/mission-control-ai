import { motion } from "motion/react";
import { 
  Plus, 
  Settings, 
  History, 
  BarChart3, 
  Activity,
  Cpu,
  Zap,
  Award,
  Sparkles,
  Compass,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLaunchJudgeDemo?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLaunchJudgeDemo }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'missions', label: 'Active Missions', icon: Zap },
    { id: 'copilot', label: 'Founder Copilot', icon: Sparkles },
    { id: 'roadmap', label: 'Future Roadmap', icon: Compass },
    { id: 'history', label: 'Execution Logs', icon: History },
    { id: 'analytics', label: 'System Intel', icon: BarChart3 },
    { id: 'investor', label: 'Investor Mode', icon: Briefcase },
    { id: 'pitch', label: 'Hackathon Pitch', icon: Award },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0d0d12]/30 backdrop-blur-md flex flex-col p-4 shrink-0 h-full relative z-30">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Navigation</div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4 transition-transform group-hover:scale-110",
              activeTab === item.id ? "text-indigo-400" : "text-slate-500"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {onLaunchJudgeDemo && (
          <button
            type="button"
            onClick={onLaunchJudgeDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-lg text-white shadow-lg shadow-indigo-950/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-white/5 animate-pulse"
          >
            <Zap className="w-3.5 h-3.5 fill-white stroke-none" />
            Launch Judge Demo
          </button>
        )}

        <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
           <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase">System Load</span>
             <span className="text-[10px] font-mono font-bold text-indigo-400">42% CPU</span>
           </div>
           <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "42%" }}
               className="h-full bg-indigo-500"
             />
           </div>
        </div>

        <div className="px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
               <Plus className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase">Pro Access</p>
              <p className="text-[10px] text-slate-500 uppercase">Unlimited Tokens</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
