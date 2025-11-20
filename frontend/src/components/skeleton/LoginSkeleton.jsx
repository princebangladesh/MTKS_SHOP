import React from "react";

export default function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark:bg-black animate-pulse">
      <div className="w-full max-w-4xl h-[550px] bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
    </div>
  );
}
