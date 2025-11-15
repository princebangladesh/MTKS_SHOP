// ProductDetail.jsx
import React, { useState, useEffect } from 'react';

function ProductDetail({ product }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const first = product.variants[0];
      setActiveVariant(first);
      setSelectedColor(first.color || null);
      setSelectedSize(first.size || null);
      setSelectedImage(first.image || product.image1 || null);
    } else {
      setSelectedImage(product.image1 || null);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    let match = null;

    if (selectedColor && selectedSize) {
      match = product.variants?.find(
        (v) => v.color?.id === selectedColor.id && v.size?.ID === selectedSize.ID
      );
    } else if (selectedColor) {
      match = product.variants?.find((v) => v.color?.id === selectedColor.id);
    }

    setActiveVariant(match || null);

    if (match?.image) {
      setSelectedImage(match.image);
    }
  }, [selectedColor, selectedSize, product]);

  const variants = product.variants || [];
  const hasColors = variants.some((v) => v.color);
  const hasSizes = variants.some((v) => v.size);

  const colors = [...new Map(variants.map((v) => [v.color?.id, v.color])).values()].filter(Boolean);
  const sizes = [...new Map(variants.map((v) => [v.size?.ID, v.size])).values()].filter(Boolean);

  const allVariantThumbnails = variants.flatMap((variant) => {
    if (Array.isArray(variant.images) && variant.images.length > 0) {
      return variant.images.map((img) => ({
        variant,
        image: typeof img === 'string' ? img : img.image,
      }));
    } else if (variant.image) {
      return [{ variant, image: variant.image }];
    }
    return [];
  });

  const handleThumbnailClick = (thumb) => {
    setSelectedImage(thumb.image);
    setSelectedColor(thumb.variant.color || null);
    setSelectedSize(thumb.variant.size || null);
    setActiveVariant(thumb.variant);
  };

  const handleAddToCart = () => {
    if (!activeVariant || activeVariant.quantity <= 0) return;
  };

  const handleAddToWishlist = () => {
    if (!activeVariant || activeVariant.quantity <= 0) return;
    alert('Added to wishlist');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Section */}
        <div className="md:w-1/2 w-full">
          <div className="border rounded overflow-hidden shadow-sm">
            <img src={selectedImage} alt={product.name} className="w-full object-cover" />
          </div>

          {/* Thumbnails */}
          {allVariantThumbnails.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {allVariantThumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb.image}
                  alt="Variant"
                  className={`w-full h-20 object-cover border rounded cursor-pointer ${
                    selectedImage === thumb.image
                      ? 'border-teal-600 ring-2 ring-teal-600'
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleThumbnailClick(thumb)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 w-full flex flex-col justify-start space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-blue-600 font-semibold">
            Brand: <span className="text-black">{product.brand_name || product.brand}</span>
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-green-700">${product.current_price}</span>
            {product.previous_price && (
              <span className="line-through text-gray-400">${product.previous_price}</span>
            )}
          </div>

          {/* Color Selector */}
          {hasColors && colors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Color:</h4>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(null);
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 focus:outline-none ${
                      selectedColor?.id === color.id ? 'border-black scale-110' : 'border-gray-400'
                    }`}
                    style={{ backgroundColor: color.colour_code }}
                    title={color.colour_name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {hasSizes && sizes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1 mt-4">Size:</h4>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.ID}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded border text-sm transition-colors duration-150 ${
                      selectedSize?.ID === size.ID
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
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

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={activeVariant?.quantity <= 0}
              className={`px-6 py-2 rounded font-semibold text-white transition ${
                activeVariant?.quantity > 0 ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {activeVariant?.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={handleAddToWishlist}
              disabled={activeVariant?.quantity <= 0}
              className={`px-6 py-2 rounded font-semibold border transition ${
                activeVariant?.quantity > 0
                  ? 'border-teal-600 text-teal-600 hover:bg-teal-100'
                  : 'border-gray-400 text-gray-400 cursor-not-allowed'
              }`}
            >
              ❤️ Wishlist
            </button>
          </div>

          {/* Share Icons */}
          <div className="flex items-center gap-3 mt-6 text-gray-600">
            <span className="text-sm font-semibold">Share this on:</span>
            {/* (SVG icons here, you can extract to a separate component if desired) */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
