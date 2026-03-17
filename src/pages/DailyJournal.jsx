import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  BookOpen,
  TrendingUp,
  Edit2,
  Trash2,
  FileText,
  Lightbulb,
  Link as LinkIcon,
  ExternalLink,
  Brain,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useJournal } from "../context/JournalContext.jsx";
import { useTradeContext } from "../context/TradeContext.jsx";
import { formatCurrency } from "../utils/calculations";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";

/**
 * DailyJournal Component - Technical Reflection Protocol
 * A high-precision environment for psychological auditing and market review.
 */
const DailyJournal = () => {
  const { entries, addEntry, updateEntry, deleteEntry, getEntries } = useJournal();
  const { getAccountTrades, selectedAccount } = useTradeContext();

  const [showAddEntry, setShowAddEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mood: "neutral",
    marketConditions: "",
    observations: "",
    lessonsLearned: "",
  });

  const moodOptions = [
    { value: "confident", emoji: "😎", label: "Alpha" },
    { value: "cautious", emoji: "🤔", label: "Gamma" },
    { value: "frustrated", emoji: "😤", label: "Stress" },
    { value: "excited", emoji: "🚀", label: "Hyper" },
    { value: "neutral", emoji: "😐", label: "Stable" },
  ];

  const moodEmojis = Object.fromEntries(moodOptions.map((m) => [m.value, m.emoji]));
  const trades = useMemo(() => getAccountTrades(), [getAccountTrades]);

  const getTradesForDate = (dateStr) => {
    return trades.filter((t) => t.date.split("T")[0] === dateStr);
  };

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      mood: "neutral",
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
    if (!formData.marketConditions || !formData.observations || !formData.lessonsLearned) {
      alert("Protocol Error: All descriptive fields required for commit.");
      return;
    }

    const dateTrades = getTradesForDate(formData.date);
    const tradesCount = dateTrades.length;
    const pnl = dateTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    const entryData = { ...formData, tradesCount, pnl };

    if (editingEntry) updateEntry(editingEntry.id, entryData);
    else addEntry(entryData);

    setShowAddEntry(false);
    setEditingEntry(null);
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) deleteEntry(entryToDelete.id);
    setShowDeleteConfirm(false);
    setEntryToDelete(null);
  };

  const sortedEntries = getEntries();
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 pb-24">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Brain className="text-purple-500" size={20} />
            Reflection Protocol
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Psychological Audit Log // Cluster_{selectedAccount?.id.slice(0,4).toUpperCase() || 'ROOT'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary group"
        >
          <Plus size={14} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-[10px] font-black uppercase tracking-widest">Commit_Daily_Insight</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar Module */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-slate-950/20 border-white/5 p-5">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon size={14} className="text-blue-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Temporal_Node // {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-center text-[8px] font-black text-slate-700 py-1">{day}</div>
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
                    className={`aspect-square rounded flex items-center justify-center text-[10px] font-bold relative transition-all border ${
                      isToday ? "border-blue-500 text-blue-400 bg-blue-500/5 shadow-[0_0_10px_rgba(59,130,246,0.1)]" : "border-transparent"
                    } ${hasEntry ? "text-emerald-400" : "text-slate-600 hover:bg-white/5"}`}
                  >
                    {day}
                    {hasEntry && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card bg-slate-950/20 border-white/5 p-5 space-y-4">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Audit_Statistics</span>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500">Commits_Total</span>
              <span className="text-xs font-bold text-white data-mono">{sortedEntries.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500">System_Health</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter uppercase">Optimal</span>
            </div>
          </div>
        </div>

        {/* Insight Feed Module */}
        <div className="lg:col-span-3 space-y-6">
          {sortedEntries.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-24 border-dashed border-white/5 bg-transparent opacity-40">
              <BookOpen className="text-slate-800 mb-4" size={48} />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Ledger_Memory_Empty</p>
            </div>
          ) : (
            sortedEntries.map((entry) => (
              <div key={entry.id} className="card group border-white/5 bg-slate-950/20 hover:bg-slate-900/40 p-0 overflow-hidden transition-all duration-500">
                {/* Entry Ribbon Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-5">
                    <div className="text-3xl bg-slate-900 w-14 h-14 flex items-center justify-center rounded-xl border border-white/5 shadow-inner">
                      {moodEmojis[entry.mood]}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">
                        Node_Log // {new Date(entry.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "2-digit", year: "numeric" })}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Stability: Feeling {entry.mood}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mt-4 md:mt-0">
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Vol_Linked</span>
                      <span className="text-sm font-bold text-white data-mono">{entry.tradesCount} Ops</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Yield_Delta</span>
                      <span className={`text-sm font-bold data-mono ${entry.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {formatCurrency(entry.pnl)}
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleOpenEdit(entry)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-blue-400 transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => handleDeleteClick(entry)} className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Entry Content Grids */}
                <div className="p-8 grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <ReflectionSection label="Environmental_Context" icon={TrendingUp} color="text-blue-400">
                      <div className="prose-slate prose-invert text-[11px] leading-relaxed text-slate-400 font-medium bg-slate-950/40 p-4 rounded-lg border border-white/[0.03]">
                        <ReactMarkdown>{entry.marketConditions}</ReactMarkdown>
                      </div>
                    </ReflectionSection>
                    <ReflectionSection label="Psychological_Response" icon={FileText} color="text-emerald-400">
                      <div className="prose-slate prose-invert text-[11px] leading-relaxed text-slate-400 font-medium bg-slate-950/40 p-4 rounded-lg border border-white/[0.03]">
                        <ReactMarkdown>{entry.observations}</ReactMarkdown>
                      </div>
                    </ReflectionSection>
                  </div>

                  <div className="space-y-6">
                    <ReflectionSection label="Core_Optimization" icon={Lightbulb} color="text-amber-400">
                      <div className="prose-slate prose-invert text-[11px] leading-relaxed text-slate-300 font-bold bg-amber-500/[0.02] p-4 rounded-lg border border-amber-500/10">
                        <ReactMarkdown>{entry.lessonsLearned}</ReactMarkdown>
                      </div>
                    </ReflectionSection>

                    {/* Linked Ops Grid */}
                    <ReflectionSection label="Execution_Sync" icon={LinkIcon} color="text-purple-400">
                      <div className="space-y-2">
                        {getTradesForDate(entry.date).length > 0 ? (
                          getTradesForDate(entry.date).map((trade) => (
                            <div key={trade.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5 hover:border-white/10 transition-all group/item">
                              <div className="flex items-center gap-3">
                                <div className={`w-1 h-3 rounded-full ${trade.outcome === "Win" ? "bg-emerald-500" : trade.outcome === "Loss" ? "bg-rose-500" : "bg-slate-600"}`} />
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter data-mono">{trade.asset}</span>
                                <span className="text-[8px] font-black text-slate-600 uppercase bg-white/5 px-1.5 py-0.5 rounded">{trade.direction}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold data-mono ${trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                  {formatCurrency(trade.pnl)}
                                </span>
                                <ExternalLink size={10} className="text-slate-700 group-hover/item:text-blue-500 transition-colors" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center border border-dashed border-white/5 rounded-lg">
                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">No_Ops_Detected</span>
                          </div>
                        )}
                      </div>
                    </ReflectionSection>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Protocol Commit Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl my-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                  <Zap size={16} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                  {editingEntry ? "Edit_Insight_Node" : "Commit_New_Reflector"}
                </h3>
              </div>
              <button onClick={() => setShowAddEntry(false)} className="text-slate-500 hover:text-white transition-colors">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal_Reference</label>
                  <input
                    type="date"
                    className="input font-bold text-xs uppercase"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mood_Calibration</label>
                  <div className="flex gap-2 flex-wrap">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, mood: mood.value })}
                        className={`p-2 px-3 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all border ${
                          formData.mood === mood.value
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                            : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
                        }`}
                      >
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <JournalInput
                label="Environment_Context"
                sub="Market conditions, volatility index, structural bias..."
                value={formData.marketConditions}
                onChange={(val) => setFormData({ ...formData, marketConditions: val })}
              />

              <JournalInput
                label="Psychology_Variance"
                sub="FOMO levels, discipline alignment, winner/loser handling..."
                value={formData.observations}
                onChange={(val) => setFormData({ ...formData, observations: val })}
              />

              <JournalInput
                label="Actionable_Protocol"
                sub="What is the singular refinement for the next session?"
                value={formData.lessonsLearned}
                onChange={(val) => setFormData({ ...formData, lessonsLearned: val })}
                accent="amber"
              />

              <div className="flex gap-4 pt-4">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => setShowAddEntry(false)}
                >
                  Discard_Commit
                </button>
                <button
                  className="btn-primary flex-1 shadow-blue-500/20"
                  onClick={handleSaveEntry}
                >
                  {editingEntry ? "Execute_Update" : "Finalize_Commit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Protocol: Data_Wipe"
        message="Are you sure you want to permanently purge this psychological node? Verification history will be lost."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Confirm_Purge"
        variant="danger"
      />
    </div>
  );
};

// Internal Sub-components
const ReflectionSection = ({ label, icon: Icon, color, children }) => (
  <div className="space-y-3">
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon size={12} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    {children}
  </div>
);

const JournalInput = ({ label, sub, value, onChange, accent = "blue" }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <span className="text-[8px] font-mono text-slate-700">MARKDOWN_ENABLED</span>
    </div>
    <textarea
      className={`input w-full h-32 resize-none data-mono text-xs p-4 bg-slate-950/50 ${accent === 'amber' ? 'focus:border-amber-500/50' : 'focus:border-blue-500/50'}`}
      placeholder={sub}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default DailyJournal;
