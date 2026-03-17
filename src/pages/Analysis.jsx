import React, { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  Zap,
  Activity,
  Calendar,
  Layers,
  BarChart as BarChartIcon,
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
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
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

const Analysis = () => {
  const { getAccountTrades, selectedAccount } = useTradeContext();
  const trades = useMemo(() => getAccountTrades(), [getAccountTrades]);

  const initialBalance = selectedAccount?.initialBalance || 0;

  // Memoized Calculations
  const equityData = useMemo(
    () => getEquityCurveData(trades, initialBalance),
    [trades, initialBalance],
  );
  const drawdownData = useMemo(
    () => getDrawdownCurveData(trades, initialBalance),
    [trades, initialBalance],
  );

  const pairPerformance = useMemo(() => {
    return trades.reduce((acc, trade) => {
      const asset = trade.asset || "Unknown";
      if (!acc[asset]) {
        acc[asset] = { pair: asset, wins: 0, losses: 0, totalPnL: 0, count: 0 };
      }
      acc[asset].count++;
      acc[asset].totalPnL += trade.pnl || 0;
      if (trade.outcome === "Win") acc[asset].wins++;
      else if (trade.outcome === "Loss") acc[asset].losses++;
      return acc;
    }, {});
  }, [trades]);

  const pairData = useMemo(
    () =>
      Object.values(pairPerformance)
        .map((p) => ({
          ...p,
          winRate: p.count > 0 ? ((p.wins / p.count) * 100).toFixed(1) : 0,
        }))
        .sort((a, b) => b.totalPnL - a.totalPnL),
    [pairPerformance],
  );

  const hourlyData = useMemo(() => {
    const data = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      trades: 0,
      profit: 0,
    }));

    trades.forEach((trade) => {
      const hour = new Date(trade.date).getHours();
      data[hour].trades++;
      data[hour].profit += trade.pnl || 0;
    });

    return data.filter((h) => h.trades > 0);
  }, [trades]);

  const streak = useMemo(() => calculateCurrentStreak(trades), [trades]);
  const profitFactor = useMemo(() => calculateProfitFactor(trades), [trades]);
  const expectancy = useMemo(() => calculateExpectancy(trades), [trades]);
  const maxDrawdown = useMemo(
    () => calculateMaxDrawdown(trades, initialBalance),
    [trades, initialBalance],
  );
  const monthlyPerformance = useMemo(
    () => getMonthlyPerformance(trades),
    [trades],
  );
  const weekdayDistribution = useMemo(
    () => getWeekdayDistribution(trades),
    [trades],
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-xs text-gray-400 mb-1">
            {new Date(label).toLocaleDateString()}
          </p>
          <p className="text-sm font-bold" style={{ color: payload[0].color }}>
            {payload[0].name}:{" "}
            {payload[0].name.includes("Drawdown")
              ? `${payload[0].value}%`
              : formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Performance Intelligence
        </h2>
        <p className="text-gray-400">
          Deep mathematical insights into your trading edge
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-blue-400" size={18} />
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Total Trades
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{trades.length}</p>
          <p className="text-xs text-gray-500 mt-1">Life-time executions</p>
        </div>

        <div className="card border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-2">
            <Zap
              className={
                streak.type === "win" ? "text-emerald-400" : "text-rose-400"
              }
              size={18}
            />
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Current Streak
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${streak.type === "win" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {streak.count} {streak.type === "win" ? "Wins" : "Losses"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Consecutive outcomes</p>
        </div>

        <div className="card border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-purple-400" size={18} />
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Profit Factor
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${profitFactor >= 2 ? "text-emerald-400" : profitFactor >= 1 ? "text-amber-400" : "text-rose-400"}`}
          >
            {profitFactor}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Gross Gains / Gross Losses
          </p>
        </div>

        <div className="card border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-amber-400" size={18} />
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Expectancy
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${expectancy >= 0 ? "text-emerald-400" : "text-rose-400"}`}
          >
            ${expectancy}
          </p>
          <p className="text-xs text-gray-500 mt-1">Average value per trade</p>
        </div>
      </div>

      {/* Calendar Activity Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-blue-400" size={20} />
          <h3 className="text-lg font-bold text-white">
            Trading Activity Heatmap
          </h3>
        </div>
        <CalendarHeatmap trades={trades} />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-emerald-400" size={20} />
              <h3 className="text-lg font-bold text-white">Equity Growth</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase">
                Net Profit
              </p>
              <p
                className={`text-sm font-bold ${equityData[equityData.length - 1]?.balance - initialBalance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {formatCurrency(
                  equityData[equityData.length - 1]?.balance - initialBalance,
                )}
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis dataKey="date" hide />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) => `$${val / 1000}k`}
                  domain={["auto", "auto"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  name="Account Balance"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drawdown Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingDown className="text-rose-400" size={20} />
              <h3 className="text-lg font-bold text-white">
                Drawdown Exposure
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase">
                Max Drawdown
              </p>
              <p className="text-sm font-bold text-rose-400">
                {maxDrawdown.percentage}%
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={drawdownData}>
                <defs>
                  <linearGradient
                    id="colorDrawdown"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis dataKey="date" hide />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) => `${val}%`}
                  reversed
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="drawdown"
                  name="Drawdown %"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDrawdown)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Asset Performance Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="text-blue-400" size={20} />
          <h3 className="text-lg font-bold text-white">Performance by Asset</h3>
        </div>
        {pairData.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Trading Pair
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">
                    Executions
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">
                    Win Rate
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">
                    Net P/L
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pairData.map((pair, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        {pair.pair}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-300 font-medium">
                      {pair.count}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`text-sm font-bold ${pair.winRate >= 50 ? "text-emerald-400" : "text-rose-400"}`}
                        >
                          {pair.winRate}%
                        </span>
                        <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pair.winRate >= 50 ? "bg-emerald-500" : "bg-rose-500"}`}
                            style={{ width: `${pair.winRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-bold ${pair.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {formatCurrency(pair.totalPnL)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No trade data recorded for this account.
          </div>
        )}
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <BarChartIcon className="text-purple-400" size={20} />
            <h3 className="text-lg font-bold text-white">Monthly Returns</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  cursor={{ fill: "#ffffff05" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="pnl"
                  radius={[4, 4, 0, 0]}
                  fill={(entry) => (entry.pnl >= 0 ? "#10b981" : "#f43f5e")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-amber-400" size={20} />
            <h3 className="text-lg font-bold text-white">Execution by Hour</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  stroke="#64748b"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#ffffff05" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="trades"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Number of Trades"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
