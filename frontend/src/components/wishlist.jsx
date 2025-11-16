import React from "react";
import { useCart } from "./shared/cartContext";
import { useWishlist } from "./shared/wishlistcontext";
import Toast from "./shared/toast";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, loading } = useWishlist();

  const [toast, setToast] = React.useState(null);

  const showToast = (message, name, type) => {
    setToast({ message, name, type });
    setTimeout(() => setToast(null), 3000);
  };

  const list = wishlist || [];

  const getImage = (product) => {
    if (product.variants?.length > 0 && product.variants[0]?.image)
      return product.variants[0].image;

    if (product.image1) return product.image1;

    return "https://placehold.co/400x400?text=No+Image";
  };

  const getPrice = (product) => {
    if (product.variants?.length > 0)
      return Number(product.variants[0].price || 0);

    return Number(product.current_price || 0);
  };

  const handleAddToCart = (product) => {
    if (product.variants?.length > 0) {
      addToCart(
        {
          productId: product.id,
          variant: product.variants[0],
          productData: product,
        },
        1
      );
    } else {
      addToCart({ productData: product }, 1);
    }

    showToast("Added to cart", product.name, "success");
  };

  const handleRemove = (id, name) => {
    removeFromWishlist(id);
    showToast("Removed from wishlist", name, "error");
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-600 dark:text-gray-300">
        Loading...
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-900 dark:text-gray-200 transition">

      <h2 className="text-3xl font-bold text-center mb-8 dark:text-gray-100">
        My Wishlist ❤️
      </h2>

      {list.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Your wishlist is empty.
          <Link
            to="/shop"
            className="ml-2 text-blue-500 dark:text-blue-400 underline"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((product) => {
            const image = getImage(product);
            const price = getPrice(product);

            return (
              <div
                key={product.id}
                className="
                  border border-gray-200 dark:border-gray-700
                  rounded-lg 
                  bg-white dark:bg-gray-800 
                  p-4 shadow hover:shadow-lg 
                  dark:shadow-gray-900/40 
                  transition
                "
              >
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-3 rounded"
                />

                <h3 className="text-lg font-semibold dark:text-gray-100">
                  {product.name}
                </h3>

                <p className="text-brandGreen font-bold mt-1">
                  ${price.toFixed(2)}
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="
                      px-4 py-2 rounded 
                      bg-green-600 hover:bg-green-700 
                      text-white 
                      transition
                    "
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(product.id, product.name)}
                    className="
                      px-4 py-2 rounded 
                      bg-red-600 hover:bg-red-700 
                      text-white 
                      transition
                    "
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          title={toast.name}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default WishlistPage;
