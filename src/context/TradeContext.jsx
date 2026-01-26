import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { calculatePnL, calculateRiskReward } from '../utils/calculations';
import { generateId } from '../utils/helpers';

const TradeContext = createContext();

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTradeContext must be used within a TradeProvider');
  }
  return context;
};

export const TradeProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [trades, setTrades] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [customPairs, setCustomPairs] = useState([]);
  const [customStrategies, setCustomStrategies] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '[]');
    const loadedTrades = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRADES) || '[]');
    const loadedCustomPairs = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_PAIRS) || '[]');
    const loadedSelectedAccount = localStorage.getItem(STORAGE_KEYS.SELECTED_ACCOUNT);

    setAccounts(loadedAccounts);
    setTrades(loadedTrades);
    setCustomPairs(loadedCustomPairs);

    // Set selected account or create default if none exists
    if (loadedAccounts.length > 0) {
      const selected = loadedAccounts.find(acc => acc.id === loadedSelectedAccount) || loadedAccounts[0];
      setSelectedAccount(selected);
    } else {
      // Create default account
      const defaultAccount = {
        id: generateId(),
        name: 'Main Account',
        initialBalance: 10000,
        currentBalance: 10000,
        trades: [],
      };
      setAccounts([defaultAccount]);
      setSelectedAccount(defaultAccount);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    }
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PAIRS, JSON.stringify(customPairs));
  }, [customPairs]);

  useEffect(() => {
    if (selectedAccount) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, selectedAccount.id);
    }
  }, [selectedAccount]);

  // Add a new trade
  const addTrade = (tradeData) => {
    const newTrade = {
      ...tradeData,
      id: generateId(),
      status: tradeData.status || 'executed',
      pnl: tradeData.pnl !== undefined && tradeData.pnl !== '' 
        ? parseFloat(tradeData.pnl) 
        : calculatePnL(tradeData),
      riskReward: tradeData.riskReward !== undefined && tradeData.riskReward !== '' 
        ? parseFloat(tradeData.riskReward) 
        : calculateRiskReward(tradeData),
      date: tradeData.date || new Date().toISOString(),
    };

    setTrades(prev => [...prev, newTrade]);

    // Update account
    if (selectedAccount) {
      const updatedAccount = {
        ...selectedAccount,
        trades: [...selectedAccount.trades, newTrade.id],
        currentBalance: selectedAccount.currentBalance + newTrade.pnl,
      };
      
      setAccounts(prev => prev.map(acc => 
        acc.id === selectedAccount.id ? updatedAccount : acc
      ));
      
      setSelectedAccount(updatedAccount);
    }

    return newTrade;
  };

  // Update an existing trade
  const updateTrade = (tradeId, updatedData) => {
    const oldTrade = trades.find(t => t.id === tradeId);
    if (!oldTrade) return;

    const updatedTrade = {
      ...oldTrade,
      ...updatedData,
      // Preserve status if not changed
      status: updatedData.status || oldTrade.status,
      pnl: updatedData.pnl !== undefined && updatedData.pnl !== '' 
        ? parseFloat(updatedData.pnl) 
        : calculatePnL({ ...oldTrade, ...updatedData }),
      riskReward: updatedData.riskReward !== undefined && updatedData.riskReward !== '' 
        ? parseFloat(updatedData.riskReward) 
        : calculateRiskReward({ ...oldTrade, ...updatedData }),
    };

    setTrades(prev => prev.map(t => t.id === tradeId ? updatedTrade : t));

    // Update account balance
    if (selectedAccount && selectedAccount.trades.includes(tradeId)) {
      const pnlDifference = updatedTrade.pnl - oldTrade.pnl;
      const updatedAccount = {
        ...selectedAccount,
        currentBalance: selectedAccount.currentBalance + pnlDifference,
      };
      
      setAccounts(prev => prev.map(acc => 
        acc.id === selectedAccount.id ? updatedAccount : acc
      ));
      
      setSelectedAccount(updatedAccount);
    }
  };

  // Delete a trade
  const deleteTrade = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    setTrades(prev => prev.filter(t => t.id !== tradeId));

    // Update account
    if (selectedAccount && selectedAccount.trades.includes(tradeId)) {
      const updatedAccount = {
        ...selectedAccount,
        trades: selectedAccount.trades.filter(id => id !== tradeId),
        currentBalance: selectedAccount.currentBalance - trade.pnl,
      };
      
      setAccounts(prev => prev.map(acc => 
        acc.id === selectedAccount.id ? updatedAccount : acc
      ));
      
      setSelectedAccount(updatedAccount);
    }
  };

  // Add a new account
  const addAccount = (accountData) => {
    const newAccount = {
      id: generateId(),
      name: accountData.name || 'New Account',
      initialBalance: accountData.initialBalance || 0,
      currentBalance: accountData.initialBalance || 0,
      trades: [],
    };

    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  // Delete an account and reassign its trades to the first remaining account (if any)
    const deleteAccount = (accountId) => {
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      // If the deleted account was selected, switch to another
      if (selectedAccount?.id === accountId) {
        const remaining = accounts.filter(acc => acc.id !== accountId);
        setSelectedAccount(remaining[0] || null);
      }
    };

    // Switch active account
  const switchAccount = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccount(account);
    }
  };

  // Update account details
  const updateAccount = (accountId, updatedData) => {
    setAccounts(prev => prev.map(acc =>
      acc.id === accountId ? { ...acc, ...updatedData } : acc
    ));
    
    if (selectedAccount?.id === accountId) {
      setSelectedAccount(prev => ({ ...prev, ...updatedData }));
    }
  };

  // Update account balance (adjusts both initial and current)
  const updateAccountBalance = (accountId, newBalance) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    const balanceDiff = newBalance - account.initialBalance;
    
    setAccounts(prev => prev.map(acc =>
      acc.id === accountId
        ? {
            ...acc,
            initialBalance: newBalance,
            currentBalance: acc.currentBalance + balanceDiff,
          }
        : acc
    ));

    if (selectedAccount?.id === accountId) {
      setSelectedAccount(prev => ({
        ...prev,
        initialBalance: newBalance,
        currentBalance: prev.currentBalance + balanceDiff,
      }));
    }
  };

  // Add custom trading pair
  const addCustomPair = (pair) => {
    if (!customPairs.includes(pair)) {
      setCustomPairs(prev => [...prev, pair]);
    }
  };

  // Add custom strategy
  const addCustomStrategy = (strategy) => {
    if (!customStrategies.includes(strategy)) {
      setCustomStrategies(prev => [...prev, strategy]);
    }
  };

  // Remove custom strategy
  const removeCustomStrategy = (strategy) => {
    setCustomStrategies(prev => prev.filter(s => s !== strategy));
  };

  // Get trades for selected account
  const getAccountTrades = () => {
    if (!selectedAccount) return [];
    return trades.filter(t => selectedAccount.trades.includes(t.id));
  };

  const value = {
  accounts,
  trades,
  selectedAccount,
  customPairs,
  customStrategies,
  addTrade,
  updateTrade,
  deleteTrade,
  addAccount,
  deleteAccount,
  switchAccount,
  updateAccount,
  updateAccountBalance,
  addCustomPair,
  addCustomStrategy,
  removeCustomStrategy,
  getAccountTrades,
};

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
};
