import React from 'react'
 
function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-70 z-50">
    <div className="w-10 h-10 border-4 border-blue-500 dark:border-cyan border-dashed rounded-full animate-spin border-t-transparent"></div>
  </div>
  )
}

export default Loader