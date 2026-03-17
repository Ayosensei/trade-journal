import React from "react";

/**
 * Button Component - Technical Minimalist Design
 * Supports primary and secondary variants with glassmorphism and haptic scaling.
 */
const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  icon: Icon,
  title,
}) => {
  const baseClasses = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseClasses} ${className} ${
        disabled ? "opacity-20 cursor-not-allowed grayscale" : "active:scale-[0.97]"
      }`}
    >
      {Icon && (
        <Icon
          size={14}
          className={variant === "primary" ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}
        />
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;
