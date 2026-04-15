import React, { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Zap,
  Activity,
  Layers,
  Shield,
  Cpu,
  Globe,
} from "lucide-react";
import { useTradeContext } from "../context/TradeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  calculateCurrentStreak,
  calculateProfitFactor,
  calculateExpectancy,
  calculateMaxDrawdown,
  getMonthlyPerformance,
  getWeekdayDistribution,
  getEquityCurveData,
  getDrawdownCurveData,
  formatCurrency,
} from "../utils/calculations";
import CalendarHeatmap from "../components/charts/CalendarHeatmap";

/**
 * Analysis Page - Technical Intelligence Dashboard
 * High-density modular layout with glassmorphism and technical minimalism.
 */
const Analysis = () => {
  const { getAccountTrades, selectedAccount, currencySymbol } = useTradeContext();
  const trades = useMemo(() => getAccountTrades(), [getAccountTrades]);
  const initialBalance = selectedAccount?.initialBalance || 0;

  // Analytical Data Aggregation
  const equityData = useMemo(() => getEquityCurveData(trades, initialBalance), [trades, initialBalance]);
  const drawdownData = useMemo(() => getDrawdownCurveData(trades, initialBalance), [trades, initialBalance]);

  const pairData = useMemo(() => {
    const performance = trades.reduce((acc, trade) => {
      const asset = trade.asset || "Unknown";
      if (!acc[asset]) acc[asset] = { pair: asset, wins: 0, losses: 0, totalPnL: 0, count: 0 };
      acc[asset].count++;
      acc[asset].totalPnL += trade.pnl || 0;
      if (trade.outcome === "Win") acc[asset].wins++;
      else if (trade.outcome === "Loss") acc[asset].losses++;
      return acc;
    }, {});

    return Object.values(performance)
      .map((p) => ({
        ...p,
        winRate: p.count > 0 ? ((p.wins / p.count) * 100).toFixed(1) : "0.0"
      }))
      .sort((a, b) => b.totalPnL - a.totalPnL);
  }, [trades]);

  const hourlyData = useMemo(() => {
    const data = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, trades: 0 }));
    trades.forEach((trade) => {
      const hour = new Date(trade.date).getHours();
      data[hour].trades++;
    });
    return data.filter((h) => h.trades > 0);
  }, [trades]);

  const metrics = useMemo(() => ({
    streak: calculateCurrentStreak(trades),
    profitFactor: calculateProfitFactor(trades),
    expectancy: calculateExpectancy(trades),
    maxDrawdown: calculateMaxDrawdown(trades, initialBalance),
    monthly: getMonthlyPerformance(trades),
    weekday: getWeekdayDistribution(trades),
  }), [trades, initialBalance]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-slate-950/90 border border-white/10 p-3 rounded-lg shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
            Temporal Node // {new Date(label).toLocaleDateString()}
          </p>
          <p className="text-sm font-bold data-mono" style={{ color: payload[0].color }}>
            {payload[0].name}: {payload[0].name.includes("Drawdown") ? `${payload[0].value}%` : formatCurrency(payload[0].value, currencySymbol)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 pb-24">
      {/* Header Intelligence Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Cpu className="text-blue-500" size={20} />
            Quant Intelligence
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Trade Analytics // Account_{selectedAccount?.id.slice(0,4).toUpperCase() || 'NULL'}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Status</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-300 data-mono uppercase">Data_Synced</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Encryption</span>
            <span className="text-xs font-bold text-slate-300 data-mono uppercase tracking-tighter">AES-256_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* KPI Grid - Minimalist High Contrast */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalysisMetric
          label="Trading Volume"
          value={trades.length}
          icon={Activity}
          sub="Total Trades"
          accent="blue"
        />
        <AnalysisMetric
          label="Winning Streak"
          value={`${metrics.streak.count} ${metrics.streak.type.toUpperCase()}`}
          icon={Zap}
          sub="Current Momentum"
          accent={metrics.streak.type === 'win' ? 'emerald' : 'rose'}
        />
        <AnalysisMetric
          label="Profit Factor"
          value={metrics.profitFactor}
          icon={Target}
          sub="Efficiency Ratio"
          accent={parseFloat(metrics.profitFactor) >= 1.5 ? 'emerald' : 'amber'}
        />
        <AnalysisMetric
          label="Max Drawdown"
          value={`${metrics.maxDrawdown.percentage}%`}
          icon={TrendingDown}
          sub="Risk Exposure"
          accent="rose"
        />
      </div>

      {/* Primary Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-0 overflow-hidden group border-white/5 bg-slate-950/20">
          <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <TrendingUp size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Equity Growth</span>
            </div>
            <span className="text-[9px] font-mono text-slate-600">SOURCE: RAW_LEDGER_DATA</span>
          </div>
          <div className="h-[280px] w-full p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="anEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#475569" fontSize={9} fontFamily="JetBrains Mono" tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="balance" name="Equity" stroke="#10b981" strokeWidth={2} fill="url(#anEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-0 overflow-hidden group border-white/5 bg-slate-950/20">
          <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Shield size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Risk Variance</span>
            </div>
            <span className="text-[9px] font-mono text-slate-600">TYPE: PEAK_TROUGH_DD</span>
          </div>
          <div className="h-[280px] w-full p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={drawdownData}>
                <defs>
                  <linearGradient id="anDrawdown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#475569" fontSize={9} fontFamily="JetBrains Mono" reversed tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="drawdown" name="Drawdown" stroke="#f43f5e" strokeWidth={2} fill="url(#anDrawdown)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Matrix Section */}
      <div className="card relative overflow-hidden border-white/5 bg-slate-950/20">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none text-white">
          <Globe size={160} />
        </div>
        <CalendarHeatmap trades={trades} />
      </div>

      {/* Asset Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pair Performance Table (High Density) */}
        <div className="lg:col-span-2 card p-0 overflow-hidden border-white/5 bg-slate-950/20">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Layers size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Asset Matrix</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header-cell text-left">Entity</th>
                  <th className="table-header-cell text-center">Velocity</th>
                  <th className="table-header-cell text-center">Accuracy</th>
                  <th className="table-header-cell text-right">Net_Return</th>
                </tr>
              </thead>
              <tbody>
                {pairData.length > 0 ? pairData.map((asset, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="table-data-cell">
                      <span className="font-bold text-white data-mono tracking-tighter uppercase">{asset.pair}</span>
                    </td>
                    <td className="table-data-cell text-center">
                      <span className="text-slate-400 data-mono">{asset.count}</span>
                    </td>
                    <td className="table-data-cell">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`text-[11px] font-black data-mono ${parseFloat(asset.winRate) >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {asset.winRate}%
                        </span>
                        <div className="w-16 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${parseFloat(asset.winRate) >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${asset.winRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="table-data-cell text-right">
                      <span className={`font-bold data-mono ${asset.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(asset.totalPnL, currencySymbol)}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-600 text-xs uppercase tracking-widest">
                      Null_Data_Set
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Temporal Distribution (Small) */}
        <div className="card p-0 overflow-hidden border-white/5 bg-slate-950/20">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node_Timing</span>
            </div>
          </div>
          <div className="p-6 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="hour" stroke="#475569" fontSize={8} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="trades" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="px-6 pb-6 pt-2">
            <p className="text-[8px] font-bold text-slate-600 uppercase leading-relaxed">
              Execution frequency distribution by hour. Data used to optimize trading window synchronization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for small high-precision metrics
const AnalysisMetric = ({ label, value, icon: Icon, sub, accent }) => {
  const accentStyles = {
    blue: "border-blue-500/30 text-blue-400 bg-blue-500/10 dot-blue",
    emerald: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 dot-emerald",
    rose: "border-rose-500/30 text-rose-400 bg-rose-500/10 dot-rose",
    amber: "border-amber-500/30 text-amber-400 bg-amber-500/10 dot-amber",
  };

  const dotColors = {
    blue: "bg-blue-500 shadow-blue-500/50",
    emerald: "bg-emerald-500 shadow-emerald-500/50",
    rose: "bg-rose-500 shadow-rose-500/50",
    amber: "bg-amber-500 shadow-amber-500/50",
  }

  const currentStyle = accentStyles[accent] || accentStyles.blue;
  const currentDot = dotColors[accent] || dotColors.blue;

  return (
    <div className={`card relative overflow-hidden group border-l-2 ${currentStyle.split(' ')[0]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-1.5 rounded border border-white/5 ${currentStyle.split(' ').slice(1, 3).join(' ')}`}>
          <Icon size={12} />
        </div>
        <div className={`w-1 h-1 rounded-full ${currentDot} animate-pulse shadow-[0_0_8px]`} />
      </div>
      <div className="space-y-0.5">
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 group-hover:text-slate-400 transition-colors">
          {label}
        </p>
        <p className={`text-xl font-bold data-mono tracking-tighter text-white`}>
          {value}
        </p>
        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
          {sub}
        </p>
      </div>
    </div>
  );
};

export default Analysis;
