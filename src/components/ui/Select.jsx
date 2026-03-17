import React from "react";

/**
 * Select Component - Technical Minimalist Design
 * Implements high-precision dropdown menus with custom technical styling.
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = "",
  error,
  placeholder = "Select an option",
  ...props
}) => {
  return (
    <div className="flex flex-col w-full group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-blue-500 transition-colors mb-1.5 block">
          {label}
          {required && <span className="text-blue-500 ml-1 opacity-50">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`select ${className} ${
            error ? "border-rose-500/50 ring-1 ring-rose-500/20" : ""
          } ${disabled ? "opacity-20 cursor-not-allowed grayscale" : ""}`}
          {...props}
        >
          <option value="" disabled className="bg-slate-900 text-slate-600">
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option
              key={index}
              value={option.value || (typeof option === "string" ? option : "")}
              className="bg-slate-900 text-slate-200 py-2"
            >
              {option.label || option}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1.5 px-1">
          Constraint_Violation // {error}
        </span>
      )}
    </div>
  );
};

export default Select;
