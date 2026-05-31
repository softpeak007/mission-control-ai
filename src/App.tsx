import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import MissionView from './components/MissionView.tsx';
import History from './components/History.tsx';
import Analytics from './components/Analytics.tsx';
import Pitch from './components/Pitch.tsx';
import InvestorMode from './components/InvestorMode.tsx';
import FounderCopilot from './components/FounderCopilot.tsx';
import FutureRoadmap from './components/FutureRoadmap.tsx';
import FloatingCopilot from './components/FloatingCopilot.tsx';
import { Mission, MissionStatus, AgentRole } from './types.ts';
import { Loader2, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Active multi-agent progressive execution simulation
  useEffect(() => {
    if (!currentMission || currentMission.status !== MissionStatus.RUNNING) return;
    if ((currentMission as any).isDemo) return;

    let isSubscribed = true;
    const runMultiAgentPipeline = async () => {
      try {
        const activeAgents = [...currentMission.agents];
        const localFindings: { [key: string]: string } = {};

        for (let i = 0; i < activeAgents.length; i++) {
          if (!isSubscribed) return;
          const agent = activeAgents[i];
          const { role } = agent;

          // 1. Mark Agent Working
          setCurrentMission(prev => {
            if (!prev) return null;
            const updatedAgs = [...prev.agents];
            updatedAgs[i] = { ...updatedAgs[i], status: 'working' };
            return {
              ...prev,
              agents: updatedAgs,
              logs: [
                ...prev.logs,
                {
                  id: `log-agent-start-${i}-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  agentId: agent.id,
                  agentRole: role,
                  message: `Initiating strategic analysis for specialized ${role} Agent...`,
                  type: 'info'
                }
              ]
            };
          });

          // Fetch agent response from server
          const agentResponse = await fetch('/api/missions/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              goal: currentMission.goal,
              role: role,
              previousFindings: localFindings
            })
          });

          if (!agentResponse.ok) {
            throw new Error(`Agent ${role} execution returned code ${agentResponse.status}`);
          }

          const { text } = await agentResponse.json();
          if (!isSubscribed) return;

          localFindings[role] = text;

          // 2. Mark Agent Completed
          setCurrentMission(prev => {
            if (!prev) return null;
            const updatedAgs = [...prev.agents];
            updatedAgs[i] = { ...updatedAgs[i], status: 'completed' };
            const nextFindings = { ...prev.findings, [role]: text };
            return {
              ...prev,
              agents: updatedAgs,
              findings: nextFindings,
              logs: [
                ...prev.logs,
                {
                  id: `log-agent-done-${i}-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  agentId: agent.id,
                  agentRole: role,
                  message: `${role} Agent concluded evaluation successfully and logged findings.`,
                  type: 'success'
                }
              ]
            };
          });
        }

        if (!isSubscribed) return;

        // 3. Invoke Master Synthesis Orchestrator
        setCurrentMission(prev => {
          if (!prev) return null;
          return {
            ...prev,
            logs: [
              ...prev.logs,
              {
                id: `log-synth-start-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: 'orchestrator',
                agentRole: AgentRole.ORCHESTRATOR,
                message: `All specialized agents resolved. Initializing Master Synthesis & Consensus Score Engine...`,
                type: 'info'
              }
            ]
          };
        });

        const synthResponse = await fetch('/api/missions/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: currentMission.goal,
            findings: localFindings
          })
        });

        if (!synthResponse.ok) {
          throw new Error(`Master Synthesis returned code ${synthResponse.status}`);
        }

        const synthesisReport = await synthResponse.json();
        if (!isSubscribed) return;

        // 4. Update and conclude mission state
        setCurrentMission(prev => {
          if (!prev) return null;

          const finishedMission: Mission = {
            ...prev,
            status: MissionStatus.COMPLETED,
            endTime: new Date().toISOString(),
            executiveSummary: synthesisReport.executiveSummary,
            findings: localFindings,
            sevenDayPlan: synthesisReport.sevenDayPlan,
            riskChecklist: synthesisReport.riskChecklist,
            monetization: synthesisReport.monetization,
            nextSteps: synthesisReport.nextSteps,
            debateSummary: synthesisReport.debateSummary,
            consensusScore: synthesisReport.consensusScore,
            scores: synthesisReport.scores,
            thirtyDayPlan: synthesisReport.thirtyDayPlan,
            ninetyDayPlan: synthesisReport.ninetyDayPlan,
            investorMode: synthesisReport.investorMode,
            competitiveIntelligence: synthesisReport.competitiveIntelligence,
            logs: [
              ...prev.logs,
              {
                id: `log-conclude-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: 'orchestrator',
                agentRole: AgentRole.ORCHESTRATOR,
                message: `MISSION SUCCESSFULLY CONCLUDED: Autonomous consensus met representing a standard score of ${synthesisReport.consensusScore}/100.`,
                type: 'success'
              }
            ]
          };

          // Cache completed mission locally
          const cached = localStorage.getItem('user_missions') || '[]';
          try {
            const list = JSON.parse(cached);
            if (!list.some((m: any) => m.id === finishedMission.id)) {
              list.unshift(finishedMission);
              localStorage.setItem('user_missions', JSON.stringify(list));
            }
          } catch (e) {
            localStorage.setItem('user_missions', JSON.stringify([finishedMission]));
          }

          return finishedMission;
        });

      } catch (err: any) {
        console.error("Multi-Agent Execution Pipeline failed:", err);
        if (!isSubscribed) return;

        setCurrentMission(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: MissionStatus.COMPLETED, // Mark completed with failure notice so UI does not freeze
            logs: [
              ...prev.logs,
              {
                id: `log-error-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: 'orchestrator',
                agentRole: AgentRole.ORCHESTRATOR,
                message: `MISSION FAILED: ${err.message || 'Execution error occured'}. Gracefully fallback engaged.`,
                type: 'info'
              }
            ]
          };
        });
      }
    };

    runMultiAgentPipeline();

    return () => {
      isSubscribed = false;
    };
  }, [currentMission?.id]);

  // Dedicated sequential Judge Demo simulation to showcase active step progress, live logs, agent states, and consensus compiling within 20s.
  useEffect(() => {
    if (!currentMission || currentMission.status !== MissionStatus.RUNNING || !(currentMission as any).isDemo) return;

    let timer: NodeJS.Timeout;
    let step = 0;

    const runDemoSimulationStep = () => {
      step++;
      
      if (step === 1) {
        // Step 1: Research Agent working
        setCurrentMission(prev => {
          if (!prev) return null;
          const updatedAgents = [...prev.agents];
          updatedAgents[0] = { ...updatedAgents[0], status: 'working' };
          return {
            ...prev,
            agents: updatedAgents,
            logs: [
              ...prev.logs,
              {
                id: `demo-log-start-research-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-research",
                agentRole: AgentRole.RESEARCH,
                message: "🕵️ Research Agent recruited. Analyzing estate planning sectors, global wealth custody preservation demands, and trust legal codes...",
                type: "info"
              }
            ]
          };
        });
        timer = setTimeout(runDemoSimulationStep, 4000);
      } else if (step === 2) {
        // Step 2: Research done, Product Agent working
        setCurrentMission(prev => {
          if (!prev) return null;
          const updatedAgents = [...prev.agents];
          updatedAgents[0] = { ...updatedAgents[0], status: 'completed' };
          updatedAgents[1] = { ...updatedAgents[1], status: 'working' };
          const nextFindings = { 
            ...prev.findings, 
            [AgentRole.RESEARCH]: "The global estate planning sector is a high-yield legacy market ($35.4B). Existing services require manual verification taking 4-6 weeks and costing upwards of $5,000 upfront."
          };
          return {
            ...prev,
            agents: updatedAgents,
            findings: nextFindings,
            logs: [
              ...prev.logs,
              {
                id: `demo-log-done-research-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-research",
                agentRole: AgentRole.RESEARCH,
                message: "✅ Research Agent concluded finding: Global trust market TAM: $35.4B worldwide estate planning, SAM: $8.2B digital heritage management. Traditional setups face extreme manual delays.",
                type: "success"
              },
              {
                id: `demo-log-start-product-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-product",
                agentRole: AgentRole.PRODUCT,
                message: "🛠️ Product Agent recruited. Mapping responsive layout specifications, social recovery biometric locks, and key division parameters...",
                type: "info"
              }
            ]
          };
        });
        timer = setTimeout(runDemoSimulationStep, 4000);
      } else if (step === 3) {
        // Step 3: Product done, Strategy Agent working
        setCurrentMission(prev => {
          if (!prev) return null;
          const updatedAgents = [...prev.agents];
          updatedAgents[1] = { ...updatedAgents[1], status: 'completed' };
          updatedAgents[2] = { ...updatedAgents[2], status: 'working' };
          const nextFindings = { 
            ...prev.findings, 
            [AgentRole.PRODUCT]: "A secure dual-factor biometric dashboard tracking hardware keys, paper deeds, and cryptographic storage wallets. Access triggers automatically upon dead-man consensus resolution."
          };
          return {
            ...prev,
            agents: updatedAgents,
            findings: nextFindings,
            logs: [
              ...prev.logs,
              {
                id: `demo-log-done-product-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-product",
                agentRole: AgentRole.PRODUCT,
                message: "✅ Product Agent drafted specifications: Designed an intuitive dashboard requiring dual-factor biometric family confirmation to disburse hardware assets securely.",
                type: "success"
              },
              {
                id: `demo-log-start-strategy-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-strategy",
                agentRole: AgentRole.STRATEGY,
                message: "📈 Strategy Agent recruited. Synthesizing monetization tiers, premium subscription structures, and local notary partnerships...",
                type: "info"
              }
            ]
          };
        });
        timer = setTimeout(runDemoSimulationStep, 4000);
      } else if (step === 4) {
        // Step 4: Strategy done, Critic Agent working
        setCurrentMission(prev => {
          if (!prev) return null;
          const updatedAgents = [...prev.agents];
          updatedAgents[2] = { ...updatedAgents[2], status: 'completed' };
          updatedAgents[3] = { ...updatedAgents[3], status: 'working' };
          const nextFindings = { 
            ...prev.findings, 
            [AgentRole.STRATEGY]: "Monetize using a premium storage vault fee of $49/year paired with B2B notary dynamic API key licensing fees."
          };
          return {
            ...prev,
            agents: updatedAgents,
            findings: nextFindings,
            logs: [
              ...prev.logs,
              {
                id: `demo-log-done-strategy-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-strategy",
                agentRole: AgentRole.STRATEGY,
                message: "✅ Strategy Agent pricing engine finalized: $49/year core storage vault subscription + minor 0.15% heirloom transfers.",
                type: "success"
              },
              {
                id: `demo-log-start-critic-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-critic",
                agentRole: AgentRole.CRITIC,
                message: "🛡️ Critic Agent recruited. Performing legal disclaimers, multi-jurisdiction rule integration, and deadman fail-safe switches...",
                type: "info"
              }
            ]
          };
        });
        timer = setTimeout(runDemoSimulationStep, 4000);
      } else if (step === 5) {
        // Step 5: Critic done, Orchestrator compiling
        setCurrentMission(prev => {
          if (!prev) return null;
          const updatedAgents = [...prev.agents];
          updatedAgents[3] = { ...updatedAgents[3], status: 'completed' };
          const nextFindings = { 
            ...prev.findings, 
            [AgentRole.CRITIC]: "The legal compliance risks of estate distribution across cross-border jurisdiction are mitigated by integrating certified document templates managed by local notary APIs."
          };
          return {
            ...prev,
            agents: updatedAgents,
            findings: nextFindings,
            logs: [
              ...prev.logs,
              {
                id: `demo-log-done-critic-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "agent-critic",
                agentRole: AgentRole.CRITIC,
                message: "✅ Critic Agent completed audit checklist: Mitigated accidental release risks with a mandatory 30-day soft cool-down verification period.",
                type: "success"
              },
              {
                id: `demo-log-start-synth-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "orchestrator",
                agentRole: AgentRole.ORCHESTRATOR,
                message: "✨ All specialized agents resolved. Initializing master multi-agent consensus scoring and strategic synthesis compile...",
                type: "info"
              }
            ]
          };
        });
        timer = setTimeout(runDemoSimulationStep, 4000);
      } else if (step === 6) {
        // Step 6: Complete compiles!
        setCurrentMission(prev => {
          if (!prev) return null;
          
          const finishedMission: Mission = {
            ...prev,
            status: MissionStatus.COMPLETED,
            endTime: new Date().toISOString(),
            metrics: { tokensUsed: 1420, costEstimate: 0.0014, duration: 20 },
            executiveSummary: "SafeTrust digitizes trust protocol administration, bypassing expensive notary overhead using secure MPC multi-signature technology and social recovery guardians.",
            findings: {
              [AgentRole.RESEARCH]: "The global estate planning sector is a high-yield legacy market ($35.4B). Existing services require manual verification taking 4-6 weeks and costing upwards of $5,000 upfront.",
              [AgentRole.PRODUCT]: "A secure dual-factor biometric dashboard tracking hardware keys, paper deeds, and cryptographic storage wallets. Access triggers automatically upon dead-man consensus resolution.",
              [AgentRole.STRATEGY]: "Monetize using a premium storage vault fee of $49/year paired with B2B notary dynamic API key licensing fees.",
              [AgentRole.CRITIC]: "The legal compliance risks of estate distribution across cross-border jurisdiction are mitigated by integrating certified document templates managed by local notary APIs."
            },
            sevenDayPlan: [
              { day: "Day 1", task: "Formulate core social recovery interfaces and mathematical MPC signature schemes with guardians." },
              { day: "Day 2", task: "Build a responsive high-contrast client dashboard showing locker parameters." },
              { day: "Day 3", task: "Implement localized legal jurisdiction selection widgets." },
              { day: "Day 4", task: "Connect email and SMS alerts for 30-day soft dead-man switches." },
              { day: "Day 5", task: "Audit Solana or cross-chain smart contract escrow contracts." },
              { day: "Day 6", task: "Deploy interactive testnet beta container for initial validator groups." },
              { day: "Day 7", task: "Launch waitlist to 50 target legacy families." }
            ],
            riskChecklist: [
              { risk: "Emergency Key Loss", mitigation: "Deploy non-custodial WebAuthn biometric recovery keys split among trusted peer institutions." },
              { risk: "Estate Law Nullification", mitigation: "Integrate standard legal document generation templates certified in major regional territories." }
            ],
            monetization: [
              "Core Pro Vault: $49/year high-density storage",
              "Family Transfer Tier: 0.15% dynamic transfer fees on heirloom payouts",
              "Enterprise Notary API leases: White-labeled interfaces for legal firms"
            ],
            nextSteps: [
              "Interview 10 legacy trust candidates to lock down friction expectations.",
              "Formulate responsive waitlist landing page detailing unique MPC biometric safeguards.",
              "Draft a 2-question intake questionnaire gating testnet sandbox access."
            ],
            debateSummary: "Debate was settled with 94% consensus. Feasibility scored excellent based on simplified MPC key-share interfaces, while regulatory compliance burdens are controlled via local notary APIs.",
            consensusScore: 94,
            scores: {
              feasibility: 95,
              risk: 88,
              opportunity: 96,
              complexity: 85
            },
            thirtyDayPlan: [
              { period: "Week 1-2", task: "Complete MPC social recovery validation sandbox." },
              { period: "Week 3-4", task: "Run localized ads on developer forums to capture early adopters." }
            ],
            ninetyDayPlan: [
              { period: "Month 1", task: "Formulate compliant regulatory guidelines with certified escrow attorneys." },
              { period: "Month 2-3", task: "Lock in 100 paid active family vault subscriptions." }
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
            },
            logs: [
              ...prev.logs,
              {
                id: `demo-log-conclude-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: "orchestrator",
                agentRole: AgentRole.ORCHESTRATOR,
                message: "🎯 MISSION SUCCESSFULLY CONCLUDED: Autonomous consensus met successfully at 94/100. Disclosing final strategic report, investor deck slides, and active strategic advisor workspace.",
                type: "success"
              }
            ]
          };

          // Cache completed mission locally so other pages can select it
          const cached = localStorage.getItem('user_missions') || '[]';
          try {
            const list = JSON.parse(cached);
            if (!list.some((m: any) => m.id === finishedMission.id)) {
              list.unshift(finishedMission);
              localStorage.setItem('user_missions', JSON.stringify(list));
            }
          } catch (e) {
            localStorage.setItem('user_missions', JSON.stringify([finishedMission]));
          }

          // Preload custom strategic advisor messages for Founder Copilot
          const demoMessages = [
            {
              id: "welcome",
              sender: "copilot",
              text: "Greetings, founder. I am your strategic memory layer and executive cooperator. I reside directly on your command loop, analyzing your agent outputs to clear tactical uncertainty. What is on your docket today?",
              timestamp: new Date().toISOString()
            },
            {
              id: `demo-msg-user-${Date.now()}`,
              sender: "user",
              text: "Review findings for our Cryptographic Trust Protocol and give me strategic priority advice.",
              timestamp: new Date().toISOString()
            },
            {
              id: `demo-msg-copilot-${Date.now()}`,
              sender: "copilot",
              text: `Greetings, founder. I have analyzed the 94% consensus report generated by our multi-agent fleet for **SafeTrust: Automated Cryptographic Family Trust Protocol**.\n\nHere is my high-conviction strategic priority advice for immediate launch:\n\n### 🚀 **Priority #1: Launch Biometric & Social Recovery Sandboxes**\nStandard MPC key-sharing requires high UX trust. Prioritize building the dual-factor biometric family confirmation screen. Guide users with clear, comforting micro-copy to dispel "tech complexity" fatigue.\n\n### 🛡️ **Priority #2: Localized Notary Certification Integration**\nCollaborate with API-first digital notarization systems (like DocuSign or Notarize API) to dynamically append legally binding cross-border codicils to our cryptographic logs. This completely neutralizes our primary Critic risk.\n\n### 💰 **Priority #3: Pre-sell and Gate on High-Density Storage Vault**\nDeploy a fluid waitlist gating the $49/year premium storage vault. Your unit economics exhibit immense margins (> 95%); securing early pre-commitments will provide the cash-flow required to power downstream legal audits.\n\n*Would you like me to draft intake questionnaires or compliance disclaimers for the sandbox?*`,
              timestamp: new Date().toISOString()
            }
          ];
          localStorage.setItem("copilot_chat_history", JSON.stringify(demoMessages));
          window.dispatchEvent(new Event("copilot_sync"));

          return finishedMission;
        });
      }
    };

    timer = setTimeout(runDemoSimulationStep, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentMission?.id, (currentMission as any)?.isDemo]);

  const handleLaunchJudgeDemo = () => {
    setIsInitializing(true);
    setTimeout(() => {
      const demoInitMission: Mission = {
        id: "demo-trust-protocol",
        goal: "Deploy an Automated Cryptographic Family Trust & Safe Asset Locker System",
        status: MissionStatus.RUNNING,
        startTime: new Date().toISOString(),
        agents: [
          {
            id: "agent-research",
            role: AgentRole.RESEARCH,
            status: "idle",
            description: "Audits target multi-signature trust lockers."
          },
          {
            id: "agent-product",
            role: AgentRole.PRODUCT,
            status: "idle",
            description: "Specifies secure seed-less generation flows."
          },
          {
            id: "agent-strategy",
            role: AgentRole.STRATEGY,
            status: "idle",
            description: "Builds premium wealth-locker subscription tiers."
          },
          {
            id: "agent-critic",
            role: AgentRole.CRITIC,
            status: "idle",
            description: "Performs mathematical and legal compliance audits."
          }
        ],
        logs: [
          {
            id: `demo-log-init-${Date.now()}`,
            timestamp: new Date().toISOString(),
            agentId: "orchestrator",
            agentRole: AgentRole.ORCHESTRATOR,
            message: "🚀 Initiating Automated Cryptographic Family Trust & Safe Asset Locker System in Judge Demo Mode...",
            type: "info"
          }
        ],
        metrics: {
          tokensUsed: 0,
          costEstimate: 0,
          duration: 0
        },
        findings: {}
      } as any;
      (demoInitMission as any).isDemo = true;

      setCurrentMission(demoInitMission);
      setIsInitializing(false);
      setActiveTab('missions');
    }, 1000);
  };

  const handleCreateMission = async (goal: string) => {
    if (goal.toLowerCase().includes("judge demo") || goal.toLowerCase().includes("easy-launch")) {
      handleLaunchJudgeDemo();
      return;
    }
    setIsInitializing(true);
    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, mode: 'mission' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize mission');
      }

      const mission = await response.json();
      setCurrentMission(mission);
      setActiveTab('missions');
    } catch (error) {
      console.error("Mission creation failed:", error);
      alert(error instanceof Error ? error.message : "Mission failed to launch");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSelectHistoryMission = (mission: Mission) => {
    setCurrentMission(mission);
    setActiveTab('missions');
  };

  return (
    <div className="flex flex-col h-screen bg-[#050508] overflow-hidden">
      <div className="bg-mesh" />
      
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#050508]/80 backdrop-blur-md z-40 shrink-0">
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">
            Mission Control <span className="text-indigo-500 underline decoration-indigo-500/50">AI</span>
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-slate-900/50 rounded-full px-4 py-1.5 border border-slate-800">
            <span className="text-[10px] text-slate-400 mr-2 uppercase tracking-widest font-black">Token Budget</span>
            <span className="text-sm font-mono text-emerald-400 font-bold">$1,422.40 / $2k</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20 shadow-xl shadow-indigo-500/10"></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLaunchJudgeDemo={handleLaunchJudgeDemo} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-950/20">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard onCreateMission={handleCreateMission} />
              </motion.div>
            )}

            {activeTab === 'missions' && (
              <motion.div
                key="missions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {currentMission ? (
                  <MissionView mission={currentMission} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-center text-slate-500">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-slate-300">No Active Mission</h3>
                      <p className="text-sm text-slate-500">Start a new mission from the dashboard to begin autonomous execution.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="btn-ghost"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <History onSelectMission={handleSelectHistoryMission} />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Analytics />
              </motion.div>
            )}

            {activeTab === 'pitch' && (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Pitch />
              </motion.div>
            )}

            {activeTab === 'investor' && (
              <motion.div
                key="investor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <InvestorMode />
              </motion.div>
            )}

            {activeTab === 'copilot' && (
              <motion.div
                key="copilot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <FounderCopilot />
              </motion.div>
            )}

            {activeTab === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <FutureRoadmap />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <footer className="h-10 bg-indigo-600 flex items-center px-6 justify-between text-white shrink-0 z-40">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className="text-[10px] font-bold uppercase mr-2">System Mode:</span>
            <span className="text-xs font-medium uppercase tracking-widest bg-white/20 px-2 rounded">
              {activeTab === 'missions' ? 'Mission Active' : 'Orchestration Mode'}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/30 hidden sm:block"></div>
          <div className="text-[10px] font-bold uppercase hidden sm:block">Connectivity: Optimal</div>
        </div>
        <div className="text-[10px] font-mono opacity-80 underline underline-offset-4 decoration-white/30">
          v1.0.4-MISSION_CONTROL_OS
        </div>
      </footer>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isInitializing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 glass flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin relative z-10" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold tracking-tight uppercase underline decoration-indigo-500/50 underline-offset-8">Initializing Autonomous Stack</h2>
              <p className="text-xs text-indigo-400 font-mono uppercase tracking-[0.2em] font-bold">Master Orchestrator :: Routing Agents</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingCopilot />
    </div>
  );
}
