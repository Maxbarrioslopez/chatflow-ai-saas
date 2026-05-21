export interface DashboardMetrics {
  totalConversations: number;
  activeConversations: number;
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  satisfactionRate: number;
  avgResponseTime: number;
  totalMessages: number;
  previousPeriod: Partial<DashboardMetrics>;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface AnalyticsData {
  conversations: TimeSeriesPoint[];
  leads: TimeSeriesPoint[];
  messages: TimeSeriesPoint[];
  satisfaction: TimeSeriesPoint[];
  topChatbots: ChatbotMetric[];
  recentActivity: ActivityItem[];
}

export interface ChatbotMetric {
  chatbotId: string;
  chatbotName: string;
  conversations: number;
  leads: number;
  satisfaction: number;
}

export interface ActivityItem {
  id: string;
  type: 'conversation' | 'lead' | 'message' | 'rating' | 'error';
  description: string;
  chatbotName?: string;
  timestamp: string;
}

export interface SatisfactionData {
  rating: number;
  count: number;
  percentage: number;
}
