import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

const GoalsContext = createContext();

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);

  // Load goals from localStorage on mount
  useEffect(() => {
    const loadedGoals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
    setGoals(loadedGoals);
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goalData) => {
    const newGoal = {
      ...goalData,
      id: generateId(),
      current: goalData.current || 0,
      completed: false,
    };

    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (goalId, updatedData) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, ...updatedData } : goal
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const updateGoalProgress = (goalId, currentValue) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const completed = currentValue >= goal.target;
        return { ...goal, current: currentValue, completed };
      }
      return goal;
    }));
  };

  const getGoals = () => {
    return goals;
  };

  const getActiveGoals = () => {
    return goals.filter(goal => !goal.completed);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.completed);
  };

  const value = {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    getGoals,
    getActiveGoals,
    getCompletedGoals,
  };

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};
