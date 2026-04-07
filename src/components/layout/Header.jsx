import React from "react";
import { Plus, ChevronDown, BarChart2, Zap } from "lucide-react";
import Button from "../ui/Button";
import { useTradeContext } from "../../context/TradeContext.jsx";

const Header = ({ onAddTrade, selectedAccount, accounts, onAccountChange }) => {
  const { currencySymbol } = useTradeContext();
  return (
    <header className="glass-header">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
          {/* Logo and Branding with Technical Minimalism */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10">
                <BarChart2 size={20} className="text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                Terminal
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Trade Intelligence System
                </span>
                <span className="text-[9px] text-slate-700">v1.0.4</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Account Insight (Minimalist Data) */}
            {selectedAccount && (
              <div className="hidden lg:flex flex-col items-end px-4 border-r border-white/5 mr-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Live Balance
                </span>
                <span className="text-sm font-bold text-emerald-400 data-mono">
                  {currencySymbol}{selectedAccount.currentBalance.toLocaleString()}
                </span>
              </div>
            )}

            {/* Account Selector - High Tech Style */}
            {accounts && accounts.length > 0 && (
              <div className="relative flex-1 md:flex-none group">
                <select
                  value={selectedAccount?.id || ""}
                  onChange={(e) => onAccountChange(e.target.value)}
                  className="select pr-10 appearance-none w-full md:w-56 text-[11px] font-bold uppercase tracking-wider bg-slate-900/50 hover:bg-slate-800/50 transition-all border-white/5"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      ACQ // {account.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
                  <ChevronDown size={14} />
                </div>
              </div>
            )}

            <Button
              onClick={onAddTrade}
              variant="primary"
              className="flex-1 md:flex-none px-6 py-2.5 shadow-lg shadow-blue-500/10 active:scale-95 transition-transform"
              title="Add New Trade (Shortcut: N)"
            >
              <Plus size={16} className="mr-1" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Execute Trade
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
