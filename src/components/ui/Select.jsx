import React from 'react';

const Select = ({ 
  label,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = '',
  error,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-[#888888]">
          {label} {required && <span className="text-[#ff4444]">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`select ${className} ${error ? 'border-[#ff4444]' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[#ff4444]">{error}</span>}
    </div>
  );
};

export default Select;
