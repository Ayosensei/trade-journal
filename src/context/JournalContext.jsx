import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

const JournalContext = createContext();

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const loadedEntries = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES) || '[]');
    setEntries(loadedEntries);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entryData) => {
    const newEntry = {
      ...entryData,
      id: generateId(),
      date: entryData.date || new Date().toISOString().split('T')[0],
    };

    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (entryId, updatedData) => {
    setEntries(prev => prev.map(entry =>
      entry.id === entryId ? { ...entry, ...updatedData } : entry
    ));
  };

  const deleteEntry = (entryId) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const getEntries = () => {
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getEntryByDate = (date) => {
    return entries.find(entry => entry.date === date);
  };

  const value = {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntries,
    getEntryByDate,
  };

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
};
