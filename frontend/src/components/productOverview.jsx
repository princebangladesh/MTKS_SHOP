import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductOverviewSkeleton from "./skeleton/prdouctOverviewSkeleton";
import { useCart } from "./shared/cartContext";
import { useWishlist } from "./shared/wishlistcontext";
import Toast from "./shared/toast";
import { BASE_URL } from "../config/api";

function ProductOverview() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Zoom
  const imageRef = useRef(null);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Fetch Product
  useEffect(() => {
    setLoading(true);

    fetch(`${BASE_URL}/productlist/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        if (data.variants?.length > 0) {
          const first = data.variants[0];
          setActiveVariant(first);
          setSelectedColor(first.color);
          setSelectedImage(first.image);
        } else {
          setSelectedImage(data.image1);
        }

        setQuantity(1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Update variant on color change
  useEffect(() => {
    if (!product?.variants) return;

    const match = product.variants.find(
      (v) => v.color?.id === selectedColor?.id
    );

    if (match) {
      setActiveVariant(match);
      setSelectedImage(match.image);
    }
  }, [selectedColor]);

  // Toast
  const showToast = (message, title, type) => {
    setToast({ message, title, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Add to wishlist
  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      showToast("Already in wishlist", product.name, "info");
    } else {
      addToWishlist(product);
      showToast("Added to wishlist", product.name, "success");
    }
  };

  // Add to cart
  const handleCart = () => {
    if (!activeVariant && !product.variants?.length) {
      addToCart({ productId: product.id, productData: product }, quantity);
    } else {
      addToCart(
        {
          productId: product.id,
          variant: activeVariant,
          productData: product,
        },
        quantity
      );
    }

    showToast("Added to Cart", product.name, "success");
  };

  // Zoom logic
  const handleMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({ x, y });
  };

  if (loading) return <ProductOverviewSkeleton />;
  if (!product)
    return (
      <div className="p-6 text-center dark:text-gray-300">
        Product not found.
      </div>
    );

  const variants = product.variants || [];

  const colors = [
    ...new Map(variants.map((v) => [v.color?.id, v.color])).values(),
  ];

  const price = activeVariant?.price || product.current_price;
  const previousPrice =
    activeVariant?.previous_price || product.previous_price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-black dark:text-white transition">
      {/* ========== TOAST ========== */}
      {toast && (
        <Toast
          message={toast.message}
          title={toast.title}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col md:flex-row gap-16">
        {/* ========== IMAGE ========== */}
        <div className="md:w-1/2">
          <div
            ref={imageRef}
            className="relative w-[420px] h-[420px] border dark:border-gray-700 rounded-lg overflow-hidden mx-auto cursor-zoom-in"
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
            onMouseMove={handleMove}
          >
            <img
              src={selectedImage}
              className="object-cover w-full h-full"
              alt={product.name}
            />

            {zooming && (
              <div
                className="absolute inset-0 bg-no-repeat pointer-events-none bg-white dark:bg-black"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  backgroundSize: "200%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            )}
          </div>

          {/* THUMBNAILS */}
          {variants.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {variants.map((v, i) => (
                <img
                  key={i}
                  src={v.image}
                  className={`h-20 rounded border cursor-pointer object-cover transition
                  ${
                    selectedImage === v.image
                      ? "border-teal-500 ring-2 ring-teal-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() => {
                    setActiveVariant(v);
                    setSelectedColor(v.color);
                    setSelectedImage(v.image);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========== DETAILS ========== */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold dark:text-white">{product.name}</h1>

          {/* BRAND */}
          <p className="text-sm dark:text-gray-300">
            Brand:{" "}
            <span className="font-semibold dark:text-white">
              {product.brand?.name}
            </span>
          </p>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-teal-600">
              ${price}
            </span>
            {previousPrice && (
              <span className="line-through text-gray-500 dark:text-gray-400">
                ${previousPrice}
              </span>
            )}
          </div>

          {/* COLOR PICKER */}
          {colors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 dark:text-white">Color:</h4>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      backgroundColor: c.colour_code,
                      borderColor:
                        selectedColor?.id === c.id ? "black" : "#999",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="flex items-center gap-4">
            <button
              className="px-3 py-1 border rounded dark:border-gray-700"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>

            <input
              type="number"
              value={quantity}
              className="w-16 text-center border dark:bg-gray-900 dark:border-gray-700 rounded"
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />

            <button
              className="px-3 py-1 border rounded dark:border-gray-700"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCart}
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className="bg-gray-300 dark:bg-gray-800 dark:text-white px-6 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700 transition"
            >
              Add to Wishlist
            </button>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            {activeVariant && (
              <>
                <p>
                  <strong>SKU:</strong> {activeVariant.sku?.code || 'N/A'}
                </p>
                <p className={activeVariant.quantity > 0 ? 'text-green-700' : 'text-red-500'}>
                  {activeVariant.quantity === 0
                    ? 'Out of stock'
                    : activeVariant.quantity < 5
                    ? `Only ${activeVariant.quantity} left!`
                    : `In stock: ${activeVariant.quantity}`}
                </p>
                {activeVariant.price && (
                  <p>
                    <strong>Variant Price:</strong> ${activeVariant.price}
                  </p>
                )}
              </>
            )}

            {/* Warranty & Return Policy */}
            <p>
              <span role="img" aria-label="warranty">
                🛡️
              </span>{' '}
              1 Year AL Jazeera Brand Warranty
            </p>
            <p>
              <span role="img" aria-label="return">
                🔄
              </span>{' '}
              30 Day Return Policy
            </p>
            <p>
              <span role="img" aria-label="cash">
                💵
              </span>{' '}
              Cash on Delivery available
            </p>

            {/* Availability */}
            <p>
              <strong>Availability:</strong> {product.availability || 'In Stock'}
            </p>
          </div>
        </div>
      </div>
              
      {/* ========== TABS SECTION ========== */}
      <div className="mt-12">
        {/* TABS */}
        <div className="flex gap-10 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-lg ${
              activeTab === "description"
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("specification")}
            className={`pb-3 text-lg ${
              activeTab === "specification"
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Specification
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="py-8 dark:text-gray-300">
          {activeTab === "description" && (
            <p>{product.description || "No description available."}</p>
          )}

          {activeTab === "specification" && (
            <ul className="space-y-2">
              {product.model && <li>Model: {product.model}</li>}
              <li>Brand: {product.brand?.name}</li>
              <li>Price: ${price}</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductOverview;
