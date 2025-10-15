import React from 'react';
import { useCart } from '../shared/cartContext';
const CartSkeleton = () => {
  const { cart } = useCart(); // Simulate 4 cart items
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const skeletonRows = Array.from({ length: cart.length || 4 }, (_, i) => i); // At least 4 rows

  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      {/* Heading */}
      <div className="h-6 w-48 bg-gray-300 rounded mb-6" />

      {/* Table headers */}
      <div className="grid grid-cols-6 font-semibold text-gray-600 border-b pb-2 mb-4">
        <span className="col-span-3">Item</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Total</span>
      </div>

      {/* Product row skeletons */}
      {skeletonRows.map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-6 items-center gap-4 border-b py-4"
        >
          {/* Image + Name */}
          <div className="col-span-3 flex gap-4 items-center">
            <div className="w-20 h-20 bg-gray-300 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-300 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Price */}
          <div className="h-4 w-12 bg-gray-300 rounded" />

          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-300 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-300 rounded" />
          </div>

          {/* Total & Delete */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-14 bg-gray-300 rounded" />
            <div className="h-5 w-5 bg-gray-400 rounded-full ml-2" />
          </div>
        </div>
      ))}

      {/* Summary section */}
      <div className="mt-8 text-right space-y-4">
        <div className="h-4 w-40 bg-gray-300 ml-auto rounded" />
        <div className="h-4 w-48 bg-gray-300 ml-auto rounded" />

        {/* Coupon */}
        <div className="flex justify-end items-center gap-2">
          <div className="w-40 h-8 bg-gray-200 rounded" />
          <div className="w-24 h-8 bg-gray-300 rounded" />
        </div>

        {/* Grand Total */}
        <div className="h-6 w-56 bg-gray-400 ml-auto rounded" />

        {/* Clear Cart */}
        <div className="h-10 w-32 bg-red-300 ml-auto rounded" />
      </div>
    </div>
  );
};

export default CartSkeleton;
