import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-[#888888]">
          {label} {required && <span className="text-[#ff4444]">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${className} ${error ? 'border-[#ff4444]' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && <span className="text-xs text-[#ff4444]">{error}</span>}
    </div>
  );
};

export default Input;
