import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, DATA_VERSION } from '../utils/constants';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [lastBackupTime, setLastBackupTime] = useState(null);

  // Auto-backup every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      createBackup();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Initialize data version
  useEffect(() => {
    const version = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    if (!version) {
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
    }
  }, []);

  const createBackup = () => {
    try {
      const timestamp = Date.now();
      const backupData = {
        version: DATA_VERSION,
        timestamp,
        accounts: localStorage.getItem(STORAGE_KEYS.ACCOUNTS),
        trades: localStorage.getItem(STORAGE_KEYS.TRADES),
        customPairs: localStorage.getItem(STORAGE_KEYS.CUSTOM_PAIRS),
        selectedAccount: localStorage.getItem(STORAGE_KEYS.SELECTED_ACCOUNT),
        journalEntries: localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES),
        goals: localStorage.getItem(STORAGE_KEYS.GOALS),
      };

      const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}${timestamp}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      setLastBackupTime(new Date(timestamp));

      // Keep only last 5 backups
      cleanOldBackups();
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  };

  const cleanOldBackups = () => {
    try {
      const backups = getAllBackups();
      if (backups.length > 5) {
        // Sort by timestamp (oldest first)
        backups.sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest backups
        const toRemove = backups.slice(0, backups.length - 5);
        toRemove.forEach(backup => {
          localStorage.removeItem(backup.key);
        });
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  };

  const getAllBackups = () => {
    const backups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEYS.BACKUP_PREFIX)) {
        const timestamp = parseInt(key.replace(STORAGE_KEYS.BACKUP_PREFIX, ''));
        backups.push({ key, timestamp });
      }
    }
    return backups.sort((a, b) => b.timestamp - a.timestamp); // Newest first
  };

  const restoreBackup = (timestamp) => {
    try {
      const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}${timestamp}`;
      const backupData = localStorage.getItem(backupKey);
      
      if (!backupData) {
        throw new Error('Backup not found');
      }

      const data = JSON.parse(backupData);

      // Restore all data
      if (data.accounts) localStorage.setItem(STORAGE_KEYS.ACCOUNTS, data.accounts);
      if (data.trades) localStorage.setItem(STORAGE_KEYS.TRADES, data.trades);
      if (data.customPairs) localStorage.setItem(STORAGE_KEYS.CUSTOM_PAIRS, data.customPairs);
      if (data.selectedAccount) localStorage.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, data.selectedAccount);
      if (data.journalEntries) localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, data.journalEntries);
      if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, data.goals);

      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  };

  const exportData = () => {
    try {
      const exportData = {
        version: DATA_VERSION,
        exportDate: new Date().toISOString(),
        accounts: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '[]'),
        trades: JSON.parse(localStorage.getItem(STORAGE_KEYS.TRADES) || '[]'),
        customPairs: JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_PAIRS) || '[]'),
        selectedAccount: localStorage.getItem(STORAGE_KEYS.SELECTED_ACCOUNT),
        journalEntries: JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES) || '[]'),
        goals: JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]'),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trade-journal-export-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  };

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          // Validate data structure
          if (!importedData.version || !importedData.accounts) {
            throw new Error('Invalid data format');
          }

          // Create backup before importing
          createBackup();

          // Import data
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(importedData.accounts));
          localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(importedData.trades || []));
          localStorage.setItem(STORAGE_KEYS.CUSTOM_PAIRS, JSON.stringify(importedData.customPairs || []));
          if (importedData.selectedAccount) {
            localStorage.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, importedData.selectedAccount);
          }
          localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(importedData.journalEntries || []));
          localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(importedData.goals || []));

          // Reload page to apply changes
          window.location.reload();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const clearAllData = () => {
    try {
      // Create backup before clearing
      createBackup();

      // Clear all data
      localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
      localStorage.removeItem(STORAGE_KEYS.TRADES);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_PAIRS);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_ACCOUNT);
      localStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      localStorage.removeItem(STORAGE_KEYS.GOALS);

      // Reload page
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  };

  const value = {
    createBackup,
    getAllBackups,
    restoreBackup,
    exportData,
    importData,
    clearAllData,
    lastBackupTime,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
