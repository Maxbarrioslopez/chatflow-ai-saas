export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: PlanLimits;
  isPopular?: boolean;
}

export interface PlanLimits {
  maxChatbots: number;
  maxConversations: number;
  maxContacts: number;
  maxTeamMembers: number;
  maxKnowledgeSources: number;
  aiMessagesPerMonth: number;
  aiTokensPerMonth: number;
  integrations: number;
  customDomain: boolean;
  whitelabel: boolean;
  premiumSupport: boolean;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: PaymentMethod;
  invoices: Invoice[];
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  pdfUrl?: string;
}
