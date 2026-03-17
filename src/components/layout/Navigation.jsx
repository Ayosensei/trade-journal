import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  List,
  BarChart3,
  Target,
  Settings,
} from "lucide-react";

/**
 * Navigation Component - Floating Technical Dock
 * Implements a glassmorphism floating bar with technical minimalism.
 */
const Navigation = ({ activeTab = "dashboard", onTabChange }) => {
  const mainTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, key: "D" },
    { id: "daily-journal", label: "Journal", icon: BookOpen, key: "J" },
    { id: "trade-log", label: "Ledger", icon: List, key: "L" },
    { id: "analysis", label: "Analysis", icon: BarChart3, key: "A" },
  ];

  const secondaryTabs = [
    { id: "goals", label: "Goals", icon: Target },
    { id: "settings", label: "Config", icon: Settings },
  ];

  const TabButton = ({ tab, isActive }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={() => onTabChange(tab.id)}
        className={`nav-item group relative px-3 py-2 sm:px-4 ${
          isActive ? "nav-item-active" : "hover:bg-white/[0.02]"
        }`}
      >
        <div className="relative flex items-center gap-2.5">
          <Icon
            size={14}
            className={`${
              isActive
                ? "text-blue-400"
                : "text-slate-500 group-hover:text-slate-300 transition-colors"
            }`}
          />
          <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.1em]">
            {tab.label}
          </span>
          {tab.key && (
            <span className="hidden lg:block text-[8px] text-slate-600 font-mono ml-1 opacity-40 group-hover:opacity-100 transition-opacity">
              {tab.key}
            </span>
          )}
        </div>

        {/* Underline Indicator with Glow */}
        {isActive && (
          <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] rounded-full" />
        )}
      </button>
    );
  };

  return (
    <div className="sticky top-[72px] z-40 w-full flex justify-center py-4 pointer-events-none px-4">
      <nav className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl bg-slate-950/40 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-x-auto max-w-full custom-scrollbar">
        {/* Core Operational Tabs */}
        <div className="flex items-center gap-1">
          {mainTabs.map((tab) => (
            <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} />
          ))}
        </div>

        {/* Technical Separator */}
        <div className="w-px h-4 bg-white/10 mx-2 flex-shrink-0" />

        {/* Configuration Tabs */}
        <div className="flex items-center gap-1">
          {secondaryTabs.map((tab) => (
            <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} />
          ))}
        </div>

        {/* Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 pl-4 pr-3 ml-2 border-l border-white/10">
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest data-mono">
            System.Active
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
