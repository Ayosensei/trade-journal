import React, { useState } from 'react';
import { Calendar, Plus, BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const DailyJournal = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2026-01-25',
      mood: 'confident',
      marketConditions: 'Trending upward, high volatility',
      observations: 'Strong momentum in tech stocks. EUR/USD showing clear patterns.',
      lessonsLearned: 'Patience pays off. Waited for confirmation before entry.',
      tradesCount: 3,
      pnl: 450,
    },
    {
      id: 2,
      date: '2026-01-24',
      mood: 'cautious',
      marketConditions: 'Choppy, low volume',
      observations: 'Market indecision. Multiple false breakouts.',
      lessonsLearned: 'Avoid trading in unclear market conditions.',
      tradesCount: 1,
      pnl: -120,
    },
  ]);

  const [showAddEntry, setShowAddEntry] = useState(false);

  const moodEmojis = {
    confident: '😎',
    cautious: '🤔',
    frustrated: '😤',
    excited: '🚀',
    neutral: '😐',
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Daily Journal</h2>
          <p className="text-gray-400">Document your trading journey and insights</p>
        </div>
        <button
          onClick={() => setShowAddEntry(true)}
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
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                i % 7 === 0 || i % 7 === 6
                  ? 'bg-white/5 text-gray-500'
                  : entries.some(e => new Date(e.date).getDate() === i + 1)
                  ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20 text-white border border-white/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 cursor-pointer'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {entries.map((entry) => (
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
                    ${entry.pnl}
                  </p>
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
        ))}
      </div>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">New Journal Entry</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Date</label>
                <input type="date" className="input w-full" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div>
                <label className="block text-white mb-2">Mood</label>
                <select className="select w-full">
                  <option value="confident">😎 Confident</option>
                  <option value="cautious">🤔 Cautious</option>
                  <option value="frustrated">😤 Frustrated</option>
                  <option value="excited">🚀 Excited</option>
                  <option value="neutral">😐 Neutral</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Market Conditions</label>
                <textarea className="input w-full h-20" placeholder="Describe the market conditions..."></textarea>
              </div>

              <div>
                <label className="block text-white mb-2">Observations</label>
                <textarea className="input w-full h-24" placeholder="What did you notice today?"></textarea>
              </div>

              <div>
                <label className="block text-white mb-2">Lessons Learned</label>
                <textarea className="input w-full h-24" placeholder="What did you learn?"></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="btn-secondary flex-1" onClick={() => setShowAddEntry(false)}>
                  Cancel
                </button>
                <button className="btn-primary flex-1">Save Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyJournal;
