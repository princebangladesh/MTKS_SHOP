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

  const placeholder = "https://via.placeholder.com/300x200?text=No+Image";

  const displayImage =
    variant?.image ||
    product?.image1 ||
    product?.image ||
    placeholder;

  const displayPrice = Number(
    variant?.price ?? product?.current_price ?? 0
  );

  const displayOldPrice = Number(
    variant?.previous_price ?? product?.previous_price ?? 0
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
    <div className="
      product-box bg-white dark:bg-black p-3 
      hover:shadow-xl rounded-xl overflow-hidden 
      group flex flex-col justify-between
    ">

      {/* IMAGE SECTION */}
      <div className="relative cursor-pointer flex justify-center items-center overflow-hidden">

        {/* DESKTOP ICONS */}
        <div className="
          absolute hidden md:flex flex-col 
          top-[15%] right-[-60%] opacity-0 
          md:group-hover:right-3 md:group-hover:opacity-100 
          transition-all duration-300 z-10
        ">
          <button
            className="p-3 mb-2 bg-brandGreen text-white rounded shadow hover:bg-green-700"
            onClick={handleWishlist}
          >
            <CiHeart size={22} />
          </button>

          <button className="p-3 mb-2 bg-brandGreen text-white rounded shadow">
            <BiRefresh size={22} />
          </button>

          <button
            className="p-3 mb-2 bg-brandGreen text-white rounded shadow hover:bg-green-700"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <CiSearch size={22} />
          </button>
        </div>

        <img
          src={displayImage}
          alt={productName}
          className="
            w-full h-[160px] object-cover 
            transition-all duration-500  
            md:group-hover:scale-110 rounded-lg
          "
          onClick={() => navigate(`/product/${product.id}`)}
        />
      </div>

      {/* MOBILE ACTION ICONS */}
      <div className="flex md:hidden justify-center gap-3 mt-3">
        <button
          className="p-2 bg-brandGreen text-white rounded shadow"
          onClick={handleWishlist}
        >
          <CiHeart size={20} />
        </button>

        <button className="p-2 bg-brandGreen text-white rounded shadow">
          <BiRefresh size={20} />
        </button>

        <button
          className="p-2 bg-brandGreen text-white rounded shadow"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <CiSearch size={20} />
        </button>

        <button
          className="p-2 bg-brandGreen text-white rounded shadow"
          onClick={handleAdd}
        >
          <FaCartPlus size={20} />
        </button>
      </div>

      {/* TEXT SECTION */}
      <div className="text py-3 pr-2">

        <div className="flex justify-between items-center">
          <Link to={`/category/${product.category_slug}`}>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {categoryName}
            </span>
          </Link>

          <p className="text-yellow-500 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.rating) ? "★" : "☆"}
              </span>
            ))}
          </p>
        </div>

        <h3
          className="
            text-[15px] font-semibold 
            dark:text-white leading-tight mt-2 
            cursor-pointer
          "
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {productName}
        </h3>

        {/* PRICE */}
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
            className="
              hidden md:block absolute right-[-60%] 
              md:group-hover:right-1 transition-all duration-300 
              text-black dark:text-white
            "
          >
            <FaCartPlus size="1.3rem" />
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
