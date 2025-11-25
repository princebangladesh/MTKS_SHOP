import React from "react";

function FloatingInput({ label, type, value, onChange }) {
  const active = value && value.length > 0;
  const isInvalid = active && value.length < 3; // simple validation for fields (password handled separately)

  return (
    <div className="relative mb-6 group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg
          dark:text-white text-black
          outline-none transition-all duration-300
          ${!active && !isInvalid ? "border-gray-500/40" : ""}
          ${isInvalid ? "border-red-500 ring-2 ring-red-500/30" : ""}
          ${active && !isInvalid ? "border-green-500 ring-2 ring-green-500/20" : ""}
          focus:border-green-500 focus:ring-2 focus:ring-green-500/40
        `}
      />

      <label
        className={`
          absolute left-4 px-1 bg-white dark:bg-neutral-900
          transition-all duration-300 pointer-events-none
          ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
          ${isInvalid ? "text-red-500" : ""}
          group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-green-500
        `}
      >
        {label}
      </label>

      {isInvalid && (
        <p className="text-red-500 text-xs mt-1 animate-fade">
          Must be at least 3 characters
        </p>
      )}
    </div>
  );
}

export default FloatingInput;
