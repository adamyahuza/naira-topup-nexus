import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Activity, Users, Settings, Search, CheckCircle, XCircle, Download, TrendingUp, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatNaira, NETWORK_CONFIGS } from "../data/mockData";
import type { Network, TxStatus } from "../types";

const STATUS_OPTIONS = ["Successful", "Pending", "Failed"] as const;

export default function AdminDashboard() {
  const { transactions, user } = useApp();
  const [view, setView] = useState<"overview" | "txns" | "settings">("overview");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [netF, setNetF] = useState("all");

  const filtered = transactions.filter((t) => {
    if (statusF !== "all" && t.status !== statusF) return false;
    if (netF !== "all" && t.network !== netF) return false;
    if (search && !t.recipientPhone.toLowerCase().includes(search.toLowerCase()) && !(t.planDetails || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalRev = transactions.filter((t) => t.status === "Successful").reduce((s, t) => s + t.amount, 0);
  const done = transactions.filter((t) => t.status === "Successful").length;
  const pend = transactions.filter((t) => t.status === "Pending").length;
  const fail = transactions.filter((t) => t.status === "Failed").length;

  const updateStatus = (id: string, st: TxStatus) => console.log(`Update ${id} → ${st}`);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-8 pt-4 space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {([
          { k: "overview" as const, l: "Overview", i: <BarChart3 size={16} /> },
          { k: "txns" as const, l: "Transactions", i: <Activity size={16} /> },
          { k: "settings" as const, l: "Settings", i: <Settings size={16} /> },
        ]).map((v) => (
          <button key={v.k} onClick={() => setView(v.k)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${view === v.k ? "bg-white shadow-sm text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}>
            {v.i}{v.l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {view === "overview" && (
          <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
                <TrendingUp size={20} className="opacity-80 mb-2" /><p className="text-2xl font-bold">{formatNaira(totalRev)}</p><p className="text-xs opacity-80 mt-1">Revenue</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4"><Users size={20} className="text-blue-500 mb-2" /><p className="text-2xl font-bold">{user.name}</p><p className="text-xs text-gray-500 mt-1">Logged In As</p></div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4"><CheckCircle size={20} className="text-purple-500 mb-2" /><p className="text-2xl font-bold">{done}</p><p className="text-xs text-gray-500 mt-1">Completed</p></div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4"><XCircle size={20} className="text-amber-500 mb-2" /><p className="text-2xl font-bold">{pend}</p><p className="text-xs text-gray-500 mt-1">Pending</p></div>
            </div>
            {/* Network Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 mb-4">Network Distribution</h3>
              <div className="space-y-3">
                {(Object.entries(NETWORK_CONFIGS) as [Network, typeof NETWORK_CONFIGS[Network]][]).map(([net, cfg]) => {
                  const n = transactions.filter((t) => t.network === net).length;
                  const pct = transactions.length > 0 ? Math.round((n / transactions.length) * 100) : 0;
                  return (<div key={net}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{cfg.name}</span><span className="text-gray-500">{n} ({pct}%)</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: cfg.color }} /></div></div>);
                })}
              </div>
            </div>
            {/* Recent */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex justify-between mb-4"><h3 className="font-bold">Recent Transactions</h3><button className="text-sm text-emerald-600 font-medium flex items-center gap-1"><Download size={14} /> Export</button></div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.slice(-5).reverse().map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${tx.type === "data" ? "bg-blue-500" : tx.type === "airtime" ? "bg-orange-500" : "bg-green-500"}`}>{tx.type === "data" ? "D" : tx.type === "airtime" ? "A" : "W"}</div>
                      <div><p className="text-sm font-semibold capitalize">{tx.type.replace("_", " ")}</p><p className="text-xs text-gray-500">{tx.recipientPhone}</p></div>
                    </div>
                    <div className="text-right"><p className="font-bold text-sm">{formatNaira(tx.amount)}</p><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tx.status === "Successful" ? "bg-green-100 text-green-700" : tx.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{tx.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TRANSACTIONS */}
        {view === "txns" && (
          <motion.div key="tx" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[200px] relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search phone/description..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 outline-none" /></div>
              <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-emerald-500 outline-none">
                <option value="all">All Status</option>{STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={netF} onChange={(e) => setNetF(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-emerald-500 outline-none">
                <option value="all">All Networks</option>{Object.keys(NETWORK_CONFIGS).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b"><tr><th className="text-left p-3 font-semibold text-gray-600">Date</th><th className="text-left p-3 font-semibold">User</th><th className="text-left p-3 font-semibold">Type</th><th className="text-left p-3 font-semibold">Amount</th><th className="text-left p-3 font-semibold">Status</th><th className="text-left p-3 font-semibold">Actions</th></tr></thead>
                  <tbody>
                    {filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">No transactions found</td></tr> : filtered.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-gray-50/50">
                        <td className="p-3 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="p-3 font-medium">{tx.recipientPhone}</td>
                        <td className="p-3 capitalize">{tx.type.replace("_", " ")}</td>
                        <td className="p-3 font-bold">{formatNaira(tx.amount)}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === "Successful" ? "bg-green-100 text-green-700" : tx.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{tx.status}</span></td>
                        <td className="p-3">
                          <button onClick={() => updateStatus(tx.id, "Successful")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600" title="Complete"><CheckCircle size={16} /></button>
                          <button onClick={() => updateStatus(tx.id, "Failed")} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 ml-1" title="Fail"><XCircle size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {view === "settings" && (
          <motion.div key="st" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Activity size={18} /> Platform Settings</h3>
              {[{ label: "Maintenance Mode", desc: "Temporarily disable purchases" }, { label: "SMS Notifications", desc: "Send SMS for completed transactions" }, { label: "Auto-Process Orders", desc: "Automatically fulfill data/airtime orders" }].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div><p className="font-semibold">{s.label}</p><p className="text-xs text-gray-500">{s.desc}</p></div>
                  <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked={s.label !== "Maintenance Mode"} /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div></label>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <h3 className="font-bold flex items-center gap-2"><ShieldCheck size={18} /> API Configuration</h3>
              <div><label className="block text-sm font-medium mb-1">Paystack Secret Key</label><input type="password" defaultValue="pk_test_xxxxxxxxxxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-emerald-500 outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">VTU Provider URL</label><input type="url" defaultValue="https://api.vtu-provider.com/v1" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-emerald-500 outline-none" /></div>
              <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">Save Configuration</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
