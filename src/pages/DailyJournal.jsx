import React, { useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  BookOpen,
  TrendingUp,
  Edit2,
  Trash2,
  FileText,
  Lightbulb,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useJournal } from "../context/JournalContext.jsx";
import { useTradeContext } from "../context/TradeContext.jsx";
import { formatCurrency } from "../utils/calculations";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";

const DailyJournal = () => {
  const { entries, addEntry, updateEntry, deleteEntry, getEntries } =
    useJournal();
  const { getAccountTrades } = useTradeContext();
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mood: "confident",
    marketConditions: "",
    observations: "",
    lessonsLearned: "",
  });

  const moodOptions = [
    { value: "confident", emoji: "😎", label: "Confident" },
    { value: "cautious", emoji: "🤔", label: "Cautious" },
    { value: "frustrated", emoji: "😤", label: "Frustrated" },
    { value: "excited", emoji: "🚀", label: "Excited" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
  ];

  const moodEmojis = Object.fromEntries(
    moodOptions.map((m) => [m.value, m.emoji]),
  );

  const trades = useMemo(() => getAccountTrades(), [getAccountTrades]);

  // Function to get trades for a specific date
  const getTradesForDate = (dateStr) => {
    return trades.filter((t) => t.date.split("T")[0] === dateStr);
  };

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      mood: "confident",
      marketConditions: "",
      observations: "",
      lessonsLearned: "",
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
    if (
      !formData.marketConditions ||
      !formData.observations ||
      !formData.lessonsLearned
    ) {
      alert("Please fill in all fields. Markdown is supported!");
      return;
    }

    const dateTrades = getTradesForDate(formData.date);
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

  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  ).getDay();

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Psychology & Review
          </h2>
          <p className="text-sm text-gray-400">
            Master your mindset through structured journaling (Markdown
            supported)
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
        >
          <Plus size={18} />
          Log Daily Insight
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {today.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-bold text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasEntry = sortedEntries.some((e) => e.date === dateStr);
                const isToday = day === today.getDate();

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded flex items-center justify-center text-xs relative cursor-pointer transition-all border ${
                      isToday
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent"
                    } ${hasEntry ? "bg-emerald-500/10 text-emerald-400 font-bold" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                  >
                    {day}
                    {hasEntry && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {sortedEntries.length === 0 ? (
            <div className="card text-center py-20 flex flex-col items-center">
              <BookOpen className="mb-4 text-gray-600" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">
                Your journal is empty
              </h3>
              <p className="text-gray-400 max-w-sm mb-6">
                "If you don't journal your trades, you're not trading, you're
                gambling." - Mark Douglas
              </p>
              <button onClick={handleOpenAdd} className="btn-primary">
                Write First Entry
              </button>
            </div>
          ) : (
            sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className="card group hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl shadow-inner border border-white/5">
                      {moodEmojis[entry.mood]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mt-1">
                        Status: Feeling {entry.mood}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">
                        Trades
                      </p>
                      <p className="text-lg font-bold text-white">
                        {entry.tradesCount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">
                        Daily P/L
                      </p>
                      <p
                        className={`text-lg font-bold ${entry.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {formatCurrency(entry.pnl)}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(entry)}
                        className="p-2.5 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all border border-white/5"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry)}
                        className="p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-blue-400">
                        <TrendingUp size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">
                          Market Environment
                        </h4>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none bg-white/5 p-4 rounded-xl border border-white/5 min-h-[100px]">
                        <ReactMarkdown>{entry.marketConditions}</ReactMarkdown>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-emerald-400">
                        <FileText size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">
                          Psychological Observations
                        </h4>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none bg-white/5 p-4 rounded-xl border border-white/5 min-h-[100px]">
                        <ReactMarkdown>{entry.observations}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-amber-400">
                        <Lightbulb size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">
                          Critical Lessons
                        </h4>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none bg-amber-400/5 p-4 rounded-xl border border-amber-400/10 min-h-[100px]">
                        <ReactMarkdown>{entry.lessonsLearned}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Trade Linking Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-purple-400">
                        <LinkIcon size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">
                          Linked Executions
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {getTradesForDate(entry.date).length > 0 ? (
                          getTradesForDate(entry.date).map((trade) => (
                            <div
                              key={trade.id}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-2 h-2 rounded-full ${trade.outcome === "Win" ? "bg-emerald-500" : trade.outcome === "Loss" ? "bg-rose-500" : "bg-gray-500"}`}
                                />
                                <span className="text-sm font-bold text-white">
                                  {trade.asset}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1.5 py-0.5 bg-white/5 rounded">
                                  {trade.direction}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`text-sm font-bold ${trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                                >
                                  {formatCurrency(trade.pnl)}
                                </span>
                                <ExternalLink
                                  size={14}
                                  className="text-gray-600"
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center border border-dashed border-white/5 rounded-lg">
                            <p className="text-xs text-gray-500 italic">
                              No trades logged for this day
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddEntry && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl my-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="sticky top-0 border-b border-white/10 p-6 bg-slate-900/50 backdrop-blur-md rounded-t-2xl flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingEntry ? "Refine Daily Insight" : "Record Daily Insight"}
              </h3>
              <button
                onClick={() => setShowAddEntry(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Review Date
                  </label>
                  <input
                    type="date"
                    className="input w-full"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Market Mood
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, mood: mood.value })
                        }
                        className={`p-2 px-3 rounded-lg flex items-center gap-2 text-sm transition-all border ${
                          formData.mood === mood.value
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                  Market Context
                  <span className="text-[10px] text-blue-400">
                    Markdown Enabled
                  </span>
                </label>
                <textarea
                  className="input w-full h-32 resize-none font-mono text-sm"
                  placeholder="Describe volatility, trends, news events..."
                  value={formData.marketConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketConditions: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Psychology & Discipline
                </label>
                <textarea
                  className="input w-full h-32 resize-none font-mono text-sm"
                  placeholder="How did you handle winners? Did you revenge trade? Any FOMO?"
                  value={formData.observations}
                  onChange={(e) =>
                    setFormData({ ...formData, observations: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Actionable Takeaway
                </label>
                <textarea
                  className="input w-full h-32 resize-none font-mono text-sm"
                  placeholder="The one thing to remember for tomorrow..."
                  value={formData.lessonsLearned}
                  onChange={(e) =>
                    setFormData({ ...formData, lessonsLearned: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs border border-white/10 transition-all"
                  onClick={() => {
                    setShowAddEntry(false);
                    setEditingEntry(null);
                  }}
                >
                  Discard
                </button>
                <button
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-sm shadow-lg shadow-blue-900/20 transition-all"
                  onClick={handleSaveEntry}
                >
                  {editingEntry ? "Update Record" : "Commit to Journal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Purge Journal Entry"
        message="Are you sure you want to permanently delete this insight? Reflection is the key to growth."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setEntryToDelete(null);
        }}
        confirmText="Purge"
        variant="danger"
      />
    </div>
  );
};

export default DailyJournal;
