import React from "react";
import { formatCurrency } from "../../utils/calculations";
import { Wallet, Activity, ShieldCheck } from "lucide-react";
import { useTradeContext } from "../../context/TradeContext.jsx";

/**
 * AccountCard Component
 * High-precision technical card with glassmorphism and data-first aesthetics.
 */
const AccountCard = ({ account, isActive = false, onClick }) => {
  const { currencySymbol, currency } = useTradeContext();
  
  if (!account) return null;

  const pnl = account.currentBalance - account.initialBalance;
  const pnlPercentage = ((pnl / account.initialBalance) * 100).toFixed(2);
  const isPositive = pnl >= 0;

  return (
    <div
      onClick={onClick}
      className={`card relative group cursor-pointer overflow-hidden transition-all duration-500 ${
        isActive
          ? "border-blue-500/30 bg-blue-500/[0.04] shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          : "hover:bg-white/[0.03]"
      }`}
    >
      {/* Technical Identity Strip */}
      <div
        className={`absolute top-0 left-0 w-1 h-full transition-all duration-500 ${
          isActive
            ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            : "bg-white/10 group-hover:bg-white/20"
        }`}
      />

      <div className="flex flex-col gap-5 pl-2">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded bg-slate-900 border border-white/5 ${isActive ? "text-blue-400" : "text-slate-600"}`}
            >
              <Wallet size={12} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Entity // {account.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <div
                  className={`w-1 h-1 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-700"}`}
                />
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                  Status: {isActive ? "Operational" : "Idle"}
                </span>
              </div>
            </div>
          </div>

          {isActive && <ShieldCheck size={14} className="text-blue-500/40" />}
        </div>

        {/* Balance Section */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white data-mono tracking-tighter">
              {currencySymbol}
              {account.currentBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 underline decoration-blue-500/20 underline-offset-4">
              {currency}
            </span>
          </div>

          {/* Performance Micro-Metrics */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Activity
                size={10}
                className={isPositive ? "text-emerald-500" : "text-rose-500"}
              />
              <span
                className={`text-[11px] font-bold data-mono ${isPositive ? "text-emerald-400" : "text-rose-400"}`}
              >
                {formatCurrency(pnl, currencySymbol)}
              </span>
            </div>

            <div
              className={`px-1.5 py-0.5 rounded text-[9px] font-black data-mono border transition-colors ${
                isPositive
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {pnlPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Grid Pattern Accents */}
      <div className="absolute top-4 right-4 flex gap-1">
        <div className="w-[2px] h-[2px] bg-white/10" />
        <div className="w-[2px] h-[2px] bg-white/10" />
        <div className="w-[2px] h-[2px] bg-white/10" />
      </div>

      {/* Background Technical Watermark */}
      <div className="absolute -bottom-4 -right-2 text-[48px] font-black text-white/[0.01] pointer-events-none select-none italic group-hover:text-white/[0.02] transition-colors duration-700 uppercase">
        Node_{account.id.slice(0, 4).toUpperCase()}
      </div>
    </div>
  );
};

export default AccountCard;
