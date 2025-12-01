import React from "react";

export default function FloatingInput({ label, type, value, onChange, status }) {
  const active = value?.length > 0;

  // BORDER COLORS
  let borderColor = "border-gray-400 dark:border-gray-600";
  if (status === "checking") borderColor = "border-yellow-500";
  if (status === "error") borderColor = "border-red-500";
  if (status === "success") borderColor = "border-emerald-500";

  return (
    <div className="relative mb-4 group w-full">
      {/* INPUT */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 pr-10 pt-5 pb-2 
          bg-transparent 
          border ${borderColor}
          text-black dark:text-white 
          rounded-lg
          outline-none transition-all
          focus:border-emerald-500 
          focus:ring-2 focus:ring-emerald-500/40
        `}
      />

      {/* FLOATING LABEL */}
      <label
        className={`dark:text-white
          absolute left-4 px-1 
          pointer-events-none transition-all
          ${active 
            ? "-top-3 text-xs font-semibold" 
            : "top-3 text-gray-500 dark:text-gray-400"
          }
          bg-white dark:bg-neutral-900
        `}
      >
        {label}
      </label>

      {/* STATUS ICONS */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {status === "checking" && (
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        )}

        {status === "error" && (
          <span className="text-red-500 text-lg font-bold">✕</span>
        )}

        {status === "success" && (
          <span className="text-emerald-500 text-lg font-bold">✓</span>
        )}
      </div>
    </div>
  );
}
