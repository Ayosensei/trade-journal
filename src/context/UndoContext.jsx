import React, { createContext, useContext, useState } from 'react';

const UndoContext = createContext();

export const useUndo = () => {
  const context = useContext(UndoContext);
  if (!context) {
    throw new Error('useUndo must be used within an UndoProvider');
  }
  return context;
};

export const UndoProvider = ({ children }) => {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const addAction = (action) => {
    setUndoStack(prev => {
      const newStack = [...prev, action];
      // Keep only last 10 actions
      return newStack.slice(-10);
    });
    // Clear redo stack when new action is added
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return null;

    const action = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, action]);

    return action;
  };

  const redo = () => {
    if (redoStack.length === 0) return null;

    const action = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, action]);

    return action;
  };

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const value = {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
  };

  return <UndoContext.Provider value={value}>{children}</UndoContext.Provider>;
};
