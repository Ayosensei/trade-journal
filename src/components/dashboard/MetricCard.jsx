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
        return 'text-[#26a69a]';
      case 'negative':
        return 'text-[#ef5350]';
      default:
        return 'text-[#2962ff]';
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'positive':
        return 'bg-[#26a69a]/10';
      case 'negative':
        return 'bg-[#ef5350]/10';
      default:
        return 'bg-[#2962ff]/10';
    }
  };

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-1">
        {Icon && (
          <div className={`p-1.5 rounded ${getIconBg()} ${getIconColor()}`}>
            <Icon size={16} />
          </div>
        )}
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <div className={getValueClass()}>{value}</div>
      {subtitle && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
    </div>
  );
};

export default MetricCard;
