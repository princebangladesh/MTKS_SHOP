import React from "react";

export default function AnimatedSocialButton({ icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-full border border-gray-300 dark:border-gray-500
       bg-white/80 dark:bg-neutral-800/80 shadow-sm
       hover:scale-125 active:scale-95 transition-all"
      style={{ color }}
    >
      {icon}
    </button>
  );
}
