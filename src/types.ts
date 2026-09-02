export type Network = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";
export type PlanType = "SME" | "Direct" | "Gifting" | "Corporate";
export type TransactionType = "data" | "airtime" | "wallet_fund";
export type TxStatus = "Successful" | "Pending" | "Failed";
export type TabKey = "home" | "purchase" | "wallet" | "admin";

export interface DataPlan {
  id: string;
  network: Network;
  type: PlanType;
  size: string;
  validity: string;
  price: number;
  discountPrice?: number;
  popular?: boolean;
}

export interface AirtimeDiscount {
  network: Network;
  minAmount: number;
  discountPercent: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  network: Network;
  amount: number;
  planDetails?: string;
  recipientPhone: string;
  status: TxStatus;
  date: string;
  reference: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  referralCode: string;
  referredBy?: string;
}

export interface FundingRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  senderName: string;
  bank: string;
  reference: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export interface ReferralStats {
  totalReferred: number;
  activeFunders: number;
  totalBonus: number;
  referrals: { name: string; date: string; bonus: number }[];
}

export interface NetworkConfig {
  name: Network;
  color: string;
  bgColor: string;
  borderColor: string;
  prefixColor: string;
  gradientFrom: string;
  gradientTo: string;
  prefixes: string[];
}