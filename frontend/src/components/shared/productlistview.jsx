import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import Toast from "./toast";
import { useCart } from "./cartContext";
import { useWishlist } from "./wishlistcontext";
import { useNavigate } from "react-router-dom";

function ProductListView({ product }) {
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const showToast = (message, title, type) => {
    setToast({ message, title, type });
    setTimeout(() => setToast(null), 2200);
  };

  const variant = product?.variants?.length ? product.variants[0] : null;
  const categoryName =
    product?.category_name || product?.category?.name || "Category";

  const rating = Number(product?.rating) || 0;
  const starRating = Math.max(0, Math.min(5, Math.round(rating)));

  const placeholder = "https://via.placeholder.com/300x200?text=No+Image";

  const productImage =
    variant?.image || product?.image1 || product?.image || placeholder;

  const price = Number(variant?.price ?? product?.current_price ?? 0);
  const oldPrice = Number(variant?.previous_price ?? product?.previous_price ?? 0);

  const productName = product?.name || "Unnamed Product";

  const handleAdd = () => {
    const payload = variant
      ? { productId: product.id, variant, productData: product }
      : { product };
    addToCart(payload, 1);
    showToast("Added to Cart", productName, "success");
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      showToast("Already in Wishlist", productName, "info");
    } else {
      addToWishlist(product);
      showToast("Added to Wishlist", productName, "success");
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          bg-[#e6ebf2] dark:bg-[#1a1a1a]
          rounded-2xl p-4
          flex items-center gap-4
          hover:shadow-lg transition-all duration-300
          cursor-pointer relative
        "
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {/* IMAGE */}
        <img
          src={productImage}
          alt={productName}
          className="
            w-28 h-28
            object-cover rounded-xl
          "
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
        />

        {/* TEXT SECTION */}
        <div className="flex-1">
          <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
            {categoryName}
          </span>

          <h3
            className="
              text-lg font-semibold text-black
              dark:text-white mt-1
            "
          >
            {productName}
          </h3>

          <div className="flex items-center text-yellow-500 text-sm mt-1">
            {"★".repeat(starRating)}
            {"☆".repeat(5 - starRating)}
            <span className="text-gray-700 dark:text-gray-300 ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-brandGreen font-bold text-xl">
              ${price.toFixed(2)}
            </span>

            {oldPrice > 0 && (
              <span className="line-through text-gray-500 text-sm">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* MOBILE BUTTONS — ALWAYS VISIBLE (JUST LIKE SCREENSHOT) */}
        <div className="flex flex-col gap-3">

          {/* HEART BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlist();
            }}
            className="
              bg-[#062c30]
              w-12 h-12 rounded-xl
              flex items-center justify-center
              shadow-md text-white
              transition-all duration-300
              hover:scale-110
            "
          >
            <CiHeart size={22} className="text-red-400" />
          </button>

          {/* CART BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className="
              bg-[#062c30]
              w-12 h-12 rounded-xl
              flex items-center justify-center
              shadow-md text-white
              transition-all duration-300
              hover:scale-110
            "
          >
            <FaCartPlus size={22} />
          </button>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            title={toast.title}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default ProductListView;
