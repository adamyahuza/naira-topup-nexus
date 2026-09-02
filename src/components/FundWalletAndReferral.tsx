import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Copy, Check, QrCode,
  History, TrendingUp, Gift, ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatNaira } from "../data/mockData";

const FUND_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function FundWalletAndReferral() {
  const {
    walletBalance, transactions, user, fundWallet, setActiveTab,
  } = useApp();

  const [fundAmount, setFundAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"fund" | "history">("fund");

  const handleFund = () => {
    const amt = parseInt(fundAmount);
    if (!amt || amt < 100) return;
    fundWallet(amt);
    setFundAmount("");
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-8 pt-4 space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab("wallet")}
          className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
        >
          <ArrowUpRight size={20} />
          Fund Wallet
        </button>
        <button
          onClick={() => setActiveTab("wallet")}
          className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white border-2 border-gray-100 text-gray-700 font-semibold hover:border-gray-200 transition-all"
        >
          <History size={20} />
          Transactions
        </button>
      </div>

      {/* Fund Wallet Section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveSubTab("fund")}
            className={`flex-1 py-3 text-sm font-semibold ${
              activeSubTab === "fund" ? "text-emerald-700 border-b-2 border-emerald-500" : "text-gray-500"
            }`}
          >
            Fund Wallet
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex-1 py-3 text-sm font-semibold ${
              activeSubTab === "history" ? "text-emerald-700 border-b-2 border-emerald-500" : "text-gray-500"
            }`}
          >
            Transaction History
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeSubTab === "fund" ? (
            <motion.div
              key="fund"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {FUND_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setFundAmount(amt.toString())}
                      className={`py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                        fundAmount === amt.toString()
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
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Or enter custom amount"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none font-semibold"
                />
              </div>
              <button
                onClick={handleFund}
                disabled={!fundAmount || parseInt(fundAmount) < 100}
                className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Fund Wallet
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secure payment via Paystack/Flutterwave
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {transactions.slice().reverse().map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === "wallet_fund" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                        }`}>
                          {tx.type === "wallet_fund" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 capitalize">{tx.type.replace("_", " ")}</p>
                          <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${
                        tx.type === "wallet_fund" ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {tx.type === "wallet_fund" ? "+" : "-"}{formatNaira(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Referral Section */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Gift size={20} />
          <h3 className="font-bold text-lg">Refer & Earn</h3>
        </div>
        <p className="text-sm text-violet-100 mb-4">
          Share your code and earn ₦100 for every friend who funds their wallet!
        </p>
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl p-3">
          <code className="flex-1 text-sm font-mono font-bold">{user.referralCode}</code>
          <button
            onClick={handleCopyReferral}
            className="px-3 py-1.5 bg-white text-violet-700 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-violet-200">
          <TrendingUp size={14} />
          <span>{transactions.filter((t) => t.type === "wallet_fund").length} referrals earned</span>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <QrCode size={24} />
          <div>
            <p className="font-bold">Scan to Pay</p>
            <p className="text-xs text-white/80">Use QR code at any agent point</p>
          </div>
        </div>
      </div>
    </div>
  );
}
