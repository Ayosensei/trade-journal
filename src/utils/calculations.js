/**
 * Calculate profit/loss for a trade
 * @param {Object} trade - Trade object
 * @returns {number} P/L amount
 */
export const calculatePnL = (trade) => {
  if (!trade.entryPrice || !trade.exitPrice || !trade.positionSize) {
    return 0;
  }

  const { entryPrice, exitPrice, positionSize, direction } = trade;
  
  if (direction === 'Long') {
    return (exitPrice - entryPrice) * positionSize;
  } else {
    return (entryPrice - exitPrice) * positionSize;
  }
};

/**
 * Calculate risk-reward ratio
 * @param {Object} trade - Trade object
 * @returns {number} R:R ratio
 */
export const calculateRiskReward = (trade) => {
  if (!trade.entryPrice || !trade.stopLoss || !trade.takeProfit) {
    return 0;
  }

  const { entryPrice, stopLoss, takeProfit, direction } = trade;
  
  let risk, reward;
  
  if (direction === 'Long') {
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
 * @param {Array} trades - Array of trade objects
 * @returns {number} Win rate percentage
 */
export const calculateWinRate = (trades) => {
  if (!trades || trades.length === 0) return 0;
  
  const wins = trades.filter(t => t.outcome === 'Win').length;
  return ((wins / trades.length) * 100).toFixed(1);
};

/**
 * Calculate average win amount
 * @param {Array} trades - Array of trade objects
 * @returns {number} Average win
 */
export const calculateAverageWin = (trades) => {
  if (!trades || trades.length === 0) return 0;
  
  const winningTrades = trades.filter(t => t.outcome === 'Win');
  if (winningTrades.length === 0) return 0;
  
  const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  return totalWins / winningTrades.length;
};

/**
 * Calculate average loss amount
 * @param {Array} trades - Array of trade objects
 * @returns {number} Average loss
 */
export const calculateAverageLoss = (trades) => {
  if (!trades || trades.length === 0) return 0;
  
  const losingTrades = trades.filter(t => t.outcome === 'Loss');
  if (losingTrades.length === 0) return 0;
  
  const totalLosses = losingTrades.reduce((sum, t) => sum + Math.abs(t.pnl || 0), 0);
  return totalLosses / losingTrades.length;
};

/**
 * Calculate net P/L from all trades
 * @param {Array} trades - Array of trade objects
 * @returns {number} Total P/L
 */
export const calculateNetPnL = (trades) => {
  if (!trades || trades.length === 0) return 0;
  
  return trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
};

/**
 * Calculate average risk-reward ratio
 * @param {Array} trades - Array of trade objects
 * @returns {number} Average R:R
 */
export const calculateAverageRR = (trades) => {
  if (!trades || trades.length === 0) return 0;
  
  const validTrades = trades.filter(t => t.riskReward && t.riskReward > 0);
  if (validTrades.length === 0) return 0;
  
  const totalRR = validTrades.reduce((sum, t) => sum + parseFloat(t.riskReward), 0);
  return (totalRR / validTrades.length).toFixed(2);
};

/**
 * Get equity curve data for charting
 * @param {Array} trades - Array of trade objects
 * @param {number} initialBalance - Starting account balance
 * @returns {Array} Array of {date, balance} objects
 */
export const getEquityCurveData = (trades, initialBalance = 0) => {
  if (!trades || trades.length === 0) {
    return [{ date: new Date().toISOString(), balance: initialBalance }];
  }
  
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let runningBalance = initialBalance;
  const curveData = [{ date: sortedTrades[0].date, balance: initialBalance }];
  
  sortedTrades.forEach(trade => {
    runningBalance += trade.pnl || 0;
    curveData.push({
      date: trade.date,
      balance: runningBalance,
    });
  });
  
  return curveData;
};

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0.00';
  
  const formatted = Math.abs(value).toFixed(2);
  const sign = value >= 0 ? '+' : '-';
  
  return `${sign}$${formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format percentage value
 * @param {number} value - Numeric value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}%`;
};

/**
 * Calculate current win/loss streak
 * @param {Array} trades - Array of trade objects
 * @returns {Object} {type: 'win'|'loss', count: number}
 */
export const calculateCurrentStreak = (trades) => {
  if (!trades || trades.length === 0) return { type: 'none', count: 0 };
  
  const sortedTrades = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date));
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
    type: lastOutcome === 'Win' ? 'win' : 'loss',
    count
  };
};

/**
 * Calculate profit factor
 * @param {Array} trades - Array of trade objects
 * @returns {number} Profit factor
 */
export const calculateProfitFactor = (trades) => {
  if (!trades || trades.length === 0) return 0;
  
  const grossProfit = trades
    .filter(t => t.pnl > 0)
    .reduce((sum, t) => sum + t.pnl, 0);
    
  const grossLoss = Math.abs(trades
    .filter(t => t.pnl < 0)
    .reduce((sum, t) => sum + t.pnl, 0));
  
  return grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : 0;
};

/**
 * Calculate expectancy
 * @param {Array} trades - Array of trade objects
 * @returns {number} Expectancy per trade
 */
export const calculateExpectancy = (trades) => {
  if (!trades || trades.length === 0) return 0;
  
  const winRate = parseFloat(calculateWinRate(trades)) / 100;
  const avgWin = calculateAverageWin(trades);
  const avgLoss = calculateAverageLoss(trades);
  
  return ((winRate * avgWin) - ((1 - winRate) * avgLoss)).toFixed(2);
};

/**
 * Calculate maximum drawdown
 * @param {Array} trades - Array of trade objects
 * @param {number} initialBalance - Starting balance
 * @returns {Object} {amount: number, percentage: number}
 */
export const calculateMaxDrawdown = (trades, initialBalance = 0) => {
  if (!trades || trades.length === 0) return { amount: 0, percentage: 0 };
  
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let peak = initialBalance;
  let maxDrawdown = 0;
  let currentBalance = initialBalance;
  
  sortedTrades.forEach(trade => {
    currentBalance += trade.pnl || 0;
    
    if (currentBalance > peak) {
      peak = currentBalance;
    }
    
    const drawdown = peak - currentBalance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  const percentage = peak > 0 ? ((maxDrawdown / peak) * 100).toFixed(2) : 0;
  
  return {
    amount: maxDrawdown.toFixed(2),
    percentage
  };
};

/**
 * Get monthly performance breakdown
 * @param {Array} trades - Array of trade objects
 * @returns {Array} Array of {month, pnl, trades, winRate}
 */
export const getMonthlyPerformance = (trades) => {
  if (!trades || trades.length === 0) return [];
  
  const monthlyData = {};
  
  trades.forEach(trade => {
    const date = new Date(trade.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
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
  
  return Object.values(monthlyData).map(month => ({
    month: month.month,
    pnl: month.pnl,
    tradeCount: month.trades.length,
    winRate: calculateWinRate(month.trades),
  })).sort((a, b) => a.month.localeCompare(b.month));
};

/**
 * Get weekday distribution
 * @param {Array} trades - Array of trade objects
 * @returns {Array} Array of {day, trades, pnl, winRate}
 */
export const getWeekdayDistribution = (trades) => {
  if (!trades || trades.length === 0) return [];
  
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayData = weekdays.map(day => ({
    day,
    trades: [],
    pnl: 0,
  }));
  
  trades.forEach(trade => {
    const dayIndex = new Date(trade.date).getDay();
    weekdayData[dayIndex].trades.push(trade);
    weekdayData[dayIndex].pnl += trade.pnl || 0;
  });
  
  return weekdayData.map(day => ({
    day: day.day,
    tradeCount: day.trades.length,
    pnl: day.pnl.toFixed(2),
    winRate: day.trades.length > 0 ? calculateWinRate(day.trades) : 0,
  })).filter(day => day.tradeCount > 0);
};

