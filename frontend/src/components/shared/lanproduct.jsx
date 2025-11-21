import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { CiHeart, CiSearch } from "react-icons/ci";
import { BiRefresh } from "react-icons/bi";
import { useCart } from "./cartContext";
import Toast from "./toast";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "./wishlistcontext";

function ProductLand({ product }) {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  const showToast = (message, title, type) => {
    setToast({ message, title, type });
    setTimeout(() => setToast(null), 2500);
  };

  const variant = product?.variants?.length ? product.variants[0] : null;

  const categoryName =
    product?.category_name ||
    product?.category?.name ||
    "Category";

  const getDisplayImage = () => {
    const placeholder =
      "https://via.placeholder.com/300x200?text=No+Image";

    return (
      variant?.image ||
      product?.image1 ||
      product?.image ||
      placeholder
    );
  };

  const displayImage = getDisplayImage();

  const displayPrice = Number(
    variant?.price ??
    product?.current_price ??
    0
  );

  const displayOldPrice = Number(
    variant?.previous_price ??
    product?.previous_price ??
    0
  );

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
    <div className="product-box bg-white dark:bg-black p-4 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">

      {/* ------- IMAGE SECTION ------- */}
      <div className="relative w-full cursor-pointer">

        {/* MOBILE: icons always visible */}
        {/* DESKTOP: icons slide in on hover */}
        <div className="
          absolute top-3 right-3 z-10 flex flex-col gap-2 
          opacity-100 md:opacity-0 
          md:group-hover:opacity-100 
          transition-all duration-300
        ">
          <button
            className="p-3 bg-brandGreen text-white rounded-lg shadow-md"
            onClick={handleWishlist}
          >
            <CiHeart size={22} />
          </button>

          <button className="p-3 bg-brandGreen text-white rounded-lg shadow-md">
            <BiRefresh size={22} />
          </button>

          <button
            className="p-3 bg-brandGreen text-white rounded-lg shadow-md"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <CiSearch size={22} />
          </button>
        </div>

        <img
          src={displayImage}
          alt={productName}
          className="w-full h-[180px] sm:h-[220px] object-cover rounded-lg 
                      scale-[0.95] md:group-hover:scale-110 transition-all duration-500"
          />
              </div>

      {/* ------- TEXT DETAILS ------- */}
      <div className="pt-3">

        {/* Category + Rating */}
        <div className="flex justify-between items-center">
          <Link to={`/category/${product.category_slug}`}>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {categoryName}
            </span>
          </Link>

          <p className="text-yellow-500 text-xs sm:text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
            ))}
          </p>
        </div>

        {/* Name */}
        <h3
          className="text-[15px] sm:text-[16px] font-semibold dark:text-white mt-2 leading-snug"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {productName}
        </h3>

        {/* PRICE + ADD TO CART */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-brandGreen dark:text-green-300 font-semibold text-lg">
              ${displayPrice.toFixed(2)}
            </span>
            {displayOldPrice > 0 && (
              <span className="line-through text-gray-500 text-sm">
                ${displayOldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="p-2 bg-brandGreen text-white rounded-lg shadow hover:bg-green-700 active:scale-95 transition"
          >
            <FaCartPlus size={20} />
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

export default ProductLand;
