import React from "react";

/**
 * MetricCard Component
 * Displays key performance indicators with technical minimalism and glassmorphism.
 */
const MetricCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  type = "neutral",
}) => {
  const getStyles = () => {
    switch (type) {
      case "positive":
        return {
          text: "text-emerald-400",
          iconBg: "bg-emerald-500/10",
          border: "glow-border-success",
          accent: "bg-emerald-500",
        };
      case "negative":
        return {
          text: "text-rose-400",
          iconBg: "bg-rose-500/10",
          border: "glow-border-danger",
          accent: "bg-rose-500",
        };
      default:
        return {
          text: "text-blue-400",
          iconBg: "bg-blue-500/10",
          border: "border-white/5",
          accent: "bg-blue-500",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`card group relative overflow-hidden flex flex-col gap-3 p-4 sm:p-5 ${styles.border}`}
    >
      {/* Top Accent Line */}
      <div
        className={`absolute top-0 left-0 w-full h-[1px] opacity-30 ${styles.accent}`}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className={`p-1.5 rounded-lg ${styles.iconBg} ${styles.text} border border-white/5`}
            >
              <Icon size={14} />
            </div>
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
            {label}
          </span>
        </div>

        {/* Technical Pulse Indicator */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1 h-1 rounded-full ${styles.accent} shadow-[0_0_8px_rgba(255,255,255,0.2)] animate-pulse`}
          />
        </div>
      </div>

      <div className="flex flex-col mt-1">
        <div
          className={`text-xl sm:text-2xl font-bold data-mono tracking-tighter ${styles.text}`}
        >
          {value}
        </div>
        {subtitle && (
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">
            {subtitle}
          </div>
        )}
      </div>

      {/* Subtle background icon watermark for technical depth */}
      <div className="absolute -bottom-4 -right-4 text-white opacity-[0.02] group-hover:opacity-[0.04] transition-all duration-500 rotate-12 group-hover:rotate-0 pointer-events-none">
        {Icon && <Icon size={64} />}
      </div>
    </div>
  );
};

export default MetricCard;
