import React from "react";
import { FaTrash, FaCartPlus } from "react-icons/fa";
import { useWishlist } from "../shared/wishlistcontext";
import { useCart } from "../shared/cartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 text-center">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-200">
          Your wishlist is empty ❤️
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Start adding products you love!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 transition-all">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Your Wishlist 💜
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const product = item.product || item;

          const img =
            product?.image ||
            product?.image1 ||
            product?.variants?.[0]?.image ||
            "https://via.placeholder.com/200";

          // 🔹 Robust price detection (variant > current_price > display_price > price)
          const rawPrice =
            (product?.variants?.length
              ? product.variants[0].price
              : product?.current_price ??
                product?.display_price ??
                product?.price ??
                0) || 0;

          const price = Number(rawPrice);

          return (
            <div
              key={product.id}
              className="
                rounded-lg border border-gray-200 dark:border-gray-600 
                bg-white dark:bg-gray-900 shadow hover:shadow-lg 
                transition p-4 relative flex flex-col
              "
            >
              {/* Delete Button */}
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="
                  absolute top-3 right-3 
                  bg-red-100 dark:bg-red-400/20 
                  text-red-500 dark:text-red-300 
                  p-2 rounded-full hover:bg-red-200 
                  transition
                "
              >
                <FaTrash size={14} />
              </button>

              {/* Image */}
              <img
                src={img}
                alt={product.name}
                className="w-full h-40 object-contain mb-3 rounded"
              />

              {/* Name */}
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-2">
                {product.name}
              </h3>

              {/* Price */}
              <p className="text-brandGreen dark:text-green-300 font-bold text-lg mt-2">
                ${price.toFixed(2)}
              </p>

              {/* Add to Cart Button */}
              <button
                className="
                  mt-auto w-full flex items-center justify-center gap-2
                  bg-brandGreen text-white py-2 rounded-lg 
                  hover:bg-green-700 transition
                "
                onClick={() =>
                  addToCart({ productId: product.id, productData: product }, 1)
                }
              >
                <FaCartPlus />
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
