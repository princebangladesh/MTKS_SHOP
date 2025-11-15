// src/pages/OrderDetails.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../UserProfile/api";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // ✅ FIXED PARAM NAME
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}/`); // ✅ FIXED URL
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to load order:", err);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading order details...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Order not found.
      </div>
    );

  return (
    <div className="min-h-screen p-6 flex justify-center bg-gray-50">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">

        {/* Back Button */}
        <button
          onClick={() => navigate("/my-orders")}
          className="text-sm text-gray-600 hover:underline mb-4"
        >
          ← Back to Orders
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Details
        </h1>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Order No:</span>{" "}
          #{order.order_id || order.id}
        </p>

        {/* Order Summary */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Summary
          </h2>

          <p className="text-gray-700">
            <span className="font-medium">Date:</span>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          <p className="text-gray-700">
            <span className="font-medium">Status:</span>{" "}
            {order.status_display || order.status}
          </p>

          <p className="text-gray-700">
            <span className="font-medium">Total:</span>{" "}
            ${Number(order.total_price).toFixed(2)}
          </p>

          <p className="text-gray-700">
            <span className="font-medium">Items:</span>{" "}
            {order.items?.length || 0}
          </p>
        </div>

        {/* Order Items */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Ordered Products
        </h2>

        <div className="space-y-4">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white"
            >
              <div>
                <p className="text-gray-900 font-medium">
                  {item.product || "Product Name"}
                </p>
                <p className="text-gray-600 text-sm">
                  Variant ID: {item.variant_id}
                </p>
                <p className="text-gray-600 text-sm">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-semibold text-gray-800">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
