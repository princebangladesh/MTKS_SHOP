import React from "react";

export default function FloatingInput({ label, type, value, onChange, status }) {
  const active = value?.length > 0;

  let borderColor = "border-gray-400";
  if (status === "checking") borderColor = "border-yellow-500";
  if (status === "error") borderColor = "border-red-500";
  if (status === "success") borderColor = "border-emerald-500";

  return (
    <div className="relative mb-4 group w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 pr-10 pt-5 pb-2 bg-transparent border ${borderColor}
          dark:border-gray-600 dark:text-white text-black rounded-lg
          outline-none transition-all
          focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40`}
      />

      <label
        className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 transition-all pointer-events-none
          ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}`}
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
          <span className="text-emerald-600 text-lg font-bold">✓</span>
        )}
      </div>
    </div>
  );
}
