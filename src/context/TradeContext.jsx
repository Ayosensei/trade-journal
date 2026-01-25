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
      pnl: calculatePnL(tradeData),
      riskReward: calculateRiskReward(tradeData),
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
      pnl: calculatePnL({ ...oldTrade, ...updatedData }),
      riskReward: calculateRiskReward({ ...oldTrade, ...updatedData }),
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

  // Switch active account
  const switchAccount = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccount(account);
    }
  };

  // Add custom trading pair
  const addCustomPair = (pair) => {
    if (!customPairs.includes(pair)) {
      setCustomPairs(prev => [...prev, pair]);
    }
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
    addTrade,
    updateTrade,
    deleteTrade,
    addAccount,
    switchAccount,
    addCustomPair,
    getAccountTrades,
  };

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
};
