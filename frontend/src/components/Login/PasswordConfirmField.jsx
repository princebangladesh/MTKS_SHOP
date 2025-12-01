import React from "react";

export default function PasswordConfirmField({
  label,
  value,
  onChange,
  password,
}) {
  const active = value.length > 0;
  const match = value === password;

  return (
    <div className="mb-4">
      <div className="relative group">
        <input
          type="password"
          value={value}
          onChange={onChange}
          className={`w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg outline-none 
          ${
            match && active
              ? "border-emerald-500 ring-2 ring-emerald-500/30"
              : "border-gray-400"
          }
          ${
            !match && active
              ? "border-red-500 ring-2 ring-red-500/30"
              : ""
          }`}
        />

        <label
          className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 transition-all dark:text-white
            ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}`}
        >
          {label}
        </label>
      </div>

      {!match && active && (
        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
      )}
    </div>
  );
}
