import { describe, it, expect } from 'vitest';
import {
  calculatePnL,
  calculateRiskReward,
  calculateWinRate,
  calculateProfitFactor,
  calculateExpectancy,
  calculateMaxDrawdown,
  getEquityCurveData
} from '../calculations';

describe('Financial Calculations', () => {
  describe('calculatePnL', () => {
    it('calculates profit for a Long trade', () => {
      const trade = {
        direction: 'Long',
        entryPrice: 100,
        exitPrice: 110,
        positionSize: 10
      };
      expect(calculatePnL(trade)).toBe(100);
    });

    it('calculates loss for a Long trade', () => {
      const trade = {
        direction: 'Long',
        entryPrice: 100,
        exitPrice: 90,
        positionSize: 10
      };
      expect(calculatePnL(trade)).toBe(-100);
    });

    it('calculates profit for a Short trade', () => {
      const trade = {
        direction: 'Short',
        entryPrice: 100,
        exitPrice: 90,
        positionSize: 10
      };
      expect(calculatePnL(trade)).toBe(100);
    });

    it('calculates PnL with multiple exit points (Partial Exits)', () => {
      const trade = {
        direction: 'Long',
        entryPrice: 100,
        positionSize: 10,
        exits: [
          { price: 105, percentage: 50 }, // 5 units @ 5 profit = 25
          { price: 110, percentage: 50 }  // 5 units @ 10 profit = 50
        ]
      };
      expect(calculatePnL(trade)).toBe(75);
    });

    it('handles remaining percentage with final exit price', () => {
      const trade = {
        direction: 'Long',
        entryPrice: 100,
        positionSize: 10,
        exitPrice: 120, // Final exit for remaining
        exits: [
          { price: 110, percentage: 50 } // 5 units @ 10 profit = 50
        ]
        // Remaining 50% (5 units) @ 20 profit = 100
      };
      expect(calculatePnL(trade)).toBe(150);
    });
  });

  describe('calculateRiskReward', () => {
    it('calculates R:R for a Long trade', () => {
      const trade = {
        direction: 'Long',
        entryPrice: 100,
        stopLoss: 90,   // Risk = 10
        takeProfit: 130 // Reward = 30
      };
      expect(calculateRiskReward(trade)).toBe("3.00");
    });

    it('calculates R:R for a Short trade', () => {
      const trade = {
        direction: 'Short',
        entryPrice: 100,
        stopLoss: 110,  // Risk = 10
        takeProfit: 80  // Reward = 20
      };
      expect(calculateRiskReward(trade)).toBe("2.00");
    });
  });

  describe('Portfolio Metrics', () => {
    const mockTrades = [
      { outcome: 'Win', pnl: 200 },
      { outcome: 'Loss', pnl: -100 },
      { outcome: 'Win', pnl: 150 },
      { outcome: 'Loss', pnl: -50 },
      { outcome: 'Win', pnl: 300 }
    ];

    it('calculates win rate correctly', () => {
      expect(calculateWinRate(mockTrades)).toBe("60.0");
    });

    it('calculates profit factor correctly', () => {
      // Gross Profit = 200 + 150 + 300 = 650
      // Gross Loss = 100 + 50 = 150
      // PF = 650 / 150 = 4.33
      expect(calculateProfitFactor(mockTrades)).toBe("4.33");
    });

    it('calculates expectancy correctly', () => {
      // Win Rate = 0.6
      // Avg Win = 650 / 3 = 216.67
      // Avg Loss = 150 / 2 = 75
      // Expectancy = (0.6 * 216.67) - (0.4 * 75) = 130 - 30 = 100
      expect(calculateExpectancy(mockTrades)).toBe("100.00");
    });
  });

  describe('Drawdown and Equity', () => {
    const trades = [
      { date: '2023-01-01', pnl: 500 },
      { date: '2023-01-02', pnl: -200 },
      { date: '2023-01-03', pnl: -400 }, // Balance goes 10000 -> 10500 -> 10300 -> 9900
      { date: '2023-01-04', pnl: 800 }   // 9900 -> 10700
    ];
    const initialBalance = 10000;

    it('calculates max drawdown correctly', () => {
      // Peak was 10500
      // Trough after peak was 9900
      // Drawdown = 10500 - 9900 = 600
      // Percentage = (600 / 10500) * 100 = 5.714...
      const mdd = calculateMaxDrawdown(trades, initialBalance);
      expect(mdd.amount).toBe("600.00");
      expect(mdd.percentage).toBe("5.71");
    });

    it('generates equity curve data correctly', () => {
      const curve = getEquityCurveData(trades, initialBalance);
      expect(curve).toHaveLength(5); // Initial + 4 trades
      expect(curve[0].balance).toBe(10000);
      expect(curve[1].balance).toBe(10500);
      expect(curve[2].balance).toBe(10300);
      expect(curve[3].balance).toBe(9900);
      expect(curve[4].balance).toBe(10700);
    });
  });
});
