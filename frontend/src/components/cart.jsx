import React from "react";
import { useCart } from "./shared/cartContext";
import { FaTrash } from "react-icons/fa";
import CartSkeleton from "./skeleton/CartSkeleton";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    loading,
    removeFromCart,
    clearCart,
    increaseQty,
    decreaseQty,
    subtotal,
    tax,
    total,
  } = useCart();

  const navigate = useNavigate();

  if (loading) return <CartSkeleton />;

  /* -------------------------------------------------------
     🔥 FIXED IMAGE LOGIC (simple products now show image)
  ---------------------------------------------------------*/
  const getImage = (item) => {
    return (
      item?.variant?.image ||
      item?.product?.image1 ||
      item?.product?.image ||
      item?.product?.image_url ||
      "https://placehold.co/400x400?text=No+Image"
    );
  };

  /* -------------------------------------------------------
     🔥 FIXED ITEM ID LOGIC (simple products get stable id)
  ---------------------------------------------------------*/
  const getItemKey = (item, index) => {
    return (
      item.variant_id ||
      item.variant?.id ||
      item.product?.id ||
      item.default_variant_id ||
      index
    );
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Your Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
          </h2>

          {/* 🔴 CLEAR CART BUTTON */}
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-6 border-b pb-2 font-semibold text-gray-600">
              <span className="col-span-3">Item</span>
              <span>Price</span>
              <span>Qty</span>
              <span className="text-right">Total</span>
            </div>

            {/* Items */}
            {cart.map((item, index) => {
              const price =
                parseFloat(item?.variant?.price) ||
                parseFloat(item?.product?.current_price) ||
                0;

              const image = getImage(item);
              const itemId = getItemKey(item, index);

              const name =
                item?.product?.name ||
                item?.variant?.product?.name ||
                "Product";

              const color = item?.variant?.color?.colour_name;
              const size = item?.variant?.size?.size;

              return (
                <div
                  key={itemId}
                  className="grid grid-cols-6 gap-4 py-4 border-b"
                >
                  {/* Product Info */}
                  <div className="col-span-3 flex items-center gap-4">
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 rounded-lg object-cover shadow-sm"
                    />

                    <div>
                      <h4 className="font-semibold text-gray-800">{name}</h4>

                      {(color || size) && (
                        <p className="text-sm text-gray-500">
                          {color && `Color: ${color}`}
                          {color && size && " | "}
                          {size && `Size: ${size}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center">
                    <span className="text-gray-700">
                      ${price.toFixed(2)}
                    </span>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(itemId)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(itemId)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Total + Remove */}
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-semibold text-gray-900">
                      ${(price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Totals */}
            <div className="mt-8 text-right space-y-2">
              <p className="text-gray-700">
                Subtotal:{" "}
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </p>
              <p className="text-gray-700">
                Tax (10%):{" "}
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </p>

              <p className="text-xl font-bold">
                Grand Total: ${total.toFixed(2)}
              </p>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
