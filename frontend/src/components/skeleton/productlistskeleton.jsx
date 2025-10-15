import React from 'react'

function ProductListSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Image */}
      <div className="w-full aspect-square bg-gray-300 rounded" />

      {/* Category */}
      <div className="h-4 bg-gray-300 rounded w-1/3" />

      {/* Title */}
      <div className="h-5 bg-gray-400 rounded w-2/3" />

      {/* Price */}
      <div className="flex gap-2">
        <div className="h-4 bg-gray-300 rounded w-1/5" />
        <div className="h-4 bg-gray-200 rounded w-1/5" />
      </div>

      {/* Rating */}
      <div className="h-4 bg-gray-300 rounded w-1/4" />
    </div>
  )
}

export default ProductListSkeleton