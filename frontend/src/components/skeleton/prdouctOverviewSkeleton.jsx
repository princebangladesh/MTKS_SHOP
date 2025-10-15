import React from 'react'

function ProductOverviewSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8 animate-pulse">
      {/* Left: Image */}
      <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
        <div className="w-[400px] h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 w-2/3 rounded" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/3 rounded" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/4 rounded" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 w-1/2 rounded" />

        {/* Color selection */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 w-20 rounded" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
            ))}
          </div>
        </div>

        {/* Size selection */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 w-20 rounded" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-32 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>

        {/* Warranty Info */}
        <div className="space-y-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 w-3/4 rounded" />
          ))}
        </div>

        {/* SKU info */}
        <div className="space-y-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-300 dark:bg-gray-700 w-2/3 rounded" />
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductOverviewSkeleton