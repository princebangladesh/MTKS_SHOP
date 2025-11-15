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
  const [toast, setToast] = React.useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const showToast = (message, name, type) => {
    setToast({ message, name, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };

  // Get first variant if available
  const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

  // Helper to get image fallback safely
  const getDisplayImage = () => {
  const placeholder = "https://via.placeholder.com/300x200?text=No+Image";
  const variantImage = variant?.image;
  const productImage = product?.image1;

  if (variantImage && variantImage.trim() !== "") return variantImage;
  if (productImage && productImage.trim() !== "") return productImage;
  return placeholder;
};

const displayImage = getDisplayImage();

// ✅ Use variant price if available, fallback to product price
const displayPrice = variant
  ? Number(variant.price)
  : Number(product.current_price || 0);

const displayOldPrice = variant
  ? Number(variant.previous_price || product.previous_price || 0)
  : Number(product.previous_price || 0);

const productName = product.name || "Unnamed Product";

  const handleAdd = () => {
    let payload;
    if (variant) {
      payload = {
        productId: product.id,
        variant,
        productData: product,
      };
    } else {
      payload = { product };
    }
    addToCart(payload, 1);
    showToast("Item Added to Cartlist", productName, "success");
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      showToast("Item already in Wishlist", productName, "info");
    } else {
      addToWishlist(product);
      showToast("Item Added to Wishlist", productName, "success");
    }
  };

  return (
    <div className="product-box bg-white dark:bg-black p-4 hover:shadow-xl overflow-hidden group h-full flex flex-col justify-between">
      <div className="relative cursor-pointer h-full flex justify-center items-center overflow-hidden">
        <div className="absolute flex flex-col top-[15%] right-[-50%] opacity-0 group-hover:right-3 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            className="p-4 mb-2 bg-brandGreen/90 text-white shadow hover:bg-brandGreen transition-all duration-500"
            onClick={handleWishlist}
            aria-label={`Add ${productName} to wishlist`}
          >
            <CiHeart size={24} />
          </button>
          <button className="p-4 mb-2 bg-brandGreen/90 text-white shadow hover:bg-brandGreen transition-all duration-500">
            <BiRefresh size={24} />
          </button>
          <button className="p-4 mb-2 bg-brandGreen/90 text-white shadow hover:bg-brandGreen transition-all duration-500">
            <CiSearch size={24} />
          </button>
        </div>

        <img
          src={displayImage}
          alt={productName}
          className="w-full h-auto my-2 object-cover transition-all duration-500 group-hover:scale-125"
        />
      </div>

      <div className="text py-3 pr-3">
        <div className="flex justify-between">
          <Link to={`/category/${product.category_name}`}>
            <span className="text-sm text-gray-500">{product.category_name}</span>
          </Link>

          <p
            className="mb-0 text-right cursor-pointer dark:text-brandWhite"
            aria-label={`Rating: ${product.rating} out of 5`}
          >
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
            ))}
          </p>
        </div>

        <h3
          className="text-[16px] font-semibold leading-tight h-[2.4em] line-clamp-2 overflow-hidden dark:text-brandWhite cursor-pointer"
          onClick={() => handleNavigate(product.id)}
          aria-label={`View details for ${productName}`}
        >
          {productName}
        </h3>

        <div className="pricing justify-between items-center relative flex overflow-hidden">
          <div className="mt-1 price flex flex-row items-center gap-2">
            <span className="new-price text-brandGreen dark:text-gray-300 font-semibold">
              ${displayPrice.toFixed(2)}
            </span>
            {product.previous_price && (
              <span className="old-price text-gray-500 line-through text-sm ">
                ${displayOldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="absolute right-[-50%] sm:right[-20%] group-hover:right-2 transition-all duration-300 text-brandBlue dark:text-brandWhite"
            aria-label={`Add ${productName} to cart`}
          >
            <FaCartPlus size="1.5rem" />
          </button>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            title={toast.name}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default ProductLand;
