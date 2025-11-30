import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const params = useParams();

  const orderNumberFromUrl = Object.values(params)[0];

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");

    if (savedOrder) {
      const parsed = JSON.parse(savedOrder);
      setOrder(parsed);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-6">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        
        <svg
          className="w-16 h-16 mx-auto text-green-500 mb-4"
          fill="none" stroke="currentColor" strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
          />
        </svg>

        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Order Placed Successfully!
        </h1>

        <p className="text-lg font-semibold text-gray-900 mb-3">
          Order No: #{order?.order_id || orderNumberFromUrl}
        </p>

        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>

        {order ? (
          <div className="text-left bg-green-50 border p-4 rounded-lg mb-6">
            <p><strong>Order ID:</strong> #{order.order_id}</p>
            <p><strong>Total:</strong> ${Number(order.total_price).toFixed(2)}</p>
            <p><strong>Status:</strong> {order.status_display}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Items:</strong> {order.items?.length}</p>
          </div>
        ) : (
          <p className="text-gray-500">No order data found.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(`/orders/${order?.id}`)}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Order Details
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
