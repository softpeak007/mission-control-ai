import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Bot, 
  HelpCircle, 
  Command, 
  Send, 
  Lightbulb, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  Trash2,
  Bookmark
} from "lucide-react";
import { Mission } from "@/types";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: Date;
}

export default function FounderCopilot() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const cached = localStorage.getItem("copilot_chat_history");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any) => ({
            ...m,
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "welcome",
        sender: "copilot",
        text: "Greetings, founder. I am your strategic memory layer and executive cooperator. I reside directly on your command loop, analyzing your agent outputs to clear tactical uncertainty. What is on your docket today?",
        timestamp: new Date()
      }
    ];
  });
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [missionsList, setMissionsList] = useState<Mission[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string>("active");

  // Load history to supply smart context
  useEffect(() => {
    const cached = localStorage.getItem("user_missions");
    if (cached) {
      try {
        const list = JSON.parse(cached);
        setMissionsList(list);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync state between floating chat panel and full tab in real-time
  useEffect(() => {
    const handleSyncChange = () => {
      const cached = localStorage.getItem("copilot_chat_history");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setMessages(parsed.map((m: any) => ({
              ...m,
              timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
            })));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("copilot_sync", handleSyncChange);
    return () => {
      window.removeEventListener("copilot_sync", handleSyncChange);
    };
  }, []);

  const saveAndPublishMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem("copilot_chat_history", JSON.stringify(newMsgs));
    window.dispatchEvent(new Event("copilot_sync"));
  };

  const getActiveContextGoal = () => {
    if (selectedMissionId === "active") {
      return missionsList[0]?.goal || "Building a high-tempo startup MVP";
    }
    const target = missionsList.find(m => m.id === selectedMissionId);
    return target?.goal || "Building a high-tempo startup MVP";
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    const updatedWithUser = [...messages, userMsg];
    saveAndPublishMessages(updatedWithUser);
    setInputText("");
    setIsThinking(true);

    const goalContext = getActiveContextGoal();
    const activeMissionObj = selectedMissionId === "active" ? missionsList[0] : missionsList.find(m => m.id === selectedMissionId);
    const otherMissions = missionsList.filter(m => m.id !== activeMissionObj?.id);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          goalContext,
          currentMission: activeMissionObj || null,
          previousMissions: otherMissions
        })
      });

      if (!response.ok) throw new Error("Advisor system offline.");

      const result = await response.json();
      
      saveAndPublishMessages([
        ...updatedWithUser,
        {
          id: `msg-${Date.now()}`,
          sender: "copilot",
          text: result.answer,
          timestamp: new Date()
        }
      ]);
    } catch (e) {
      // Robust realistic response fallback
      setTimeout(() => {
        let answer = "Priority #1:\nDefine exactly 1 superpower service and validate it with a simple landing page waitlist.\n\nPriority #2:\nInterview early interested signups to determine pricing expectations and urgency.\n\nPriority #3:\nKeep development cycles under 7 days to remain nimble and conserve resources.";
        const lowercaseText = textToSend.toLowerCase();

        if (lowercaseText.includes("next")) {
          answer = `Priority #1:\nInterview 10 target users in the next 48 hours to refine pain points.\n\nPriority #2:\nDeploy a single-page waitlist landing page detailing your unique value proposition for "${goalContext}".\n\nPriority #3:\nSet up client-side link events to measure user interest through click-rate conversion.`;
        } else if (lowercaseText.includes("risk")) {
          answer = `Priority #1:\nOver-engineering: Spending 4+ weeks coding complex backends for "${goalContext}" before validating single-serving value.\n\nPriority #2:\nApathy: Launching into high-noise general channels rather than specialized community platforms.\n\nPriority #3:\nCompliance: Forgetting simple target terms of use and private data constraints.`;
        } else if (lowercaseText.includes("prioritize") || lowercaseText.includes("today")) {
          answer = `Priority #1:\nDraft your compelling 1-sentence elevator pitch for "${goalContext}" and share it with 5 target candidates.\n\nPriority #2:\nIdentify the single high-impact acquisition channel (e.g., specialized Discord/Reddit) for beta sign-ups.\n\nPriority #3:\nConfigure a basic subscription waitlist and measure sign-up conversion rate.`;
        } else if (lowercaseText.includes("customer")) {
          answer = `Priority #1:\nPublish curated value posts in developer directories or topic-related subreddits to attract your initial 50 beta members.\n\nPriority #2:\nReach out directly via personalized messages to 30 founders who face the exact problem "${goalContext}" solves.\n\nPriority #3:\nEngage waitlisted sign-ups with a warm, personal introductory email asking about their current hurdles.`;
        } else if (lowercaseText.includes("validate")) {
          answer = `Priority #1:\nConstruct a basic visual interactive card or mock demo video showing core workflows for "${goalContext}".\n\nPriority #2:\nMeasure exact user activation rate by gating access behind an email input form.\n\nPriority #3:\nRequire early waitlist participants to share or verify interest ratio through a short 2-question intake questionnaire.`;
        }

        saveAndPublishMessages([
          ...updatedWithUser,
          {
            id: `msg-${Date.now()}`,
            sender: "copilot",
            text: answer,
            timestamp: new Date()
          }
        ]);
      }, 1000);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearHistory = () => {
    saveAndPublishMessages([
      {
        id: "welcome",
        sender: "copilot",
        text: "Command loop cleared. Strategic memory layer remains active. What business goals are we executing next?",
        timestamp: new Date()
      }
    ]);
  };

  const presetQuestions = [
    { text: "What should I do next?", icon: Lightbulb, color: "text-amber-400 bg-amber-400/10" },
    { text: "What is my biggest risk?", icon: ShieldAlert, color: "text-rose-400 bg-rose-400/10" },
    { text: "What should I prioritize today?", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10" },
    { text: "How do I get first customers?", icon: User, color: "text-blue-400 bg-blue-400/10" },
    { text: "How do I validate this idea?", icon: Sparkles, color: "text-purple-400 bg-purple-400/10" }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] grid grid-cols-12 gap-4">
      
      {/* Dynamic Context Selector sidebar */}
      <section className="col-span-12 md:col-span-4 bg-[#0d0d12]/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono tracking-widest uppercase text-[10px] font-black">
            <Command className="w-3.5 h-3.5" />
            V2 Memory Context Layer
          </div>
          <div>
            <h3 className="text-xs text-slate-200 font-black uppercase">Orchestrated Missions</h3>
            <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Select which historical target memory the advisor references.</p>
          </div>

          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            <button 
              onClick={() => setSelectedMissionId("active")}
              className={cn(
                "w-full text-left p-3 rounded-xl border text-xs font-bold uppercase transition-all flex flex-col gap-1",
                selectedMissionId === "active" ? "border-indigo-500 bg-indigo-500/10 text-slate-100" : "border-slate-800 bg-[#050508]/40 text-slate-400 hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between text-[8px] tracking-wider uppercase">
                <span>Latest Session Context</span>
                {missionsList.length > 0 && <span className="text-indigo-400 font-black">Active</span>}
              </div>
              <span className="truncate block mt-1">
                {missionsList[0]?.goal || "Pragmatic Digital MVP"}
              </span>
            </button>

            {missionsList.slice(1).map((m) => (
              <button 
                key={m.id}
                onClick={() => setSelectedMissionId(m.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border text-xs font-bold uppercase transition-all flex flex-col gap-1",
                  selectedMissionId === m.id ? "border-indigo-500 bg-indigo-500/10 text-slate-100" : "border-slate-800 bg-[#050508]/40 text-slate-400 hover:border-slate-750"
                )}
              >
                <div className="text-[8px] text-slate-500 tracking-wider">
                  MISSION-{m.id.toUpperCase()}
                </div>
                <span className="truncate block">
                  {m.goal}
                </span>
              </button>
            ))}

            {missionsList.length === 0 && (
              <div className="text-[10px] font-mono font-bold text-slate-600 uppercase text-center p-6 border border-dashed border-slate-900 rounded-xl">
                No archived memories detected. Launch a command first!
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 space-y-3">
          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-850 hover:border-rose-950 hover:bg-rose-950/10 hover:text-rose-400 text-slate-400 text-[10px] font-black uppercase rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat Loop
          </button>
          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center leading-normal">
            strategic memory sync: connected
          </div>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="col-span-12 md:col-span-8 bg-[#0d0d12]/60 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden">
        
        {/* Header indicator */}
        <div className="p-4 border-b border-slate-800 bg-[#0d0d12]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-md">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-100">Advisor Consigliere</div>
              <div className="text-[8px] text-indigo-400 font-mono tracking-widest font-bold uppercase mt-0.5">
                Target Context :: {getActiveContextGoal().substring(0, 36)}...
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded border border-emerald-500/20">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Consensus Sync
          </div>
        </div>

        {/* Chat log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/20">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3 max-w-[85%] select-text",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 select-none border",
                  msg.sender === "user" 
                    ? "bg-slate-800 border-slate-700 text-white" 
                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                )}>
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={cn(
                  "p-3.5 rounded-xl text-xs font-semibold leading-relaxed shadow-sm",
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-900/40 border border-slate-800 text-slate-300 rounded-tl-none font-medium"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 select-none">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono animate-pulse">Consigilere is auditing memory trackers...</span>
            </div>
          )}
        </div>

        {/* Action board: Preset Question Chips & Input Area */}
        <div className="p-4 border-t border-slate-800 bg-[#0d0d12]/40 shrink-0 space-y-4">
          
          {/* Preset question chips */}
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                disabled={isThinking}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#050508]/60 hover:bg-white/5 text-[10px] uppercase font-black text-slate-400 hover:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
              >
                <q.icon className={cn("w-3 h-3", q.color.split(" ")[0])} />
                {q.text}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inquire: Ask about largest risk, roadmap sequence, monetization model..."
              disabled={isThinking}
              className="flex-1 bg-[#050508]/80 border border-slate-800 focus:border-indigo-550 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-200 placeholder:text-slate-600 font-bold uppercase tracking-tight"
            />
            <button
              type="submit"
              disabled={isThinking || !inputText.trim()}
              className="btn-primary flex items-center justify-center px-4 rounded-xl disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
