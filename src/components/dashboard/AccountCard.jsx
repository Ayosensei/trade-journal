import React from 'react';
import { formatCurrency, formatPercentage } from '../../utils/calculations';

const AccountCard = ({ account, isActive = false, onClick }) => {
  if (!account) return null;

  const pnl = account.currentBalance - account.initialBalance;
  const pnlPercentage = ((pnl / account.initialBalance) * 100).toFixed(2);
  const isPositive = pnl >= 0;

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-200`}
      style={{
        borderColor: isActive ? 'var(--accent-primary)' : undefined,
        backgroundColor: isActive ? 'var(--bg-tertiary)' : undefined
      }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          {account.name}
        </h3>
        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          ${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span 
            className="text-sm font-semibold"
            style={{ color: isPositive ? 'var(--accent-secondary)' : 'var(--accent-danger)' }}
          >
            {isPositive ? '+' : ''}{formatCurrency(pnl)}
          </span>
          <span 
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ 
              color: isPositive ? 'var(--accent-secondary)' : 'var(--accent-danger)',
              backgroundColor: isPositive ? 'rgba(38, 166, 154, 0.15)' : 'rgba(239, 83, 80, 0.15)'
            }}
          >
            {isPositive ? '+' : ''}{pnlPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
