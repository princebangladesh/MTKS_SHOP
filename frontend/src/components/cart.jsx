import React from "react";
import { useCart } from "./shared/cartContext";
import { useAuth } from "./shared/authContext"; 
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

  const { isAuthenticated } = useAuth();
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


  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=/checkout");
    }
  };
  // ⬆⬆⬆ NEW CHECKOUT HANDLER ⬆⬆⬆

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100 dark:bg-black transition">
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
            {/* DESKTOP TABLE */}
            <div className="hidden md:grid grid-cols-6 border-b pb-2 font-semibold text-gray-600 dark:text-gray-300 dark:border-gray-700">
              <span className="col-span-3">Item</span>
              <span>Price</span>
              <span>Qty</span>
              <span className="text-right">Total</span>
            </div>

            {/* ITEMS */}
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
                  className="border-b dark:border-gray-700 py-4 transition md:grid md:grid-cols-6 md:gap-4"
                >
                  {/* DESKTOP ITEM */}
                  <div className="hidden md:flex md:col-span-3 items-center gap-4">
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

                  {/* MOBILE CARD */}
                  <div className="md:hidden bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
                    <img
                      src={image}
                      className="w-full h-40 object-cover rounded-lg"
                      alt={name}
                    />

                    <h4 className="mt-3 text-lg font-bold">{name}</h4>

                    {(color || size) && (
                      <p className="text-sm text-gray-400 mb-2">
                        {color && `Color: ${color}`}
                        {color && size && " | "}
                        {size && `Size: ${size}`}
                      </p>
                    )}

                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Price: ${price.toFixed(2)}
                    </p>

                    {/* QTY BUTTONS */}
                    <div className="flex items-center gap-3 my-3">
                      <button
                        onClick={() => decreaseQty(itemId)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                      >
                        −
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(itemId)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                      >
                        +
                      </button>
                    </div>

                    {/* TOTAL + DELETE */}
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        Total: ${(price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-red-600 text-xl"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* DESKTOP PRICE */}
                  <div className="hidden md:flex items-center">
                    ${price.toFixed(2)}
                  </div>

                  {/* DESKTOP QTY */}
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(itemId)}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(itemId)}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* DESKTOP TOTAL */}
                  <div className="hidden md:flex justify-end items-center gap-3">
                    <span className="font-semibold">
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

              {/* NEW CHECKOUT BUTTON */}
              <button
                onClick={handleCheckout}
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
