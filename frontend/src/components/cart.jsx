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

  const getImage = (item) => {
    return (
      item?.variant?.image ||
      item?.product?.image1 ||
      item?.product?.image ||
      item?.product?.image_url ||
      "https://placehold.co/400x400?text=No+Image"
    );
  };

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
    <div className="min-h-screen px-6 py-8 bg-gray-100 dark:bg-black transition">
      <div className="max-w-5xl mx-auto bg-white dark:bg-[#111] dark:text-gray-200 rounded-xl shadow-md p-6 transition">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Your Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
          </h2>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your cart is empty.
          </p>
        ) : (
          <>
            {/* TABLE HEADER */}
            <div className="grid grid-cols-6 border-b pb-2 font-semibold text-gray-600 dark:text-gray-300 dark:border-gray-700">
              <span className="col-span-3">Item</span>
              <span>Price</span>
              <span>Qty</span>
              <span className="text-right">Total</span>
            </div>

            {/* CART ITEMS */}
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
                  className="grid grid-cols-6 gap-4 py-4 border-b dark:border-gray-700 transition"
                >
                  {/* IMAGE + TITLE */}
                  <div className="col-span-3 flex items-center gap-4">
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 rounded-lg object-cover shadow-sm"
                    />

                    <div>
                      <h4 className="font-semibold">{name}</h4>
                      {(color || size) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {color && `Color: ${color}`}
                          {color && size && " | "}
                          {size && `Size: ${size}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="flex items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      ${price.toFixed(2)}
                    </span>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(itemId)}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(itemId)}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* TOTAL + DELETE */}
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${(price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item)}
                      className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* SUMMARY */}
            <div className="mt-8 text-right space-y-2 dark:text-gray-200">
              <p>
                Subtotal:{" "}
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </p>
              <p>
                Tax (10%):{" "}
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </p>

              <p className="text-xl font-bold">
                Grand Total: ${total.toFixed(2)}
              </p>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition"
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
