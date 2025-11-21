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

  // -------------------------------
  // ✅ Variant Fix (pick first)
  // -------------------------------
  const variant = product?.variants?.length ? product.variants[0] : null;

  // -------------------------------
  // ✅ Category Fix (always name)
  // -------------------------------
  const categoryName =
    product?.category_name ||
    product?.category?.name ||
    "Category";

  // -------------------------------
  // ✅ Image Fix (variant > product > placeholder)
  // -------------------------------
  const getDisplayImage = () => {
    const placeholder = "https://via.placeholder.com/300x200?text=No+Image";

    return (
      variant?.image ||
      product?.image1 ||
      product?.image ||
      placeholder
    );
  };

  const displayImage = getDisplayImage();

  // -------------------------------
  // ✅ Price Fix (variant > product)
  // -------------------------------
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

  // -------------------------------
  // ✅ Add to Cart
  // -------------------------------
  const handleAdd = () => {
    const payload = variant
      ? { productId: product.id, variant, productData: product }
      : { product };

    addToCart(payload, 1);
    showToast("Added to Cart", productName, "success");
  };

  // -------------------------------
  // ✅ Add to Wishlist
  // -------------------------------
  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      showToast("Already in Wishlist", productName, "info");
    } else {
      addToWishlist(product);
      showToast("Added to Wishlist", productName, "success");
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="product-box bg-white dark:bg-black p-4 hover:shadow-xl rounded-xl overflow-hidden group flex flex-col justify-between">

      {/* ---------------- Image Section ---------------- */}
      <div className="relative cursor-pointer flex justify-center items-center overflow-hidden">
        <div className="absolute flex flex-col top-[15%] right-[-50%] opacity-0 
          group-hover:right-3 group-hover:opacity-100 transition-all duration-300 z-10">

          <button
            className="p-4 mb-2 bg-brandGreen text-white rounded shadow hover:bg-green-700 transition"
            onClick={handleWishlist}
          >
            <CiHeart size={24} />
          </button>

          <button className="p-4 mb-2 bg-brandGreen text-white rounded shadow hover:bg-green-700 transition">
            <BiRefresh size={24} />
          </button>

          <button
            className="p-4 mb-2 bg-brandGreen text-white rounded shadow hover:bg-green-700 transition"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <CiSearch size={24} />
          </button>
        </div>

        <img
          src={displayImage}
          alt={productName}
          className="w-full h-[220px] object-cover transition-all duration-500  group-hover:scale-110 rounded-lg"
        />
      </div>

      {/* ---------------- Text / Details ---------------- */}
      <div className="text py-3 pr-3">

        {/* Category + Rating */}
        <div className="flex justify-between items-center">
          <Link to={`/category/${product.category_slug}`}>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {categoryName}
            </span>
          </Link>

          <p className="text-yellow-500 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
            ))}
          </p>
        </div>

        {/* Product Name */}
        <h3
          className="text-[16px] font-semibold dark:text-white leading-tight mt-2 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {productName}
        </h3>

        {/* Price Section */}
        <div className="pricing mt-2 flex justify-between items-center relative">
          <div className="flex gap-2 items-center">
            <span className="text-brandGreen dark:text-green-300 font-semibold">
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
            className="absolute right-[-50%] group-hover:right-1 transition-all duration-300 text-black dark:text-white"
          >
            <FaCartPlus size="1.4rem" />
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
