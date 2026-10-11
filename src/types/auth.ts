export type LicenseStatus = 'none' | 'pending' | 'active' | 'expired' | 'revoked';

export type PlanType = 'mensal' | 'anual' | 'vitalicio';

export interface UserAccount {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface UserLicense {
  userId: string;
  userEmail: string;
  status: LicenseStatus;
  planType?: PlanType;
  orderReference?: string;
  transactionId?: string;
  activatedAt?: string;
  expiresAt?: string;
  updatedAt: string;
  notes?: string;
}

export interface PaymentOrder {
  orderReference: string;
  userId: string;
  userEmail: string;
  planType: PlanType;
  amountEuro: number;
  paymentMethod: 'cartao' | 'mbway' | 'multibanco';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  transactionId?: string;
}

export interface WebhookLogItem {
  eventId: string;
  orderReference: string;
  eventType: string;
  status: string;
  verified: boolean;
  receivedAt: string;
  notes?: string;
}

export interface AdminNotificationItem {
  id: string;
  eventType: string;
  subject: string;
  recipient: string;
  transactionId: string;
  orderReference: string;
  planType: string;
  amountEuro: number;
  currency: string;
  status: string;
  subscriptionRef?: string;
  customerId: string;
  customerEmail: string;
  paymentMethod: string;
  timestamp: string;
  deliveryStatus: 'sent' | 'simulated' | 'failed' | 'logged';
  deliveryMethod: 'smtp' | 'resend' | 'logged';
  deliveryError?: string;
  emailHtml: string;
  emailText: string;
}

export interface AuthState {
  user: UserAccount | null;
  license: UserLicense | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasActiveAccess: boolean;
}

