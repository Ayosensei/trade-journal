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
