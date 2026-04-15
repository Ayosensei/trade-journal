import React, { useState } from "react";
import {
  DollarSign,
  Target,
  Repeat,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import MetricCard from "../components/dashboard/MetricCard";
import AccountCard from "../components/dashboard/AccountCard";
import EquityChart from "../components/dashboard/EquityChart";
import { useTradeContext } from "../context/TradeContext";
import {
  calculateNetPnL,
  calculateWinRate,
  calculateAverageRR,
  calculateAverageWin,
  calculateAverageLoss,
  getEquityCurveData,
  formatCurrency,
} from "../utils/calculations";

const Dashboard = () => {
  const { selectedAccount, getAccountTrades, accounts, switchAccount, currencySymbol } =
    useTradeContext();
  const trades = getAccountTrades();

  // State for the technical checklist
  const [activeChecklist, setActiveTab] = useState("pre");

  // Calculate metrics
  const netPnL = calculateNetPnL(trades);
  const winRate = calculateWinRate(trades);
  const avgRR = calculateAverageRR(trades);
  const avgWin = calculateAverageWin(trades);
  const avgLoss = calculateAverageLoss(trades);
  const totalTrades = trades.length;

  // Get equity curve data
  const equityData = getEquityCurveData(
    trades,
    selectedAccount?.initialBalance || 0,
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 pb-24">
      {/* Welcome Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Command Center
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded tracking-widest animate-pulse">
              LIVE_FEED
            </span>
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
            Aggregated Portfolio Intelligence //{" "}
            {selectedAccount?.name || "Global"}
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-blue-500" />
            <span className="data-mono text-slate-400">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-slate-400">Data_Secure</span>
          </div>
        </div>
      </div>

      {/* Entity Selection (Accounts) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            isActive={account.id === selectedAccount?.id}
            onClick={() => switchAccount(account.id)}
          />
        ))}
      </div>

      {/* High-Precision Metrics Layer */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Net Flow"
          value={formatCurrency(netPnL, currencySymbol)}
          type={netPnL >= 0 ? "positive" : "negative"}
          subtitle="Cumulative P&L"
        />
        <MetricCard
          icon={Target}
          label="Accuracy"
          value={`${winRate}%`}
          subtitle={`${trades.filter((t) => t.outcome === "Win").length} of ${totalTrades} Trades`}
          type="neutral"
        />
        <MetricCard
          icon={Repeat}
          label="Efficiency"
          value={`${avgRR}R`}
          subtitle="Avg Risk:Reward"
          type="neutral"
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg Win"
          value={formatCurrency(avgWin, currencySymbol)}
          type="positive"
          subtitle="Average Winner"
        />
        <MetricCard
          icon={TrendingDown}
          label="Avg Loss"
          value={formatCurrency(avgLoss, currencySymbol)}
          type="negative"
          subtitle="Average Loser"
        />
        <MetricCard
          icon={BarChart3}
          label="Volume"
          value={totalTrades}
          type="neutral"
          subtitle="Total Trades"
        />
      </div>

      {/* Main Visualization & Protocol Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Trajectory (Large) */}
        <div className="lg:col-span-2">
          <EquityChart data={equityData} currentPnL={netPnL} />
        </div>

        {/* Operational Protocols (Checklist) */}
        <div className="card group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={80} />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <CheckCircle size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Trading Checklist
              </h3>
              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5">
                Trading Checklist
              </p>
            </div>
          </div>

          {/* Technical Tabs */}
          <div className="flex gap-1 p-1 bg-slate-950/50 rounded-lg border border-white/5 mb-6">
            {["pre", "mid", "post"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                  activeChecklist === tab
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                {tab === "pre"
                  ? "Pre-Flight"
                  : tab === "mid"
                    ? "Execution"
                    : "Review"}
              </button>
            ))}
          </div>

          {/* Checklist Data */}
          <div className="space-y-4">
            {activeChecklist === "pre" && (
              <>
                <ProtocolItem label="Confirm fundamental calendar alignment" />
                <ProtocolItem label="Verify HTF structural bias" />
                <ProtocolItem label="Sync liquidity zone intersections" />
                <ProtocolItem label="Check correlation matrix variance" />
              </>
            )}
            {activeChecklist === "mid" && (
              <>
                <ProtocolItem label="Validate entry trigger confirmation" />
                <ProtocolItem label="Verify SL/TP hard-stop placement" />
                <ProtocolItem label="Monitor partial exit milestones" />
                <ProtocolItem label="Track news-driven volatility spikes" />
              </>
            )}
            {activeChecklist === "post" && (
              <>
                <ProtocolItem label="Archive chart screenshot metadata" />
                <ProtocolItem label="Synchronize P&L with account master" />
                <ProtocolItem label="Review emotional state variance" />
                <ProtocolItem label="Complete end-of-day journal entry" />
              </>
            )}
          </div>

          {/* Technical Footer */}
          <div className="mt-8 pt-4 border-t border-white/5 text-[8px] font-mono text-slate-700 flex justify-between uppercase">
            <span>Checklist_Active</span>
            <span>Auth: Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal sub-component for checklist items
const ProtocolItem = ({ label }) => (
  <label className="flex items-center gap-3 group cursor-pointer">
    <div className="relative flex items-center justify-center">
      <input
        type="checkbox"
        className="peer appearance-none w-4 h-4 rounded border border-white/10 bg-slate-900 checked:bg-blue-500/20 checked:border-blue-500 transition-all"
      />
      <CheckCircle
        size={10}
        className="absolute text-blue-400 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
      />
    </div>
    <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tight">
      {label}
    </span>
  </label>
);

export default Dashboard;
