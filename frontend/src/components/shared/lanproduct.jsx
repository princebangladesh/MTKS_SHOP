import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { CiHeart, CiSearch } from "react-icons/ci";
import { BiRefresh } from "react-icons/bi";
import { useCart } from "./cartContext";
import { useWishlist } from "./wishlistcontext";
import Toast from "./toast";
import { Link, useNavigate } from "react-router-dom";

function ProductLand({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  const showToast = (message, title, type) => {
    setToast({ message, title, type });
    setTimeout(() => setToast(null), 2000);
  };

  const variant = product?.variants?.length ? product.variants[0] : null;

  const categoryName =
    product?.category_name || product?.category?.name || "Category";

  const productName = product?.name || "Unnamed Product";

  const displayImage =
    variant?.image ||
    product?.image1 ||
    product?.image ||
    "https://via.placeholder.com/300x200?text=No+Image";

  const price = Number(variant?.price ?? product?.current_price ?? 0);
  const oldPrice = Number(variant?.previous_price ?? product?.previous_price ?? 0);
  const rating = Number(product?.rating ?? 0);

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
    <div
      className="
        bg-white dark:bg-[#0d0d0d]
        rounded-2xl 
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-xl 
        transition-all duration-300
        p-3 flex flex-col group
      "
    >
      {/* ================= IMAGE ================= */}
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={displayImage}
          alt={productName}
          className="
            w-full h-48 object-contain rounded-xl
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* RIGHT HOVER ICONS (DESKTOP) */}
        <div
          className="
            hidden md:flex flex-col gap-2
            absolute top-4 right-3
            opacity-0 translate-x-4
            group-hover:translate-x-0 group-hover:opacity-100
            transition-all duration-300 z-20
          "
        >
          <button
            className="
              bg-white dark:bg-[#1f1f1f]
              text-gray-800 dark:text-white
              p-3 rounded-full shadow border border-gray-200 dark:border-gray-600
              hover:bg-brandGreen hover:text-white
            "
            onClick={(e) => {
              e.stopPropagation();
              handleWishlist();
            }}
          >
            <CiHeart size={22} />
          </button>

          <button
            className="
              bg-white dark:bg-[#1f1f1f]
              text-gray-800 dark:text-white
              p-3 rounded-full shadow border border-gray-200 dark:border-gray-600
            "
          >
            <BiRefresh size={22} />
          </button>

          <button
            className="
              bg-white dark:bg-[#1f1f1f]
              text-gray-800 dark:text-white
              p-3 rounded-full shadow border border-gray-200 dark:border-gray-600
              hover:bg-brandGreen hover:text-white
            "
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            <CiSearch size={22} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE ICON ROW ================= */}
      <div className="md:hidden flex justify-center gap-3 mt-3">
        <button
          onClick={handleWishlist}
          className="bg-brandGreen text-white p-2 rounded-full shadow"
        >
          <CiHeart size={20} />
        </button>

        <button className="bg-brandGreen text-white p-2 rounded-full shadow">
          <BiRefresh size={20} />
        </button>

        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="bg-brandGreen text-white p-2 rounded-full shadow"
        >
          <CiSearch size={20} />
        </button>

        <button
          onClick={handleAdd}
          className="bg-brandGreen text-white p-2 rounded-full shadow"
        >
          <FaCartPlus size={20} />
        </button>
      </div>

      {/* ================= TEXT SECTION ================= */}
      <div className="mt-3 flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <Link to={`/category/${product.category_slug}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {categoryName}
            </p>
          </Link>

          <div className="text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
            ))}
          </div>
        </div>

        {/* TITLE WITH FADE + EXPAND */}
        <div className="mt-1 relative max-h-[44px] overflow-hidden group-hover:max-h-fit transition-all duration-300">
          <div
            className="
              absolute bottom-0 left-0 w-full h-6
              bg-gradient-to-t 
              from-white dark:from-[#0d0d0d]
              to-transparent
              pointer-events-none
              opacity-100 group-hover:opacity-0
              transition-opacity duration-300
            "
          />

          <h3
            className="
              font-semibold text-[14px] sm:text-[15px]
              leading-tight
              text-gray-900 dark:text-gray-100
              cursor-pointer
              line-clamp-2 group-hover:line-clamp-none
              break-words
            "
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {productName}
          </h3>
        </div>

        {/* ================= PRICE + CART BTN ================= */}
        <div className="flex justify-between items-center mt-auto pt-3 relative">
          <div className="flex gap-2 items-center">
            <span className="text-brandGreen dark:text-green-300 font-bold">
              ${price.toFixed(2)}
            </span>

            {oldPrice > 0 && (
              <span className="line-through text-gray-400 dark:text-gray-500 text-sm">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Desktop Cart Button (slides in cleanly) */}
          <button
            onClick={handleAdd}
            className="
              hidden md:flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white dark:bg-[#1e1e1e]
              border border-gray-200 dark:border-gray-600
              shadow text-brandGreen dark:text-white

              absolute right-2 top-1/2 -translate-y-1/2
              opacity-0 translate-x-4 pointer-events-none
              group-hover:opacity-100 group-hover:translate-x-0 
              group-hover:pointer-events-auto

              transition-all duration-300
            "
          >
            <FaCartPlus size={18} />
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <Toast 
          message={toast.message}
          title={toast.title}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ProductLand;
