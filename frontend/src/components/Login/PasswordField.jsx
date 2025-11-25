import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordField({ label, value, onChange, strength = null, simple = false }) {
  const [showPassword, setShowPassword] = useState(false);

  const active = value.length > 0;
  const isInvalid = active && value.length < 6 && !simple;

  let strengthTextColor = "text-gray-400";
  if (strength?.label === "Weak") strengthTextColor = "text-red-500";
  else if (strength?.label === "Okay") strengthTextColor = "text-orange-500";
  else if (strength?.label === "Strong") strengthTextColor = "text-green-500";
  else if (strength?.label === "Very strong") strengthTextColor = "text-emerald-500";

  const maxScore = 4;
  const widthPercent = strength ? (Math.min(strength.score, maxScore) / maxScore) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="relative group">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg
            dark:text-white text-black
            outline-none transition-all duration-300
            ${!active && !isInvalid ? "border-gray-500/40" : ""}
            ${isInvalid ? "border-red-500 ring-2 ring-red-500/30" : ""}
            ${!simple && value.length >= 6 ? "border-green-500 ring-2 ring-green-500/30" : ""}
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

        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {!simple && value.length > 0 && (
        <div className="mt-2 fade-in">
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500 transition-all duration-300"
              style={{ width: `${widthPercent}%` }}
            />
          </div>

          <p className={`mt-1 text-xs font-medium ${strengthTextColor}`}>
            {strength.label || "Too short"}
          </p>
        </div>
      )}

      {isInvalid && !simple && (
        <p className="text-red-500 text-xs mt-1 fade-in">
          Password must be at least 6 characters
        </p>
      )}
    </div>
  );
}

export default PasswordField;
