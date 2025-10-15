import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-70 z-50">
          <div className="w-10 h-10 border-4 border-blue-500 dark:border-cyan-400 border-dashed rounded-full animate-spin border-t-transparent" />
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);