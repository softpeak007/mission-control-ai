export enum AgentRole {
  ORCHESTRATOR = "Orchestrator",
  RESEARCH = "Research",
  PRODUCT = "Product",
  MARKETING = "Marketing",
  FINANCE = "Finance",
  CODING = "Coding",
  QA = "QA",
  CRITIC = "Critic",
  STRATEGY = "Strategy",
}

export enum MissionStatus {
  PENDING = "Pending",
  RUNNING = "Running",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

export interface Agent {
  id: string;
  role: AgentRole;
  status: "idle" | "working" | "completed" | "error";
  description: string;
  avatar?: string;
}

export interface MissionLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentRole: AgentRole;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface Mission {
  id: string;
  goal: string;
  status: MissionStatus;
  startTime: string;
  endTime?: string;
  agents: Agent[];
  logs: MissionLog[];
  result?: string;
  metrics: {
    tokensUsed: number;
    costEstimate: number;
    duration: number;
  };
  executiveSummary?: string;
  findings?: Record<string, string>;
  sevenDayPlan?: { day: string; task: string }[];
  riskChecklist?: { risk: string; mitigation: string }[];
  monetization?: string[];
  nextSteps?: string[];
  debateSummary?: string;
  consensusScore?: number;
  scores?: {
    feasibility: number;
    risk: number;
    opportunity: number;
    complexity: number;
  };
  thirtyDayPlan?: { period: string; task: string }[];
  ninetyDayPlan?: { period: string; task: string }[];
  investorMode?: {
    elevatorPitch: string;
    onePageSummary: string;
    marketSizeEstimate: string;
    revenuePotential: string;
    fundingReadinessScore: number;
    fundingReadinessReasoning: string;
    investorConcerns: { concern: string; mitigation: string }[];
    competitiveAdvantage: string;
    investmentRecommendation: string;
  };
  competitiveIntelligence?: {
    competitors: { name: string; strengths: string; weaknesses: string }[];
    positioningStrategy: string;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: string[];
}
