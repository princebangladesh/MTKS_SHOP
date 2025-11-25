import React from "react";

export default function SlidingPanel({ isSignUp }) {
  return (
    <div
      className={`hidden md:block absolute inset-0 bg-emerald-500 rounded-3xl shadow-xl transform transition-all duration-700 ${
        isSignUp ? "translate-x-0" : "translate-x-full"
      }`}
    ></div>
  );
}
