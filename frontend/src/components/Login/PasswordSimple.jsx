import React, { useState } from "react";

const PasswordSimple = ({
  value,
  onChange,
  placeholder = "Password",
  name = "password",
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      {/* Password Field */}
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg 
          focus:ring-2 focus:ring-green-500 focus:border-green-500
          dark:bg-neutral-800 dark:text-white dark:border-neutral-600
          outline-none transition-all ${className}`}
      />

      {/* Show / Hide */}
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 
          text-gray-500 dark:text-gray-300 text-sm hover:text-gray-700"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default PasswordSimple;
