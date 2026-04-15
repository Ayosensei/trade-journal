import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { TrendingUp, Activity } from "lucide-react";
import { formatCurrency } from "../../utils/calculations";
import { useTradeContext } from "../../context/TradeContext.jsx";

const CustomTooltip = ({ active, payload, currencySymbol }) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-slate-950/80 border border-white/10 p-3 rounded-lg shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
          Trade Details //{" "}
          {format(new Date(payload[0].payload.date), "MMM dd, yyyy")}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <p className="text-sm font-bold text-white data-mono">
            {currencySymbol}
            {payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * EquityChart Component
 * Visualizes account growth with high-precision technical aesthetics.
 */
const EquityChart = ({ data, currentPnL }) => {
  const { currencySymbol } = useTradeContext();
  
  if (!data || data.length === 0) {
    return (
      <div className="card h-[300px] flex flex-col items-center justify-center border-dashed border-white/5 opacity-50">
        <Activity size={32} className="text-slate-700 mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Insufficient Data for Projection
        </p>
      </div>
    );
  }

  const isPositive = currentPnL >= 0;
  const accentColor = isPositive ? "#10b981" : "#f43f5e";

  return (
    <div className="card group relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <TrendingUp size={16} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
              Equity Trajectory
            </h3>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5">
              Cumulative Growth Analysis // Real-time
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Net Performance
          </span>
          <span
            className={`text-lg font-bold data-mono tracking-tighter ${
              isPositive
                ? "text-emerald-400 text-glow-success"
                : "text-rose-400 text-glow-danger"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatCurrency(currentPnL, currencySymbol)}
          </span>
        </div>
      </div>

      <div className="h-[280px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis dataKey="date" hide={true} />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              fontSize={9}
              fontFamily="JetBrains Mono"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `${currencySymbol}${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`
              }
              domain={["auto", "auto"]}
            />
            <Tooltip
              content={<CustomTooltip currencySymbol={currencySymbol} />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={accentColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEquity)"
              animationDuration={1500}
              // Technical glow effect on the line
              style={{
                filter: `drop-shadow(0 0 8px ${accentColor}44)`,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Technical Footer Markers */}
      <div className="mt-4 flex items-center justify-between opacity-30 border-t border-white/5 pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-slate-500 rounded-full" />
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              Live_Sync: Active
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-slate-500 rounded-full" />
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              Precision: 64-bit
            </span>
          </div>
        </div>
        <span className="text-[8px] font-mono text-slate-600">
          Connection_Secure
        </span>
      </div>
    </div>
  );
};

export default EquityChart;
