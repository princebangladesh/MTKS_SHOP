import React,{useState,useEffect} from 'react';
import { useCart } from './shared/cartContext';
import { FaTrash } from 'react-icons/fa';
import Loader from './shared/loader';
import { useLoader } from './shared/loaderContext';
import CartSkeleton from './skeleton/CartSkeleton';

const Cart = () => {
  const { cart, removeFromCart, clearCart, increaseQty, decreaseQty } = useCart();
  const [loading, setLoading] = useState(true);

  // Safely calculate totals using product price
  const subtotal = cart.reduce(
  (acc, item) => acc + (item.product?.current_price || 0) * item.quantity,
  0
);
  const tax = +(subtotal * 0.1).toFixed(2); // 10% tax
  const grandTotal = subtotal + tax;
  useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500); // 1 second delay

      return () => clearTimeout(timer);
    }, []);

  if (loading) return <CartSkeleton />;

  return (
    <div className="p-6 max-w-5xl mx-auto">

          <h2 className="text-2xl dark:text-brandWhite font-bold mb-6">
            Your Cart ({cart.length} items)
          </h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="w-full">
                <div className="grid grid-cols-6 font-semibold text-gray-600 border-b pb-2 mb-4">
                  <span className="col-span-3">Item</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid grid-cols-6 items-center gap-4 border-b py-4 dark:text-gray-500"
                  >
                    {/* Product Info */}
                    <div className="col-span-3 flex gap-4">
                      <img
                        src={
                          item.product.image1?.startsWith('http')
                            ? item.product.image1
                            : `http://localhost:8000${item.product.image1}`
                        }
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    <div>
                        <h4 className="font-bold">{item.product.name}</h4>
                        <div className="text-sm text-gray-500">{item.product.desc}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <span>
                      ${item.product?.current_price?.toFixed(2) || '0.00'}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => decreaseQty(item.product.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={loading}
                      >
                        {loading ? '...' : '-'}
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.product.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={loading}
                      >
                        {loading ? '...' : '+'}
                      </button>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold mr-2">
                        ${(item.product.current_price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="mt-8 text-right space-y-2">
                <p>
                  Subtotal:{' '}
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </p>
                <p>
                  Sales Tax (10%): <span className="font-semibold">${tax}</span>
                </p>
                <div className="flex justify-end items-center gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="border px-2 py-1 rounded text-sm"
                  />
                  <button className="text-blue-600 hover:underline text-sm">
                    Add Coupon
                  </button>
                </div>
                <p className="text-xl font-bold">
                  Grand Total: ${grandTotal.toFixed(2)}
                </p>
                <button
                  onClick={clearCart}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
    </div>
  );
};

export default Cart;
