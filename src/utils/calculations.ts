import { Trade, Direction, Outcome } from "../types";

/**
 * Calculate profit/loss for a trade
 * @param {Trade} trade - Trade object
 * @returns {number} P/L amount
 */
export const calculatePnL = (trade: Trade): number => {
  if (!trade.entryPrice || !trade.positionSize) {
    return 0;
  }

  const { entryPrice, positionSize, direction } = trade;

  // Handle multiple exits if present
  if (trade.exits && trade.exits.length > 0) {
    let totalPnL = 0;
    let totalExitPercentage = 0;

    trade.exits.forEach((exit) => {
      const portionSize = positionSize * (exit.percentage / 100);
      const exitPnL =
        direction === "Long"
          ? (exit.price - entryPrice) * portionSize
          : (entryPrice - exit.price) * portionSize;
      totalPnL += exitPnL;
      totalExitPercentage += exit.percentage;
    });

    // If there's a final exit price and some percentage left
    const remainingPercentage = 100 - totalExitPercentage;
    if (remainingPercentage > 0 && trade.exitPrice) {
      const portionSize = positionSize * (remainingPercentage / 100);
      const finalPnL =
        direction === "Long"
          ? (trade.exitPrice - entryPrice) * portionSize
          : (entryPrice - trade.exitPrice) * portionSize;
      totalPnL += finalPnL;
    }

    return totalPnL;
  }

  // Fallback to single exit price
  if (!trade.exitPrice) return 0;

  if (direction === "Long") {
    return (trade.exitPrice - entryPrice) * positionSize;
  } else {
    return (entryPrice - trade.exitPrice) * positionSize;
  }
};

/**
 * Calculate risk-reward ratio
 * @param {Partial<Trade>} trade - Trade object
 * @returns {string | number} R:R ratio
 */
export const calculateRiskReward = (trade: Partial<Trade>): string | number => {
  if (!trade.entryPrice || !trade.stopLoss || !trade.takeProfit) {
    return 0;
  }

  const { entryPrice, stopLoss, takeProfit, direction } = trade;

  let risk, reward;

  if (direction === "Long") {
    risk = Math.abs(entryPrice - stopLoss);
    reward = Math.abs(takeProfit - entryPrice);
  } else {
    risk = Math.abs(stopLoss - entryPrice);
    reward = Math.abs(entryPrice - takeProfit);
  }

  return risk > 0 ? (reward / risk).toFixed(2) : 0;
};

/**
 * Calculate win rate from trades
 * @param {Trade[]} trades - Array of trade objects
 * @returns {string} Win rate percentage
 */
export const calculateWinRate = (trades: Trade[]): string => {
  if (!trades || trades.length === 0) return "0";

  const wins = trades.filter((t) => t.outcome === "Win").length;
  return ((wins / trades.length) * 100).toFixed(1);
};

/**
 * Calculate average win amount
 * @param {Trade[]} trades - Array of trade objects
 * @returns {number} Average win
 */
export const calculateAverageWin = (trades: Trade[]): number => {
  if (!trades || trades.length === 0) return 0;

  const winningTrades = trades.filter((t) => t.outcome === "Win");
  if (winningTrades.length === 0) return 0;

  const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  return totalWins / winningTrades.length;
};

/**
 * Calculate average loss amount
 * @param {Trade[]} trades - Array of trade objects
 * @returns {number} Average loss
 */
export const calculateAverageLoss = (trades: Trade[]): number => {
  if (!trades || trades.length === 0) return 0;

  const losingTrades = trades.filter((t) => t.outcome === "Loss");
  if (losingTrades.length === 0) return 0;

  const totalLosses = losingTrades.reduce(
    (sum, t) => sum + Math.abs(t.pnl || 0),
    0,
  );
  return totalLosses / losingTrades.length;
};

/**
 * Calculate net P/L from all trades
 * @param {Trade[]} trades - Array of trade objects
 * @returns {number} Total P/L
 */
export const calculateNetPnL = (trades: Trade[]): number => {
  if (!trades || trades.length === 0) return 0;

  return trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
};

/**
 * Calculate average risk-reward ratio
 * @param {Trade[]} trades - Array of trade objects
 * @returns {string} Average R:R
 */
export const calculateAverageRR = (trades: Trade[]): string => {
  if (!trades || trades.length === 0) return "0.00";

  const validTrades = trades.filter((t) => t.riskReward && t.riskReward > 0);
  if (validTrades.length === 0) return "0.00";

  const totalRR = validTrades.reduce((sum, t) => sum + (t.riskReward || 0), 0);
  return (totalRR / validTrades.length).toFixed(2);
};

/**
 * Get equity curve data for charting
 * @param {Trade[]} trades - Array of trade objects
 * @param {number} initialBalance - Starting account balance
 * @returns {Array} Array of {date, balance} objects
 */
export const getEquityCurveData = (
  trades: Trade[],
  initialBalance: number = 0,
): { date: string; balance: number }[] => {
  if (!trades || trades.length === 0) {
    return [{ date: new Date().toISOString(), balance: initialBalance }];
  }

  // Sort trades by date
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let runningBalance = initialBalance;
  const curveData = [{ date: sortedTrades[0].date, balance: initialBalance }];

  sortedTrades.forEach((trade) => {
    runningBalance += trade.pnl || 0;
    curveData.push({
      date: trade.date,
      balance: runningBalance,
    });
  });

  return curveData;
};

/**
 * Get drawdown curve data for charting
 * @param {Trade[]} trades - Array of trade objects
 * @param {number} initialBalance - Starting account balance
 * @returns {Array} Array of {date, drawdownPercent} objects
 */
export const getDrawdownCurveData = (
  trades: Trade[],
  initialBalance: number = 0,
): { date: string; drawdown: number }[] => {
  if (!trades || trades.length === 0) {
    return [{ date: new Date().toISOString(), drawdown: 0 }];
  }

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let runningBalance = initialBalance;
  let peak = initialBalance;
  const drawdownData = [{ date: sortedTrades[0].date, drawdown: 0 }];

  sortedTrades.forEach((trade) => {
    runningBalance += trade.pnl || 0;
    if (runningBalance > peak) {
      peak = runningBalance;
    }

    const drawdownAmount = peak - runningBalance;
    const drawdownPercent = peak > 0 ? (drawdownAmount / peak) * 100 : 0;

    drawdownData.push({
      date: trade.date,
      drawdown: parseFloat(drawdownPercent.toFixed(2)),
    });
  });

  return drawdownData;
};

/**
 * Get calendar heatmap data
 * @param {Trade[]} trades - Array of trade objects
 * @returns {Object} { date: pnl } mapping
 */
export const getCalendarHeatmapData = (
  trades: Trade[],
): Record<string, number> => {
  if (!trades || trades.length === 0) return {};

  return trades.reduce(
    (acc, trade) => {
      const date = trade.date.split("T")[0];
      acc[date] = (acc[date] || 0) + (trade.pnl || 0);
      return acc;
    },
    {} as Record<string, number>,
  );
};

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value: number, currencySymbol: string = "$"): string => {
  if (value === null || value === undefined) return `${currencySymbol}0.00`;

  const formatted = Math.abs(value).toFixed(2);
  const sign = value >= 0 ? "+" : "-";

  return `${sign}${currencySymbol}${formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

/**
 * Format percentage value
 * @param {number} value - Numeric value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return "0%";

  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
};

/**
 * Calculate current win/loss streak
 * @param {Trade[]} trades - Array of trade objects
 * @returns {Object} {type: 'win'|'loss'|'none', count: number}
 */
export const calculateCurrentStreak = (
  trades: Trade[],
): { type: "win" | "loss" | "none"; count: number } => {
  if (!trades || trades.length === 0) return { type: "none", count: 0 };

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const lastOutcome = sortedTrades[0].outcome;

  let count = 0;
  for (const trade of sortedTrades) {
    if (trade.outcome === lastOutcome) {
      count++;
    } else {
      break;
    }
  }

  return {
    type:
      lastOutcome === "Win" ? "win" : lastOutcome === "Loss" ? "loss" : "none",
    count,
  };
};

/**
 * Calculate profit factor
 * @param {Trade[]} trades - Array of trade objects
 * @returns {string} Profit factor
 */
export const calculateProfitFactor = (trades: Trade[]): string => {
  if (!trades || trades.length === 0) return "0.00";

  const grossProfit = trades
    .filter((t) => t.pnl > 0)
    .reduce((sum, t) => sum + (t.pnl || 0), 0);

  const grossLoss = Math.abs(
    trades
      .filter((t) => (t.pnl || 0) < 0)
      .reduce((sum, t) => sum + (t.pnl || 0), 0),
  );

  return grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : "0.00";
};

/**
 * Calculate expectancy
 * @param {Trade[]} trades - Array of trade objects
 * @returns {string} Expectancy per trade
 */
export const calculateExpectancy = (trades: Trade[]): string => {
  if (!trades || trades.length === 0) return "0.00";

  const winRate = parseFloat(calculateWinRate(trades)) / 100;
  const avgWin = calculateAverageWin(trades);
  const avgLoss = calculateAverageLoss(trades);

  return (winRate * avgWin - (1 - winRate) * avgLoss).toFixed(2);
};

/**
 * Calculate maximum drawdown
 * @param {Trade[]} trades - Array of trade objects
 * @param {number} initialBalance - Starting balance
 * @returns {Object} {amount: string, percentage: string}
 */
export const calculateMaxDrawdown = (
  trades: Trade[],
  initialBalance: number = 0,
): { amount: string; percentage: string } => {
  if (!trades || trades.length === 0)
    return { amount: "0.00", percentage: "0.00" };

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let peak = initialBalance;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let currentBalance = initialBalance;

  sortedTrades.forEach((trade) => {
    currentBalance += trade.pnl || 0;

    if (currentBalance > peak) {
      peak = currentBalance;
    }

    const drawdown = peak - currentBalance;
    const drawdownPercent = peak > 0 ? (drawdown / peak) * 100 : 0;

    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
    if (drawdownPercent > maxDrawdownPercent) {
      maxDrawdownPercent = drawdownPercent;
    }
  });

  return {
    amount: maxDrawdown.toFixed(2),
    percentage: maxDrawdownPercent.toFixed(2),
  };
};

/**
 * Get monthly performance breakdown
 * @param {Trade[]} trades - Array of trade objects
 * @returns {Array} Array of {month, pnl, tradeCount, winRate}
 */
export const getMonthlyPerformance = (
  trades: Trade[],
): { month: string; pnl: number; tradeCount: number; winRate: string }[] => {
  if (!trades || trades.length === 0) return [];

  const monthlyData: Record<
    string,
    { month: string; pnl: number; trades: Trade[] }
  > = {};

  trades.forEach((trade) => {
    const date = new Date(trade.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        pnl: 0,
        trades: [],
      };
    }

    monthlyData[monthKey].pnl += trade.pnl || 0;
    monthlyData[monthKey].trades.push(trade);
  });

  return Object.values(monthlyData)
    .map((month) => ({
      month: month.month,
      pnl: month.pnl,
      tradeCount: month.trades.length,
      winRate: calculateWinRate(month.trades),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

/**
 * Get weekday distribution
 * @param {Trade[]} trades - Array of trade objects
 * @returns {Array} Array of {day, tradeCount, pnl, winRate}
 */
export const getWeekdayDistribution = (
  trades: Trade[],
): {
  day: string;
  tradeCount: number;
  pnl: string;
  winRate: string | number;
}[] => {
  if (!trades || trades.length === 0) return [];

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekdayData = weekdays.map((day) => ({
    day,
    trades: [] as Trade[],
    pnl: 0,
  }));

  trades.forEach((trade) => {
    const dayIndex = new Date(trade.date).getDay();
    weekdayData[dayIndex].trades.push(trade);
    weekdayData[dayIndex].pnl += trade.pnl || 0;
  });

  return weekdayData
    .map((day) => ({
      day: day.day,
      tradeCount: day.trades.length,
      pnl: day.pnl.toFixed(2),
      winRate: day.trades.length > 0 ? calculateWinRate(day.trades) : 0,
    }))
    .filter((day) => day.tradeCount > 0);
};
