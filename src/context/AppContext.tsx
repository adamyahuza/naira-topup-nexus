import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { DataPlan, Transaction, FundingRequest, UserProfile, TabKey, Network } from "../types";
import { DATA_PLANS, AIRTIME_DISCOUNTS, DEMO_USER, generateReference } from "../data/mockData";

interface AppState {
  user: UserProfile;
  walletBalance: number;
  transactions: Transaction[];
  fundingRequests: FundingRequest[];
  dataPlans: DataPlan[];
  airtimeDiscounts: typeof AIRTIME_DISCOUNTS;
  activeTab: TabKey;
  isAdmin: boolean;
  selectedNetwork: Network | null;
  cart: { planId?: string; amount?: number; phone: string; type: "data" | "airtime" } | null;
  showPurchaseModal: boolean;
  purchaseStep: number;
  lastReceipt: Transaction | null;
}

interface AppContextType extends AppState {
  setActiveTab: (tab: TabKey) => void;
  setSelectedNetwork: (net: Network | null) => void;
  setCart: (cart: AppState["cart"]) => void;
  setShowPurchaseModal: (show: boolean) => void;
  setPurchaseStep: (step: number) => void;
  purchaseBundle: () => void;
  topUpAirtime: () => void;
  fundWallet: (amount: number) => void;
  submitFundingRequest: (req: Omit<FundingRequest, "id" | "status" | "date">) => void;
  approveFunding: (id: string) => void;
  updateDataPlan: (planId: string, updates: Partial<DataPlan>) => void;
  deleteDataPlan: (planId: string) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  resetWallet: () => void;
}

const DEFAULT_STATE: AppState = {
  user: DEMO_USER,
  walletBalance: 5000,
  transactions: [],
  fundingRequests: [],
  dataPlans: DATA_PLANS,
  airtimeDiscounts: AIRTIME_DISCOUNTS,
  activeTab: "home",
  isAdmin: false,
  selectedNetwork: null,
  cart: null,
  showPurchaseModal: false,
  purchaseStep: 0,
  lastReceipt: null,
};

const STORAGE_KEY = "yahuza_state";

function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // ignore
  }
  return {};
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({ ...DEFAULT_STATE, ...loadState() }));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setActiveTab = useCallback((tab: TabKey) => setState((s) => ({ ...s, activeTab: tab })), []);
  const setSelectedNetwork = useCallback((net: Network | null) => setState((s) => ({ ...s, selectedNetwork: net })), []);
  const setCart = useCallback((cart: AppState["cart"]) => setState((s) => ({ ...s, cart })), []);
  const setShowPurchaseModal = useCallback((show: boolean) => setState((s) => ({ ...s, showPurchaseModal: show })), []);
  const setPurchaseStep = useCallback((step: number) => setState((s) => ({ ...s, purchaseStep: step })), []);

  const purchaseBundle = useCallback(() => {
    setState((s) => {
      if (!s.cart?.planId) return s;
      const plan = s.dataPlans.find((p) => p.id === s.cart.planId);
      if (!plan) return s;
      const price = plan.discountPrice ?? plan.price;
      if (s.walletBalance < price) {
        toast.error("Insufficient wallet balance. Please fund your wallet.");
        return s;
      }
      const tx: Transaction = {
        id: generateReference(),
        type: "data",
        network: plan.network,
        amount: price,
        planDetails: `${plan.size} ${plan.type} (${plan.validity})`,
        recipientPhone: s.cart.phone,
        status: "Successful",
        date: new Date().toISOString(),
        reference: generateReference(),
      };
      toast.success(`Successfully purchased ${plan.size} ${plan.type} data bundle!`);
      return {
        ...s,
        walletBalance: s.walletBalance - price,
        transactions: [tx, ...s.transactions],
        showPurchaseModal: false,
        purchaseStep: 0,
        cart: null,
        lastReceipt: tx,
      };
    });
  }, []);

  const topUpAirtime = useCallback(() => {
    setState((s) => {
      if (!s.cart || !s.cart.amount) return s;
      const { amount } = s.cart;
      const discount = s.airtimeDiscounts.find((d) => d.network === s.selectedNetwork && amount >= d.minAmount);
      const finalAmount = discount ? Math.round(amount * (1 - discount.discountPercent / 100)) : amount;
      if (s.walletBalance < finalAmount) {
        toast.error("Insufficient wallet balance. Please fund your wallet.");
        return s;
      }
      const tx: Transaction = {
        id: generateReference(),
        type: "airtime",
        network: (s.selectedNetwork ?? "MTN") as Network,
        amount: finalAmount,
        recipientPhone: s.cart.phone,
        status: "Successful",
        date: new Date().toISOString(),
        reference: generateReference(),
      };
      const msg = discount ? `Airtime topped up! Saved ₦${amount - finalAmount} cashback.` : "Airtime topped up successfully!";
      toast.success(msg);
      return {
        ...s,
        walletBalance: s.walletBalance - finalAmount,
        transactions: [tx, ...s.transactions],
        showPurchaseModal: false,
        purchaseStep: 0,
        cart: null,
        lastReceipt: tx,
      };
    });
  }, []);

  const fundWallet = useCallback((amount: number) => {
    setState((s) => ({
      ...s,
      walletBalance: s.walletBalance + amount,
      transactions: [
        {
          id: generateReference(),
          type: "wallet_fund" as const,
          network: "MTN" as Network,
          amount,
          recipientPhone: s.user.phone,
          status: "Successful",
          date: new Date().toISOString(),
          reference: generateReference(),
        },
        ...s.transactions,
      ],
    }));
    toast.success(`₦${amount.toLocaleString()} added to your wallet!`);
  }, []);

  const submitFundingRequest = useCallback((req: Omit<FundingRequest, "id" | "status" | "date">) => {
    const newReq: FundingRequest = {
      ...req,
      id: generateReference(),
      status: "pending",
      date: new Date().toISOString(),
    };
    setState((s) => ({ ...s, fundingRequests: [newReq, ...s.fundingRequests] }));
    toast.success("Funding request submitted. Waiting for admin approval.");
  }, []);

  const approveFunding = useCallback((id: string) => {
    setState((s) => {
      const req = s.fundingRequests.find((r) => r.id === id);
      if (!req) return s;
      return {
        ...s,
        walletBalance: s.walletBalance + req.amount,
        fundingRequests: s.fundingRequests.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)),
        transactions: [
          {
            id: generateReference(),
            type: "wallet_fund" as const,
            network: "MTN" as Network,
            amount: req.amount,
            recipientPhone: s.user.phone,
            status: "Successful",
            date: new Date().toISOString(),
            reference: generateReference(),
          },
          ...s.transactions,
        ],
      };
    });
    toast.success("Funding approved and wallet credited!");
  }, []);

  const updateDataPlan = useCallback((planId: string, updates: Partial<DataPlan>) => {
    setState((s) => ({
      ...s,
      dataPlans: s.dataPlans.map((p) => (p.id === planId ? { ...p, ...updates } : p)),
    }));
    toast.success("Data plan updated!");
  }, []);

  const deleteDataPlan = useCallback((planId: string) => {
    setState((s) => ({
      ...s,
      dataPlans: s.dataPlans.filter((p) => p.id !== planId),
    }));
    toast.success("Data plan removed!");
  }, []);

  const loginAdmin = useCallback((pin: string): boolean => {
    if (pin === "admin123") {
      setState((s) => ({ ...s, isAdmin: true }));
      toast.success("Welcome, Admin!");
      return true;
    }
    toast.error("Incorrect PIN");
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setState((s) => ({ ...s, isAdmin: false }));
    toast.info("Logged out from admin panel.");
  }, []);

  const resetWallet = useCallback(() => {
    setState((s) => ({ ...s, walletBalance: 5000 }));
    toast.info("Wallet reset to demo balance.");
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setActiveTab,
        setSelectedNetwork,
        setCart,
        setShowPurchaseModal,
        setPurchaseStep,
        purchaseBundle,
        topUpAirtime,
        fundWallet,
        submitFundingRequest,
        approveFunding,
        updateDataPlan,
        deleteDataPlan,
        loginAdmin,
        logoutAdmin,
        resetWallet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
