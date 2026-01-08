
export type ResourceType = 'Human' | 'Physical';
export type ResourceSource = 'Internal' | 'External';
export type AssignmentStatus = 'Assigned' | 'Onboarding' | 'Pending';
export type DeliveryStatus = 'Delivered' | 'Not Delivered';
export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface PerformanceKPIs {
  onTimeCompletionRate: number; // Percentage
  issueResolutionTime: number; // Average hours
  activeIssuesCount: number;
  resourceUtilization: number; // Percentage
}

export interface ProjectResource {
  id: string;
  name: string;
  type: ResourceType;
  source: ResourceSource;
  role?: string; // For Human Resources
  assignmentStatus?: AssignmentStatus; // For Human Resources
  deliveryStatus?: DeliveryStatus; // For Physical Resources
  assignedDate: string;
}

export interface LeadershipLog {
  id: string;
  type: 'Issue' | 'Leadership Action';
  description: string;
  strategy: string; // PMBOK term like 'Conflict Management', 'Influencing', etc.
  mitigationPlan?: string; // Detailed action plan
  severity?: SeverityLevel;
  timestamp: string;
}

export interface AssistantState {
  resources: ProjectResource[];
  logs: LeadershipLog[];
  kpis: PerformanceKPIs;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
