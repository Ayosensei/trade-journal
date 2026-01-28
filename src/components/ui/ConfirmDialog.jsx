import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="max-w-md w-full rounded-lg border p-5" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: variant === 'danger' 
                  ? 'rgba(239, 83, 80, 0.15)' 
                  : 'rgba(255, 152, 0, 0.15)' 
              }}
            >
              <AlertTriangle 
                size={20} 
                style={{ 
                  color: variant === 'danger' 
                    ? 'var(--accent-danger)' 
                    : 'var(--accent-warning)' 
                }} 
              />
            </div>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          </div>
          <button 
            onClick={onCancel} 
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: variant === 'danger' 
                ? 'rgba(239, 83, 80, 0.15)'
                : 'rgba(255, 152, 0, 0.15)',
              color: variant === 'danger' 
                ? 'var(--accent-danger)' 
                : 'var(--accent-warning)',
              border: `1px solid ${variant === 'danger' ? 'rgba(239, 83, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
