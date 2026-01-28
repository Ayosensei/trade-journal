import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/calculations';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md p-3 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
          {format(new Date(payload[0].payload.date), 'MMM dd, yyyy')}
        </p>
        <p className="text-base font-semibold" style={{ color: 'var(--accent-secondary)' }}>
          ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

const EquityChart = ({ data, currentPnL }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card h-[300px] flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>No trade data available</p>
      </div>
    );
  }

  const isPositive = currentPnL >= 0;
  const lineColor = isPositive ? '#26a69a' : '#ef5350';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Equity Curve</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Net P/L</span>
          <span className="text-lg font-bold" style={{ color: lineColor }}>
            {formatCurrency(currentPnL)}
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            stroke="var(--text-muted)"
            tick={{ fontSize: 11 }}
            axisLine={{ stroke: 'var(--border-secondary)' }}
            tickLine={false}
          />
          <YAxis 
            stroke="var(--text-muted)"
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke={lineColor} 
            strokeWidth={2}
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityChart;
