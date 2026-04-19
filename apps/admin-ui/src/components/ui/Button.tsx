import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading,
  className = "",
  disabled,
  ...props
}) => {
  const baseClass = variant === "secondary" ? "secondary-button" : "";
  const variantClass = variant === "danger" ? "danger-button" : ""; // We'll add this to CSS
  
  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "..." : children}
    </button>
  );
};
