import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import NavbarAndWallet from "./components/NavbarAndWallet";
import DataAirtimePurchase from "./components/DataAirtimePurchase";
import FundWalletAndReferral from "./components/FundWalletAndReferral";
import AdminDashboard from "./components/AdminDashboard";

type Tab = "home" | "purchase" | "wallet" | "admin";

function AppContent() {
  const { isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const handleTabChange = (tab: string) => setActiveTab(tab as Tab);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAndWallet activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="pb-24 md:pb-8">
        {activeTab === "home" && <HomeView onNavigate={setActiveTab} />}
        {activeTab === "purchase" && <DataAirtimePurchase />}
        {activeTab === "wallet" && <FundWalletAndReferral />}
        {activeTab === "admin" && isAdmin && <AdminDashboard />}
        {activeTab === "admin" && !isAdmin && (
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
              <p className="text-4xl mb-4">🔒</p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
              <p className="text-gray-500 text-sm">Please contact support to access the admin dashboard.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function HomeView({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 md:p-10 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4">
            ⚡ Instant Delivery
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Affordable Data & Airtime
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-lg mb-6">
            Buy cheap data bundles and airtime for all Nigerian networks. Best prices guaranteed with instant delivery to your phone.
          </p>
          <button
            onClick={() => onNavigate("purchase")}
            className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* Network Cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Choose Your Network</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "MTN", color: "from-yellow-400 to-yellow-500", textColor: "text-yellow-900", sub: "Best deals" },
            { name: "Airtel", color: "from-blue-500 to-blue-600", textColor: "text-white", sub: "Fast data" },
            { name: "Glo", color: "from-green-500 to-green-600", textColor: "text-white", sub: "Cheapest data" },
            { name: "9mobile", color: "from-green-600 to-emerald-700", textColor: "text-white", sub: "Affordable" },
          ].map((net) => (
            <button
              key={net.name}
              onClick={() => onNavigate("purchase")}
              className={`bg-gradient-to-br ${net.color} rounded-2xl p-4 text-left hover:scale-[1.02] transition-transform shadow-md`}
            >
              <p className={`font-extrabold text-lg ${net.textColor}`}>{net.name}</p>
              <p className={`text-xs ${net.textColor} opacity-80 mt-1`}>{net.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Buy Data", icon: "📶", desc: "Starters & SME plans", tab: "purchase" as Tab },
            { label: "Buy Airtime", icon: "📱", desc: "Any network, any amount", tab: "purchase" as Tab },
            { label: "Fund Wallet", icon: "💰", desc: "Add funds instantly", tab: "wallet" as Tab },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.tab)}
              className="bg-white rounded-2xl border border-gray-100 p-4 text-left hover:border-emerald-200 hover:shadow-md transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <p className="font-bold text-gray-900 mt-2">{action.label}</p>
              <p className="text-xs text-gray-500">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Why Yahuza Data Hub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "⚡", title: "Instant Delivery", desc: "Data and airtime delivered within seconds" },
            { icon: "💸", title: "Best Prices", desc: "Cheaper than standard network rates" },
            { icon: "🔒", title: "Secure Payments", desc: "Your transactions are always protected" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}