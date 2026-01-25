import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, Plus, Check, X } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Reach $10,000 Profit',
      target: 10000,
      current: 3500,
      type: 'profit',
      deadline: '2026-03-31',
      completed: false,
    },
    {
      id: 2,
      title: 'Achieve 70% Win Rate',
      target: 70,
      current: 58,
      type: 'winrate',
      deadline: '2026-02-28',
      completed: false,
    },
    {
      id: 3,
      title: 'Complete 100 Trades',
      target: 100,
      current: 45,
      type: 'trades',
      deadline: '2026-04-30',
      completed: false,
    },
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'var(--accent-secondary)';
    if (percentage >= 50) return 'var(--accent-primary)';
    return 'var(--accent-danger)';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Trading Goals</h2>
          <p className="text-gray-400">Set and track your trading objectives</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const progressColor = getProgressColor(progress);

          return (
            <div key={goal.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Target className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold text-white">{goal.title}</h3>
                </div>
                {goal.completed && (
                  <div className="p-1 rounded-full bg-green-500/20">
                    <Check className="text-green-400" size={16} />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {goal.type === 'profit' && '$'}
                    {goal.current.toLocaleString()}
                    {goal.type === 'winrate' && '%'}
                  </span>
                  <span className="text-sm text-gray-400">
                    of {goal.type === 'profit' && '$'}
                    {goal.target.toLocaleString()}
                    {goal.type === 'winrate' && '%'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: progressColor,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <span className="font-semibold" style={{ color: progressColor }}>
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Form (Simple) */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New Goal</h3>
              <button onClick={() => setShowAddGoal(false)}>
                <X className="text-gray-400 hover:text-white" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Goal Title</label>
                <input type="text" className="input w-full" placeholder="e.g., Reach $5000 profit" />
              </div>
              <div>
                <label className="block text-white mb-2">Goal Type</label>
                <select className="select w-full">
                  <option value="profit">Profit Target</option>
                  <option value="winrate">Win Rate</option>
                  <option value="trades">Number of Trades</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Target Value</label>
                <input type="number" className="input w-full" placeholder="10000" />
              </div>
              <div>
                <label className="block text-white mb-2">Deadline</label>
                <input type="date" className="input w-full" />
              </div>
              <div className="flex gap-3 pt-4">
                <button className="btn-secondary flex-1" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </button>
                <button className="btn-primary flex-1">Create Goal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Section */}
      <div className="card bg-gradient-to-r from-white/5 to-white/10">
        <div className="flex items-center gap-4">
          <TrendingUp className="text-white" size={32} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Keep Pushing!</h3>
            <p className="text-gray-400">
              You're making great progress. Stay consistent and you'll reach your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
