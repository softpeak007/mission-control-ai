import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Bot, 
  Send, 
  Lightbulb, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  Trash2,
  MessageSquare,
  X,
  Plus
} from "lucide-react";
import { Mission } from "@/types";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: Date;
}

export default function FloatingCopilot() {
  const [isOpen, setIsOpen] = useState(false);
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history to supply smart context
  const reloadMissions = () => {
    const cached = localStorage.getItem("user_missions");
    if (cached) {
      try {
        const list = JSON.parse(cached);
        setMissionsList(list);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    reloadMissions();
    
    // Listen for storage changes or customized update triggers
    const handleSyncChange = () => {
      reloadMissions();
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

  // Scroll to bottom when messages list updates or copilot is opened
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const saveAndPublishMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem("copilot_chat_history", JSON.stringify(newMsgs));
    window.dispatchEvent(new Event("copilot_sync"));
  };

  const getActiveContextGoal = () => {
    return missionsList[0]?.goal || "Building a high-tempo startup MVP";
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    reloadMissions(); // Ensure fresh context
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
    const activeMissionObj = missionsList[0];
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
      // Fallback
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
    <div id="floating-copilot-root" className="fixed bottom-14 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Expanded panel container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="floating-copilot-panel"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-[370px] sm:w-[410px] h-[550px] bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto backdrop-blur-md mb-4"
          >
            {/* Header info */}
            <div className="p-4 border-b border-rose-950/10 bg-slate-900/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase text-slate-100 tracking-wider">Founder Copilot</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Persistent Strategic Advisor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleClearHistory}
                  title="Clear chat loop"
                  className="p-1.5 border border-slate-900 hover:border-rose-955 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border border-slate-900 hover:border-slate-800 hover:bg-slate-900 text-slate-500 hover:text-slate-350 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrolling chat messages */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-[#020204]/40"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-2.5 max-w-[85%] select-text",
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 border",
                      msg.sender === "user" 
                        ? "bg-slate-800 border-slate-700 text-white" 
                        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    )}>
                      {msg.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-xl text-xs leading-relaxed font-semibold shadow-sm",
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none font-bold"
                        : "bg-slate-900/50 border border-slate-800 text-slate-300 rounded-tl-none font-medium whitespace-pre-wrap"
                    )}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isThinking && (
                <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 select-none">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono animate-pulse">Analyzing roadmap context...</span>
                </div>
              )}
            </div>

            {/* Quick preset chips */}
            <div className="p-3 border-t border-slate-900 bg-slate-950/80 shrink-0 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.text)}
                    disabled={isThinking}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-900 hover:border-slate-700 bg-slate-900/30 hover:bg-white/5 text-[9px] uppercase font-black text-slate-400 hover:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <q.icon className={cn("w-2.5 h-2.5", q.color.split(" ")[0])} />
                    {q.text.replace("What", "").replace("How", "").replace("?", "").trim()}
                  </button>
                ))}
              </div>

              {/* Form Input area */}
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
                  placeholder="Inquire: risk, validation step, pricing tiers..."
                  disabled={isThinking}
                  className="flex-1 bg-[#020204]/90 border border-slate-800 focus:border-indigo-550 rounded-xl px-3.5 py-2 text-xs outline-none text-slate-200 placeholder:text-slate-650 font-bold uppercase tracking-tight"
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center w-9 h-9 shrink-0 rounded-xl transition-all cursor-pointer disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button on all screens */}
      <motion.button
        id="floating-copilot-launcher"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto h-12 px-4 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/20 text-white shadow-xl shadow-indigo-600/10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest cursor-pointer group"
      >
        <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform duration-300" />
        <span>Founder Copilot</span>
        {isOpen ? (
          <X className="w-3.5 h-3.5 border-l border-white/20 pl-1 ml-1" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        )}
      </motion.button>

    </div>
  );
}
