import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Plus, Check, X, Edit2, Trash2 } from 'lucide-react';
import { useGoals } from '../context/GoalsContext.jsx';
import { useTradeContext } from '../context/TradeContext.jsx';
import { calculateNetPnL, calculateWinRate } from '../utils/calculations.js';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, updateGoalProgress } = useGoals();
  const { getAccountTrades } = useTradeContext();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'profit',
    target: '',
    deadline: '',
  });

  // Auto-update goal progress based on trade data
  useEffect(() => {
    const trades = getAccountTrades();
    
    goals.forEach(goal => {
      let currentValue = 0;

      switch (goal.type) {
        case 'profit':
          currentValue = calculateNetPnL(trades);
          break;
        case 'winrate':
          currentValue = parseFloat(calculateWinRate(trades));
          break;
        case 'trades':
          currentValue = trades.length;
          break;
        default:
          currentValue = goal.current;
      }

      if (currentValue !== goal.current) {
        updateGoalProgress(goal.id, currentValue);
      }
    });
  }, [getAccountTrades, goals, updateGoalProgress]);

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      type: 'profit',
      target: '',
      deadline: '',
    });
    setShowAddGoal(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      type: goal.type,
      target: goal.target.toString(),
      deadline: goal.deadline,
    });
    setShowAddGoal(true);
  };

  const handleSaveGoal = () => {
    if (!formData.title || !formData.target || !formData.deadline) {
      alert('Please fill in all fields');
      return;
    }

    const target = parseFloat(formData.target);
    if (isNaN(target) || target <= 0) {
      alert('Please enter a valid target value');
      return;
    }

    const goalData = {
      title: formData.title,
      type: formData.type,
      target,
      deadline: formData.deadline,
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }

    setShowAddGoal(false);
    setEditingGoal(null);
  };

  const handleDeleteClick = (goal) => {
    setGoalToDelete(goal);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete.id);
    }
    setShowDeleteConfirm(false);
    setGoalToDelete(null);
  };

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
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {goals.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <Target className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No goals yet</h3>
            <p className="text-gray-400 mb-4">Set your first trading goal to track your progress</p>
            <button onClick={handleOpenAdd} className="btn-primary">
              Create First Goal
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = getProgressPercentage(goal.current, goal.target);
            const progressColor = getProgressColor(progress);

            return (
              <div key={goal.id} className="card relative">
                {goal.completed && (
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-green-500/20">
                    <Check className="text-green-400" size={20} />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <Target className="text-white" size={20} />
                    </div>
                    <h3 className="font-semibold text-white pr-8">{goal.title}</h3>
                  </div>
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

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  <span className="font-semibold" style={{ color: progressColor }}>
                    {progress.toFixed(0)}%
                  </span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleOpenEdit(goal)}
                    className="flex-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(goal)}
                    className="flex-1 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Goal Form */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </h3>
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setEditingGoal(null);
                }}
              >
                <X className="text-gray-400 hover:text-white" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Goal Title</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g., Reach $5000 profit"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white mb-2">Goal Type</label>
                <select
                  className="select w-full"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="profit">Profit Target</option>
                  <option value="winrate">Win Rate</option>
                  <option value="trades">Number of Trades</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Target Value</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="10000"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white mb-2">Deadline</label>
                <input
                  type="date"
                  className="input w-full"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setShowAddGoal(false);
                    setEditingGoal(null);
                  }}
                >
                  Cancel
                </button>
                <button className="btn-primary flex-1" onClick={handleSaveGoal}>
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Section */}
      {goals.length > 0 && (
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
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setGoalToDelete(null);
        }}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Goals;
