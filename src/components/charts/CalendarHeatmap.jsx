import React from "react";
import {
  format,
  eachDayOfInterval,
  subMonths,
  startOfMonth,
  getDay,
} from "date-fns";
import { Activity } from "lucide-react";

/**
 * CalendarHeatmap Component - Technical Activity Matrix
 * Visualizes trading frequency and profitability distribution over a 6-month window.
 * Implements high-precision glassmorphism and technical minimalism.
 */
const CalendarHeatmap = ({ trades = [] }) => {
  // Range definition: Trailing 180 days
  const today = new Date();
  const endDate = today;
  const startDate = subMonths(startOfMonth(today), 5);

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Map PnL data to date keys for O(1) grid lookup
  const pnlMap = trades.reduce((acc, trade) => {
    const d = new Date(trade.date);
    const key = format(d, "yyyy-MM-dd");
    acc[key] = (acc[key] || 0) + (trade.pnl || 0);
    return acc;
  }, {});

  /**
   * Technical Color Calibration
   * Returns Tailwind classes based on financial outcome magnitude.
   */
  const getLevel = (pnl) => {
    if (pnl === undefined) return "bg-white/[0.02] border-white/[0.01]";
    if (Math.abs(pnl) < 0.01) return "bg-slate-800/20 border-white/5";

    if (pnl > 0) {
      if (pnl > 1000)
        return "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] border-emerald-400/50";
      if (pnl > 200) return "bg-emerald-500/60 border-emerald-500/20";
      return "bg-emerald-600/30 border-emerald-600/10";
    } else {
      if (pnl < -1000)
        return "bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)] border-rose-400/50";
      if (pnl < -200) return "bg-rose-500/60 border-rose-500/20";
      return "bg-rose-600/30 border-rose-600/10";
    }
  };

  // Organize linear day array into 7-day week columns (GitHub Matrix Style)
  const weeks = [];
  let currentWeek = Array(7).fill(null);

  allDays.forEach((day) => {
    const dayOfWeek = getDay(day);
    currentWeek[dayOfWeek] = day;

    if (
      dayOfWeek === 6 ||
      day.getTime() === allDays[allDays.length - 1].getTime()
    ) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }
  });

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="w-full space-y-6">
      {/* Header Metadata */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
            <Activity size={12} className="text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">
              Temporal Distribution Matrix
            </span>
            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
              Operational_History // 180_Days_Trailing
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono text-slate-600 uppercase">
            Precision_Grid // Node_Active
          </span>
        </div>
      </div>

      {/* The Matrix Grid */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 min-w-max p-1">
          {/* Weekday Axis */}
          <div className="flex flex-col gap-1.5 justify-between pt-6 pb-1">
            {dayLabels.map((label, i) => (
              <span
                key={i}
                className="text-[8px] text-slate-700 font-black w-3 h-3 flex items-center justify-center tracking-tighter"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Temporal Data Nodes */}
          <div className="flex gap-1.5">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1.5">
                {/* Month Headers (Only show on first week of month) */}
                <div className="h-4 text-[8px] font-black text-slate-700 uppercase tracking-widest">
                  {week.some((d) => d && d.getDate() === 1)
                    ? format(
                        week.find((d) => d && d.getDate() === 1),
                        "MMM",
                      )
                    : weekIdx === 0
                      ? format(
                          week.find((d) => d),
                          "MMM",
                        )
                      : ""}
                </div>

                {/* Daily Status Squares */}
                {week.map((day, dayIdx) => {
                  if (!day) return <div key={dayIdx} className="w-3.5 h-3.5" />;
                  const dateKey = format(day, "yyyy-MM-dd");
                  const pnl = pnlMap[dateKey];

                  return (
                    <div
                      key={dayIdx}
                      className={`w-3.5 h-3.5 rounded-[2px] border transition-all duration-500 hover:scale-125 hover:z-10 cursor-crosshair ${getLevel(pnl)}`}
                      title={`${format(day, "MMM dd, yyyy")}${pnl !== undefined ? `: ${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}` : ": No activity"}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Footer & Legend */}
      <div className="flex items-center justify-between border-t border-white/5 pt-5 px-1">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-slate-800/40 border border-white/5" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.15em]">
              Idle
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-emerald-500/40 border border-emerald-500/20" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.15em]">
              Alpha_Gain
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-rose-500/40 border border-rose-500/20" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.15em]">
              Beta_Loss
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[8px] font-mono text-slate-700 tracking-tighter">
            CALIBRATION: STABLE
          </span>
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping opacity-25" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
