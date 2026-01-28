import React, { useState } from 'react';
import { Calendar, Plus, BookOpen, TrendingUp, Edit2, Trash2, FileText, Lightbulb } from 'lucide-react';
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

  const moodOptions = [
    { value: 'confident', emoji: '😎', label: 'Confident' },
    { value: 'cautious', emoji: '🤔', label: 'Cautious' },
    { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { value: 'excited', emoji: '🚀', label: 'Excited' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
  ];

  const moodEmojis = Object.fromEntries(moodOptions.map(m => [m.value, m.emoji]));

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

  // Get current month days for calendar
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Daily Journal</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Document your trading journey and insights</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          New Entry
        </button>
      </div>

      {/* Calendar View */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium py-1" style={{ color: 'var(--text-muted)' }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEntry = sortedEntries.some(e => e.date === dateStr);
            const isToday = day === today.getDate();
            
            return (
              <div
                key={day}
                className="aspect-square rounded flex items-center justify-center text-xs relative cursor-pointer transition-colors"
                style={{
                  backgroundColor: hasEntry ? 'rgba(38, 166, 154, 0.15)' : 'var(--bg-tertiary)',
                  color: isToday ? 'var(--accent-primary)' : hasEntry ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                  border: isToday ? '1px solid var(--accent-primary)' : 'none'
                }}
              >
                {day}
                {hasEntry && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent-secondary)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        {sortedEntries.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="mx-auto mb-4" size={40} style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No journal entries yet</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Start documenting your trading journey</p>
            <button onClick={handleOpenAdd} className="btn-primary text-sm">
              Create First Entry
            </button>
          </div>
        ) : (
          sortedEntries.map((entry) => (
            <div key={entry.id} className="card">
              {/* Entry Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{moodEmojis[entry.mood]}</div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>Feeling {entry.mood}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Trades</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{entry.tradesCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>P/L</p>
                    <p className="text-sm font-semibold" style={{ color: entry.pnl >= 0 ? 'var(--accent-secondary)' : 'var(--accent-danger)' }}>
                      ${entry.pnl.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded transition-colors"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <Edit2 size={14} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(entry)}
                      className="p-1.5 rounded transition-colors"
                      style={{ backgroundColor: 'rgba(239, 83, 80, 0.1)' }}
                    >
                      <Trash2 size={14} style={{ color: 'var(--accent-danger)' }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Entry Content */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} style={{ color: 'var(--accent-primary)' }} />
                    <h4 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Market Conditions</h4>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{entry.marketConditions}</p>
                </div>

                <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} style={{ color: 'var(--accent-primary)' }} />
                    <h4 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Observations</h4>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{entry.observations}</p>
                </div>

                <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={14} style={{ color: 'var(--accent-warning)' }} />
                    <h4 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Lessons Learned</h4>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{entry.lessonsLearned}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <div className="sticky top-0 border-b p-5" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-secondary)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
              </h3>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Date</label>
                <input
                  type="date"
                  className="input w-full text-sm"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Mood</label>
                <div className="flex gap-2 flex-wrap">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood.value })}
                      className="px-3 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
                      style={{
                        backgroundColor: formData.mood === mood.value ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        color: formData.mood === mood.value ? 'white' : 'var(--text-secondary)',
                        border: formData.mood === mood.value ? 'none' : '1px solid var(--border-secondary)'
                      }}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Market Conditions</label>
                <textarea
                  className="input w-full h-20 text-sm"
                  placeholder="Describe the market conditions..."
                  value={formData.marketConditions}
                  onChange={(e) => setFormData({ ...formData, marketConditions: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Observations</label>
                <textarea
                  className="input w-full h-24 text-sm"
                  placeholder="What did you notice today?"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Lessons Learned</label>
                <textarea
                  className="input w-full h-24 text-sm"
                  placeholder="What did you learn?"
                  value={formData.lessonsLearned}
                  onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="btn-secondary flex-1 text-sm"
                  onClick={() => {
                    setShowAddEntry(false);
                    setEditingEntry(null);
                  }}
                >
                  Cancel
                </button>
                <button className="btn-primary flex-1 text-sm" onClick={handleSaveEntry}>
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
