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
    <div className="product-box bg-white dark:bg-black 
                p-3 sm:p-4 
                rounded-lg sm:rounded-xl 
                overflow-hidden flex flex-col justify-between shadow-sm">

  {/* IMAGE */}
  <div className="relative w-full">
    <img
      src={displayImage}
      alt={productName}
      className="w-full h-[150px] sm:h-[200px] 
                 object-cover rounded-lg 
                 scale-[0.9] md:group-hover:scale-110 
                 transition-all duration-500"
    />
  </div>

  {/* PRICE + CART */}
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
      className="absolute right-2 sm:right-1 
                 transition-all duration-300 
                 text-black dark:text-white"
    >
      <FaCartPlus size="1.4rem" />
    </button>
  </div>
</div>

  );
}

export default ProductLand;
