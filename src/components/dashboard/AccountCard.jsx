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
      className={`card cursor-pointer transition-all duration-200 ${
        isActive ? 'border-[#d4ff00] bg-[#2a2a2a]' : 'hover:border-[#444444]'
      }`}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-[#888888]">{account.name}</h3>
        <div className="text-3xl font-bold text-white">
          ${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm">
          <span className="font-medium text-[#888888]">Current Balance</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-lg font-semibold ${isPositive ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
            {formatCurrency(pnl)}
          </span>
          <span className={`text-sm ${isPositive ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
            {formatPercentage(pnlPercentage)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
