import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Bell, Menu, X, ChevronDown, Plus, ArrowRightLeft, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatNaira, NETWORK_CONFIGS } from "../data/mockData";
import type { Network } from "../types";

export default function NavbarAndWallet({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const { walletBalance, user, isAdmin, logoutAdmin, fundWallet } = useApp();
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const tabs: { key: string; label: string; icon: string }[] = [
    { key: "home", label: "Buy", icon: "🛒" },
    { key: "purchase", label: "Purchase", icon: "📶" },
    { key: "wallet", label: "Wallet", icon: "💰" },
    ...(isAdmin ? [{ key: "admin", label: "Admin", icon: "🔐" }] : []),
  ];

  const handleQuickFund = () => {
    const amt = parseInt(fundAmount) || 0;
    if (amt > 0) {
      fundWallet(amt);
      setShowFundModal(false);
      setFundAmount("");
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Yahuza <span className="text-emerald-600">Data Hub</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors"
            >
              <Wallet size={16} />
              {showBalance ? formatNaira(walletBalance) : "₦****"}
            </button>
            <button
              onClick={() => setShowFundModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Fund</span>
            </button>
            {isAdmin && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
              >
                Exit
              </button>
            )}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {showMobileMenu ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-100 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[56px] transition-colors ${
                activeTab === tab.key ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden fixed inset-x-0 top-14 z-30 bg-white border-b border-gray-100 shadow-lg p-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl mb-3">
                <div>
                  <p className="text-xs text-gray-500">Wallet Balance</p>
                  <p className="text-lg font-bold text-emerald-700">{showBalance ? formatNaira(walletBalance) : "₦****"}</p>
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="text-emerald-600">
                  {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    onTabChange(tab.key);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.key ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                  {tab.key === "home" && (
                    <ArrowRightLeft size={14} className="ml-auto text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fund Wallet Modal */}
      <AnimatePresence>
        {showFundModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFundModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 pb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Fund Wallet</h2>
                <button onClick={() => setShowFundModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Bank Transfer Details</p>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p><span className="font-medium">Bank:</span> Moniepoint MFB</p>
                    <p><span className="font-medium">Account:</span> 7788990011</p>
                    <p><span className="font-medium">Name:</span> Yahuza Data Hub Ltd</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₦)</label>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-lg font-semibold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1000, 2000, 5000, 10000, 20000, 50000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setFundAmount(amt.toString())}
                      className="py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleQuickFund}
                  disabled={!fundAmount || parseInt(fundAmount) <= 0}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Fund My Wallet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
