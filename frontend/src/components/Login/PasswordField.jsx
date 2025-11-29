import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordField({
  label,
  value,
  onChange,
  strength = null,
  simple = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const active = value.length > 0;

  return (
    <div className="mb-4">
      <div className="relative group">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full px-4 pt-5 pb-2 bg-transparent border border-gray-400
            dark:border-gray-600 dark:text-white text-black rounded-lg
            outline-none transition-all
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
        />

        <label
          className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 transition-all 
            ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}`}
        >
          {label}
        </label>

        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* PASSWORD STRENGTH BAR */}
      {!simple && strength && value.length >= 6 && (
        <div className="mt-2">
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
              style={{ width: `${(strength.score / 4) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1">{strength.label}</p>
        </div>
      )}
    </div>
  );
}
