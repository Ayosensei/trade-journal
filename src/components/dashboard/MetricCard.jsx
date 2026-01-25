import React from 'react';

const MetricCard = ({ icon: Icon, label, value, subtitle, type = 'neutral' }) => {
  const getValueClass = () => {
    switch (type) {
      case 'positive':
        return 'metric-value-positive';
      case 'negative':
        return 'metric-value-negative';
      default:
        return 'metric-value-neutral';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'positive':
        return 'text-[#00ff88]';
      case 'negative':
        return 'text-[#ff4444]';
      default:
        return 'text-[#d4ff00]';
    }
  };

  return (
    <div className="metric-card">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg bg-[#2a2a2a] ${getIconColor()}`}>
            <Icon size={20} />
          </div>
        )}
        <span className="text-sm text-[#888888] font-medium">{label}</span>
      </div>
      <div className={getValueClass()}>{value}</div>
      {subtitle && <span className="text-xs text-[#555555]">{subtitle}</span>}
    </div>
  );
};

export default MetricCard;
