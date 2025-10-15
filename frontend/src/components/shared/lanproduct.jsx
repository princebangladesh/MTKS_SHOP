import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { CiSearch, CiHeart } from "react-icons/ci";
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
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAdd = () => {
    addToCart(product);
    showToast("Item Added to Cartlist", product?.name, "success");
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      showToast("Item already in Wishlist", product?.name, "info");
    } else {
      addToWishlist(product);
      showToast("Item Added to Wishlist", product?.name, "success");
    }
  };

  return (
    <div className="product-box bg-white dark:bg-black p-4 hover:shadow-xl overflow-hidden group h-full flex flex-col justify-between"
    >
      <div className="relative cursor-pointer h-full flex justify-center items-center overflow-hidden">
        <div className="absolute flex flex-col top-[15%] right-[-50%] opacity-0 group-hover:right-3 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            className="p-4 mb-2 bg-brandGreen/90 text-white shadow hover:bg-brandGreen transition-all duration-500"
            onClick={handleWishlist}
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
          src={product?.image1}
          alt={product?.name}
          className="w-full h-auto my-2 object-cover transition-all duration-500 group-hover:scale-125"
        />
      </div>

      <div className="text py-3 pr-3">
        <div className="flex justify-between">
          <Link to={`/category/${product?.category_slug}`}>
            <span className="text-sm text-gray-500">{product?.category_name}</span>
          </Link>
          
          <p className="mb-0 text-right cursor-pointer dark:text-brandWhite">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < product?.rating ? "★" : "☆"}</span>
            ))}
          </p>
        </div>

        <h3
          className="text-[16px] font-semibold leading-tight h-[2.4em] line-clamp-2 overflow-hidden dark:text-brandWhite cursor-pointer"
          onClick={() => handleNavigate(product.id)}
        >
          {product?.name}
        </h3>

        {/* ✅ Pricing Section Fixed */}
        <div className="pricing justify-between items-center relative flex overflow-hidden">
          <div className="mt-1 price flex flex-row items-center gap-2">
            <span className="new-price text-brandGreen dark:text-gray-300 font-semibold">
              ${product?.current_price?.toFixed(2)}
            </span>
            {product?.previous_price && (
              <span className="old-price text-gray-500 line-through text-sm ">
                ${product?.previous_price?.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="absolute right-[-50%] sm:right[-20%] group-hover:right-2 transition-all duration-300 text-brandBlue dark:text-brandWhite"
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
