import React, { useState } from 'react';
import { Calendar, Plus, BookOpen, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { useJournal } from '../context/JournalContext.jsx';
import { useTradeContext } from '../context/TradeContext.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';

const DailyJournal = () => {
  const { entries, addEntry, updateEntry, deleteEntry, getEntries } = useJournal();
  const { getAccountTrades } = useTradeContext();
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 'confident',
    marketConditions: '',
    observations: '',
    lessonsLearned: '',
  });

  const moodEmojis = {
    confident: '😎',
    cautious: '🤔',
    frustrated: '😤',
    excited: '🚀',
    neutral: '😐',
  };

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mood: 'confident',
      marketConditions: '',
      observations: '',
      lessonsLearned: '',
    });
    setShowAddEntry(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      mood: entry.mood,
      marketConditions: entry.marketConditions,
      observations: entry.observations,
      lessonsLearned: entry.lessonsLearned,
    });
    setShowAddEntry(true);
  };

  const handleSaveEntry = () => {
    if (!formData.marketConditions || !formData.observations || !formData.lessonsLearned) {
      alert('Please fill in all fields');
      return;
    }

    // Calculate trades count and P/L for the date
    const trades = getAccountTrades();
    const dateTrades = trades.filter(t => t.date.split('T')[0] === formData.date);
    const tradesCount = dateTrades.length;
    const pnl = dateTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    const entryData = {
      ...formData,
      tradesCount,
      pnl,
    };

    if (editingEntry) {
      updateEntry(editingEntry.id, entryData);
    } else {
      addEntry(entryData);
    }

    setShowAddEntry(false);
    setEditingEntry(null);
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      deleteEntry(entryToDelete.id);
    }
    setShowDeleteConfirm(false);
    setEntryToDelete(null);
  };

  const sortedEntries = getEntries();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Daily Journal</h2>
          <p className="text-gray-400">Document your trading journey and insights</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Entry
        </button>
      </div>

      {/* Calendar View Placeholder */}
      <div className="card mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-white" size={24} />
          <h3 className="text-lg font-semibold text-white">Calendar View</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }, (_, i) => {
            const hasEntry = sortedEntries.some(e => new Date(e.date).getDate() === i + 1);
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                  i % 7 === 0 || i % 7 === 6
                    ? 'bg-white/5 text-gray-500'
                    : hasEntry
                    ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20 text-white border border-white/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 cursor-pointer'
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {sortedEntries.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No journal entries yet</h3>
            <p className="text-gray-400 mb-4">Start documenting your trading journey</p>
            <button onClick={handleOpenAdd} className="btn-primary">
              Create First Entry
            </button>
          </div>
        ) : (
          sortedEntries.map((entry) => (
            <div key={entry.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{moodEmojis[entry.mood]}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">Feeling {entry.mood}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Trades</p>
                    <p className="text-lg font-semibold text-white">{entry.tradesCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">P/L</p>
                    <p className={`text-lg font-semibold ${entry.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${entry.pnl.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(entry)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-400">Market Conditions</h4>
                  </div>
                  <p className="text-white">{entry.marketConditions}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-400">Observations</h4>
                  </div>
                  <p className="text-white">{entry.observations}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-400">Lessons Learned</h4>
                  </div>
                  <p className="text-white">{entry.lessonsLearned}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Date</label>
                <input
                  type="date"
                  className="input w-full"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white mb-2">Mood</label>
                <select
                  className="select w-full"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                >
                  <option value="confident">😎 Confident</option>
                  <option value="cautious">🤔 Cautious</option>
                  <option value="frustrated">😤 Frustrated</option>
                  <option value="excited">🚀 Excited</option>
                  <option value="neutral">😐 Neutral</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Market Conditions</label>
                <textarea
                  className="input w-full h-20"
                  placeholder="Describe the market conditions..."
                  value={formData.marketConditions}
                  onChange={(e) => setFormData({ ...formData, marketConditions: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-white mb-2">Observations</label>
                <textarea
                  className="input w-full h-24"
                  placeholder="What did you notice today?"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-white mb-2">Lessons Learned</label>
                <textarea
                  className="input w-full h-24"
                  placeholder="What did you learn?"
                  value={formData.lessonsLearned}
                  onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setShowAddEntry(false);
                    setEditingEntry(null);
                  }}
                >
                  Cancel
                </button>
                <button className="btn-primary flex-1" onClick={handleSaveEntry}>
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setEntryToDelete(null);
        }}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default DailyJournal;
