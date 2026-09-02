import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, CreditCard, Search, CheckCircle, AlertCircle,
  ChevronDown, Filter, Zap, Gift, Building2, ArrowLeft,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { DATA_PLANS, NETWORK_CONFIGS, formatNaira, detectNetwork } from "../data/mockData";
import type { Network, PlanType } from "../types";

const PLAN_TYPES: { key: PlanType; label: string; icon: React.ReactNode }[] = [
  { key: "SME", label: "SME", icon: <Zap size={14} /> },
  { key: "Direct", label: "Direct", icon: <CreditCard size={14} /> },
  { key: "Gifting", label: "Gifting", icon: <Gift size={14} /> },
  { key: "Corporate", label: "Corporate", icon: <Building2 size={14} /> },
];

export default function DataAirtimePurchase() {
  const {
    selectedNetwork, setSelectedNetwork, setCart, setShowPurchaseModal,
    setPurchaseStep, activeTab, setActiveTab,
  } = useApp();

  const [mode, setMode] = useState<"data" | "airtime">("data");
  const [planType, setPlanType] = useState<PlanType>("SME");
  const [phone, setPhone] = useState("");
  const [airtimeAmount, setAirtimeAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  if (activeTab !== "home") return null;

  const detectedNetwork = phone.length >= 4 ? detectNetwork(phone) : null;

  const filteredPlans = DATA_PLANS.filter((p) => {
    if (mode === "airtime") return false;
    if (selectedNetwork && p.network !== selectedNetwork) return false;
    if (detectedNetwork && p.network !== detectedNetwork) return false;
    if (searchQuery && !p.size.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleBuyData = (planId: string) => {
    if (!phone) {
      alert("Please enter a phone number first.");
      return;
    }
    setCart({ planId, phone, type: "data" });
    setPurchaseStep(0);
    setShowPurchaseModal(true);
  };

  const handleBuyAirtime = () => {
    const amt = parseInt(airtimeAmount);
    if (!phone || !amt || amt < 50) {
      alert("Enter a valid phone number and amount (min ₦50).");
      return;
    }
    setCart({ amount: amt, phone, type: "airtime" });
    setPurchaseStep(0);
    setShowPurchaseModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-8 pt-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setMode("data")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "data" ? "bg-white shadow-sm text-emerald-700" : "text-gray-500"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Smartphone size={16} /> Buy Data
          </span>
        </button>
        <button
          onClick={() => setMode("airtime")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "airtime" ? "bg-white shadow-sm text-emerald-700" : "text-gray-500"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <CreditCard size={16} /> Top Up Airtime
          </span>
        </button>
      </div>

      {/* Phone Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08012345678"
            maxLength={11}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-lg font-semibold"
          />
          <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          {detectedNetwork && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: NETWORK_CONFIGS[detectedNetwork].color + "20",
                  color: NETWORK_CONFIGS[detectedNetwork].color,
                }}
              >
                {detectedNetwork}
              </span>
            </div>
          )}
        </div>
      </div>

      {mode === "data" ? (
        <>
          {/* Network Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Network</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(NETWORK_CONFIGS) as [Network, typeof NETWORK_CONFIGS[Network]][]).map(([net, cfg]) => (
                <button
                  key={net}
                  onClick={() => setSelectedNetwork(net === selectedNetwork ? null : net)}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    selectedNetwork === net
                      ? "border-emerald-500 shadow-md scale-105"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                  style={{ backgroundColor: selectedNetwork === net ? cfg.bgColor : "white" }}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {net.slice(0, 2)}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">{cfg.name}</span>
                  {selectedNetwork === net && (
                    <CheckCircle size={14} className="absolute top-1 right-1 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {/* Plan Type Tabs */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex gap-2 overflow-x-auto pb-2"
            >
              {PLAN_TYPES.map((pt) => (
                <button
                  key={pt.key}
                  onClick={() => setPlanType(pt.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    planType === pt.key
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {pt.icon}
                  {pt.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Plans Grid */}
          <div className="space-y-3">
            {filteredPlans.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium">No plans found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredPlans
                .filter((p) => planType === "SME" || p.type === planType)
                .map((plan) => {
                  const cfg = NETWORK_CONFIGS[plan.network];
                  return (
                    <motion.button
                      key={plan.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleBuyData(plan.id)}
                      className="w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md group"
                      style={{
                        borderColor: selectedNetwork === plan.network ? cfg.borderColor : "transparent",
                        backgroundColor: plan.popular ? cfg.bgColor : "white",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: cfg.color }}
                          >
                            {plan.network.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{plan.size}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                {plan.type}
                              </span>
                              {plan.popular && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{plan.validity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-emerald-700">{formatNaira(plan.price)}</p>
                          <ChevronDown size={16} className="ml-auto text-gray-300 rotate-[-90deg] group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })
            )}
          </div>
        </>
      ) : (
        /* Airtime Top-Up */
        <div className="space-y-6">
          {/* Amount Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[100, 200, 300, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAirtimeAmount(amt.toString())}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    airtimeAmount === amt.toString()
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 text-gray-700 hover:border-gray-200"
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={airtimeAmount}
              onChange={(e) => setAirtimeAmount(e.target.value)}
              placeholder="Or enter custom amount"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-lg font-semibold"
            />
          </div>

          {/* Network Selection for Airtime */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(NETWORK_CONFIGS) as [Network, typeof NETWORK_CONFIGS[Network]][]).map(([net, cfg]) => (
                <button
                  key={net}
                  onClick={() => setSelectedNetwork(net === selectedNetwork ? null : net)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedNetwork === net
                      ? "border-emerald-500 shadow-md"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                  style={{ backgroundColor: selectedNetwork === net ? cfg.bgColor : "white" }}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {net.slice(0, 2)}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">{cfg.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discount Info */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold text-blue-800 mb-1">💰 Cashback Available</p>
            <p className="text-xs text-blue-600">
              Get up to 2% cashback on airtime purchases above ₦500
            </p>
          </div>

          <button
            onClick={handleBuyAirtime}
            disabled={!phone || !airtimeAmount || parseInt(airtimeAmount) < 50}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-base hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
          >
            Buy Airtime
          </button>
        </div>
      )}
    </div>
  );
}
