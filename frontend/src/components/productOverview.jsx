import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductOverviewSkeleton from "./skeleton/prdouctOverviewSkeleton";
import { useCart } from "./shared/cartContext";

function ProductOverview() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Zoom states
  const imageContainerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: 50, y: 50 });

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:8000/productlist/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          const firstVariant = data.variants[0];
          setActiveVariant(firstVariant);
          setSelectedColor(firstVariant?.color || null);
          setSelectedImage(firstVariant?.image || data.image1 || null);
        } else {
          setActiveVariant(null);
          setSelectedImage(data.image1 || null);
          setSelectedColor(null);
        }

        setQuantity(1);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load product. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Update active variant when color changes
  useEffect(() => {
    if (!product || !product.variants?.length) return;

    const match = product.variants.find(
      (v) => v?.color?.id === selectedColor?.id
    );

    if (match) {
      setActiveVariant(match);
      setSelectedImage(match?.image || product.image1);
    } else {
      const firstVariant = product.variants[0];
      setActiveVariant(firstVariant);
      setSelectedColor(firstVariant?.color || null);
      setSelectedImage(firstVariant?.image || product.image1);
    }

    setQuantity(1);
  }, [selectedColor, product]);

  // Handle image zoom
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setHoverPos({ x, y });
  };

  // Loading / Error / Empty
  if (loading) return <ProductOverviewSkeleton />;
  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
      </div>
    );
  if (!product)
    return (
      <div className="text-center text-gray-500 py-8">
        Product not found.
      </div>
    );

  // Extract variants and unique colors safely
  const variants = product.variants || [];
  const colors = variants
    .map((v) => v?.color)
    .filter((color) => color && color.id)
    .filter(
      (color, index, self) =>
        self.findIndex((c) => c.id === color.id) === index
    );

  // Handle thumbnail click
  const handleThumbnailClick = (thumb) => {
    setSelectedImage(thumb?.image);
    setSelectedColor(thumb?.variant?.color || null);
    setActiveVariant(thumb?.variant || null);
    setQuantity(1);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!activeVariant && variants.length === 0) {
      // Non-variant product
      const payload = { productId: product.id, productData: product };
      addToCart(payload, quantity);
      return;
    }

    if (!activeVariant || activeVariant.quantity <= 0) return;

    const payload = {
      productId: product.id,
      variant: activeVariant,
      productData: product,
    };

    addToCart(payload, quantity);
  };

  const handleAddToWishlist = () => {
    alert("Added to wishlist (demo)");
  };

  // Quantity controls
  const increaseQty = () => {
    if (quantity < (activeVariant?.quantity || product.total_stock)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const price = activeVariant?.price || product.current_price;
  const previousPrice = activeVariant?.previous_price || product.previous_price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Section with Zoom */}
        <div className="md:w-1/2 w-full">
          <div
            className="relative overflow-hidden rounded-lg border group w-[400px] h-[400px] cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            ref={imageContainerRef}
          >
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300"
            />
            {isHovering && (
              <div
                className="absolute bg-white dark:bg-gray-800 inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${hoverPos.x}% ${hoverPos.y}%`,
                }}
              />
            )}
          </div>

          {/* Thumbnails */}
          {variants.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {variants.map((variant, index) => (
                <img
                  key={index}
                  src={variant?.image}
                  alt="Variant"
                  className={`w-full h-20 object-cover border rounded cursor-pointer 
                    ${
                      selectedImage === variant?.image
                        ? "border-teal-600 ring-2 ring-teal-600"
                        : "border-gray-300"
                    }`}
                  onClick={() =>
                    handleThumbnailClick({ image: variant?.image, variant })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 w-full flex flex-col justify-start space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-blue-600 font-semibold">
            Brand: <span className="text-black">{product.brand?.name}</span>
          </p>
          {product.model && (
            <p className="text-sm text-gray-600">
              Model: <span className="text-black">{product.model}</span>
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-green-700">${price}</span>
            {previousPrice && (
              <span className="line-through text-gray-400">
                ${previousPrice}
              </span>
            )}
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Color:</h4>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color);
                      setQuantity(1);
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 focus:outline-none
                      ${
                        selectedColor?.id === color.id
                          ? "border-black scale-110"
                          : "border-gray-400"
                      }`}
                    style={{ backgroundColor: color.colour_code }}
                    title={color.colour_name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={decreaseQty}
              className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-16 text-center border rounded"
              min="1"
              max={activeVariant?.quantity || product.total_stock}
            />
            <button
              onClick={increaseQty}
              className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200"
              disabled={quantity >= (activeVariant?.quantity || product.total_stock)}
            >
              +
            </button>
          </div>

          {/* Add to Cart / Wishlist */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Description / Specification */}
      <div className="mt-8">
        <div className="flex gap-8 border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-2 px-6 ${
              activeTab === "description"
                ? "border-b-2 border-teal-600"
                : ""
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specification")}
            className={`py-2 px-6 ${
              activeTab === "specification"
                ? "border-b-2 border-teal-600"
                : ""
            }`}
          >
            Specification
          </button>
        </div>

        {activeTab === "description" && (
          <div className="py-4">
            {product.description || "No description available."}
          </div>
        )}
        {activeTab === "specification" && (
          <div className="py-4">
            <ul>
              {product.model && <li>Model: {product.model}</li>}
              <li>Price: ${price}</li>
              <li>Brand: {product.brand?.name}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductOverview;
