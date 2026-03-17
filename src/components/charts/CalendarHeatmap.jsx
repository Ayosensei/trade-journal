import React from 'react';
import {
  format,
  eachDayOfInterval,
  subMonths,
  startOfMonth,
  getDay
} from 'date-fns';

/**
 * CalendarHeatmap component to visualize trading activity PnL over the last 6 months
 * @param {Object} props
 * @param {Array} props.trades - Array of trade objects
 */
const CalendarHeatmap = ({ trades = [] }) => {
  // Display range: Last 6 months up to today
  const today = new Date();
  const endDate = today;
  const startDate = subMonths(startOfMonth(today), 5);

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Aggregate PnL by date string (YYYY-MM-DD)
  const pnlMap = trades.reduce((acc, trade) => {
    // Normalize trade date to local date string to match heatmap grid
    const d = new Date(trade.date);
    const key = format(d, 'yyyy-MM-dd');
    acc[key] = (acc[key] || 0) + (trade.pnl || 0);
    return acc;
  }, {});

  // Determine square color based on PnL magnitude
  const getLevel = (pnl) => {
    if (pnl === undefined) return 'bg-white/5';
    if (Math.abs(pnl) < 0.01) return 'bg-gray-400/20'; // Neutral for zero activity

    if (pnl > 0) {
      if (pnl > 1000) return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.2)]';
      if (pnl > 200) return 'bg-emerald-500';
      return 'bg-emerald-600/50';
    } else {
      if (pnl < -1000) return 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.2)]';
      if (pnl < -200) return 'bg-rose-500';
      return 'bg-rose-600/50';
    }
  };

  // Organize days into weeks for column-based rendering (GitHub style)
  const weeks = [];
  let currentWeek = Array(7).fill(null);

  allDays.forEach(day => {
    const dayOfWeek = getDay(day); // 0 (Sun) to 6 (Sat)
    currentWeek[dayOfWeek] = day;

    // If it's Saturday or the last day in our range, finalize the week column
    if (dayOfWeek === 6 || day.getTime() === allDays[allDays.length - 1].getTime()) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }
  });

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex gap-2 min-w-max p-1">
          {/* Day of week labels */}
          <div className="flex flex-col gap-1 justify-between pt-5 pb-1">
            {dayLabels.map((label, i) => (
              <span key={i} className="text-[9px] text-gray-500 font-bold w-3 h-3 flex items-center justify-center">
                {label}
              </span>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {/* Month label header */}
                <div className="h-4 text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                  {week.some(d => d && d.getDate() === 1) ?
                    format(week.find(d => d && d.getDate() === 1), 'MMM') :
                    weekIdx === 0 ? format(week.find(d => d), 'MMM') : ''
                  }
                </div>

                {/* Individual day squares */}
                {week.map((day, dayIdx) => {
                  if (!day) return <div key={dayIdx} className="w-3.5 h-3.5" />;
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const pnl = pnlMap[dateKey];

                  return (
                    <div
                      key={dayIdx}
                      className={`w-3.5 h-3.5 rounded-[2px] transition-all hover:scale-125 cursor-help ${getLevel(pnl)}`}
                      title={`${format(day, 'MMM dd, yyyy')}${pnl !== undefined ? `: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}` : ': No activity'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-3 px-1">
        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Loss</span>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-rose-600/50" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-white/5 border border-white/5" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600/50" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
        </div>
        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Profit</span>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
