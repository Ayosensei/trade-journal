import React from "react";

/**
 * Input Component - Technical Minimalist Design
 * Implements high-precision input fields with glassmorphism support.
 */
const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  error,
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
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${className} ${
          error ? "border-rose-500/50 ring-1 ring-rose-500/20" : ""
        } ${disabled ? "opacity-20 cursor-not-allowed grayscale" : ""}`}
        {...props}
      />
      {error && (
        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1.5 px-1">
          Error // {error}
        </span>
      )}
    </div>
  );
};

export default Input;
