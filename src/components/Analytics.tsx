import { motion } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, Cpu, Zap, Target } from "lucide-react";

const DATA = [
  { name: 'Mon', missions: 4, tokens: 2400, cost: 0.24 },
  { name: 'Tue', missions: 3, tokens: 1398, cost: 0.14 },
  { name: 'Wed', missions: 7, tokens: 9800, cost: 0.98 },
  { name: 'Thu', missions: 5, tokens: 3908, cost: 0.39 },
  { name: 'Fri', missions: 8, tokens: 4800, cost: 0.48 },
  { name: 'Sat', missions: 6, tokens: 3800, cost: 0.38 },
  { name: 'Sun', missions: 10, tokens: 4300, cost: 0.43 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

const AGENT_DISTRIBUTION = [
  { name: 'Research', value: 35 },
  { name: 'Coding', value: 25 },
  { name: 'Marketing', value: 15 },
  { name: 'Product', value: 15 },
  { name: 'Others', value: 10 },
];

export default function Analytics() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="grid grid-cols-12 gap-4">
        {[
          { label: 'Total Missions', value: '142', icon: Target, color: 'text-indigo-400' },
          { label: 'Avg Tokens/Goal', value: '3.2k', icon: Cpu, color: 'text-purple-400' },
          { label: 'Success Rate', value: '98.4%', icon: Zap, color: 'text-emerald-400' },
          { label: 'System Uptime', value: '99.9h', icon: Activity, color: 'text-rose-400' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="col-span-12 md:col-span-3 bento-card p-6 border-slate-800"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] text-slate-500 font-black font-mono">LIVE_STAT</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black font-mono tracking-tighter">{stat.value}</span>
              <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}

        <div className="col-span-12 lg:col-span-8 bento-card h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Mission Throughput</h3>
            <span className="text-[10px] font-mono text-indigo-400">7 DAY WINDOW</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d12', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="tokens" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bento-card h-[400px] flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Workload Dist</h3>
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={AGENT_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {AGENT_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0d12', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AGENT_DISTRIBUTION.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-slate-400 font-black uppercase truncate">{entry.name}</span>
                  <span className="text-[10px] text-slate-200 ml-auto font-mono font-bold">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
