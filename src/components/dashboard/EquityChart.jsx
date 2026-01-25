import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/calculations';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-3">
        <p className="text-sm text-[#888888]">
          {format(new Date(payload[0].payload.date), 'MMM dd, yyyy')}
        </p>
        <p className="text-lg font-bold text-[#00ff88]">
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
        <p className="text-[#555555]">No trade data available</p>
      </div>
    );
  }

  return (
    <div className="card relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Equity Curve</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#888888]">Net P/L:</span>
          <span className="text-xl font-bold text-[#00ff88]">
            {formatCurrency(currentPnL)}
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            stroke="#555555"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#555555"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#00ff88" 
            strokeWidth={2}
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityChart;
