import React from "react";

export default function AnimatedSocialButton({ icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        p-4 rounded-full border border-gray-300 dark:border-gray-500
        bg-white/80 dark:bg-neutral-800/80 shadow-sm
        hover:shadow-lg active:shadow-md
        hover:opacity-90 active:opacity-80
        transition-all
      "
      style={{ color }}
    >
      {icon}
    </button>
  );
}
