import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-zinc-700">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 text-sm border font-medium bg-white rounded-none outline-hidden transition duration-200 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-zinc-300 focus:border-[#3643BA] focus:ring-1 focus:ring-[#3643BA]"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-bold text-red-500 mt-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};
