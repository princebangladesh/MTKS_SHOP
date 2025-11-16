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
    setTimeout(() => setToast(null), 2500);
  };

  /* -------------------------------
     Variant — Prefer First Variant
  -------------------------------- */
  const variant = product?.variants?.length ? product.variants[0] : null;

  /* -------------------------------
     Category
  -------------------------------- */
  const categoryName =
    product?.category_name ||
    product?.category?.name ||
    "Category";

  /* -------------------------------
     Ratings
  -------------------------------- */
  const rawRating = Number(product?.rating);
  const safeRating = isNaN(rawRating) ? 0 : rawRating;
  const starRating = Math.max(0, Math.min(5, Math.round(safeRating)));

  /* -------------------------------
     Image Fallback
  -------------------------------- */
  const placeholder =
    "https://via.placeholder.com/300x200?text=No+Image";

  const productImage =
    variant?.image ||
    product?.image1 ||
    product?.image ||
    placeholder;

  /* -------------------------------
     Pricing (variant > product)
  -------------------------------- */
  const price = Number(
    variant?.price ??
    product?.current_price ??
    0
  );

  const oldPrice = Number(
    variant?.previous_price ??
    product?.previous_price ??
    0
  );

  const productName = product?.name || "Unnamed Product";

  /* -------------------------------
     Add to Cart
  -------------------------------- */
  const handleAdd = () => {
    const payload = variant
      ? { productId: product.id, variant, productData: product }
      : { product };

    addToCart(payload, 1);
    showToast("Added to Cart", productName, "success");
  };

  /* -------------------------------
     Add to Wishlist
  -------------------------------- */
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
        className="bg-[#e5e8ef] dark:bg-[#1a1a1a] rounded-xl flex items-center p-5
                   hover:shadow-lg transition-all duration-500 cursor-pointer
                   relative group"
        onClick={() => navigate(`/product/${product.id}`)}
      >

        {/* ---------------- IMAGE ---------------- */}
        <img
          src={productImage}
          alt={productName}
          className="w-32 h-32 object-cover rounded-lg
                     group-hover:scale-105 transition-all duration-500"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
        />

        {/* ---------------- TEXT ---------------- */}
        <div className="ml-6 flex-1">

          {/* Category */}
          <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
            {categoryName}
          </span>

          {/* Product Name */}
          <h3
            className="text-lg font-semibold text-brandGreen dark:text-white mt-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            {productName}
          </h3>

          {/* Rating */}
          <div className="flex items-center text-yellow-500 text-sm mt-1">
            {"★".repeat(starRating)}
            {"☆".repeat(5 - starRating)}
            <span className="text-gray-700 dark:text-gray-300 ml-1">
              ({safeRating.toFixed(1)})
            </span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-brandGreen dark:text-green-300 font-bold text-lg">
              ${price.toFixed(2)}
            </span>

            {oldPrice > 0 && (
              <span className="line-through text-gray-500 text-sm">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* ---------------- ACTION BUTTONS ---------------- */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3">

          {/* HEART / WISHLIST BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlist();
            }}
            className="opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0
                       transition-all duration-500
                       bg-[#062c30] p-3 rounded-lg shadow-md text-white flex items-center justify-center"
          >
            <CiHeart size={22} className="text-red-400" />
          </button>

          {/* CART BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className="opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0
                       transition-all duration-500
                       bg-[#062c30] p-3 rounded-lg shadow-md text-white flex items-center justify-center"
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
