import React, { useEffect, useState } from "react";
import api from "../UserProfile/api";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const openOrderDetails = async (id) => {
    setDetailsLoading(true);
    setPanelOpen(true);

    try {
      const res = await api.get(`/orders/${id}/`);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error("Order details error:", err);
    }

    setDetailsLoading(false);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedOrder(null), 350);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600 dark:text-gray-300">
        Loading orders...
      </div>
    );

  return (
    <div className="relative min-h-screen px-6 py-6 bg-white dark:bg-gray-900 transition-all">

      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        My Orders
      </h1>

      {/* MAIN TABLE CARD */}
      <div className="
        w-full bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        shadow-md rounded-lg overflow-hidden
      ">
        <table className="w-full text-sm">
          <thead>
            <tr className="
              bg-gray-100 dark:bg-gray-700 
              text-gray-700 dark:text-gray-200
              text-left
            ">
              <th className="px-5 py-3 border-b dark:border-gray-600">Order</th>
              <th className="px-5 py-3 border-b dark:border-gray-600">Date</th>
              <th className="px-5 py-3 border-b dark:border-gray-600">Status</th>
              <th className="px-5 py-3 border-b dark:border-gray-600">Total</th>
              <th className="px-5 py-3 border-b dark:border-gray-600 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="
                  hover:bg-gray-50 dark:hover:bg-gray-700 
                  border-b border-gray-200 dark:border-gray-700 
                  text-gray-700 dark:text-gray-300
                "
              >
                <td
                  onClick={() => openOrderDetails(order.id)}
                  className="
                    px-5 py-3 text-purple-600 dark:text-purple-400 
                    hover:underline cursor-pointer
                  "
                >
                  #{order.order_id || order.id}
                </td>

                <td className="px-5 py-3">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>

                <td className="px-5 py-3 capitalize">
                  {order.status_display || order.status}
                </td>

                <td className="px-5 py-3">
                  ${Number(order.total_price).toFixed(2)} for {order.items?.length} items
                </td>

                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => openOrderDetails(order.id)}
                    className="
                      bg-gray-200 dark:bg-gray-700 
                      hover:bg-gray-300 dark:hover:bg-gray-600
                      px-3 py-1 rounded 
                      text-sm text-gray-800 dark:text-gray-200
                    "
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SIDE SLIDE PANEL */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[420px] 
          bg-white dark:bg-gray-800
          shadow-2xl border-l border-gray-200 dark:border-gray-700
          z-50 transition-all duration-500 ease-out
          ${panelOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
      >
        {/* PANEL HEADER */}
        <div className="
          p-4 border-b 
          border-gray-200 dark:border-gray-700 
          flex justify-between items-center
          text-gray-900 dark:text-gray-100
        ">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button 
            onClick={closePanel} 
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* PANEL CONTENT */}
        <div className="p-4 overflow-y-auto h-full text-gray-700 dark:text-gray-300">

          {detailsLoading ? (
            <p>Loading order details…</p>
          ) : selectedOrder ? (
            <>
              <p className="mb-2">
                <span className="font-medium">Order No:</span> #{selectedOrder.order_id}
              </p>
              <p className="mb-2">
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
              <p className="mb-4">
                <span className="font-medium">Total:</span>{" "}
                ${Number(selectedOrder.total_price).toFixed(2)}
              </p>

              <h3 className="text-lg font-semibold mb-3">Products</h3>

              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="
                    border border-gray-200 dark:border-gray-700 
                    p-3 rounded-lg mb-3 
                    bg-gray-50 dark:bg-gray-700 
                    flex gap-3
                  "
                >
                  <img
                    src={
                      item.image ??
                      item.variant?.image ??
                      item.product?.image ??
                      "https://placehold.co/80x80?text=No+Image"
                    }
                    className="w-16 h-16 object-cover rounded border dark:border-gray-600"
                    alt="product"
                  />

                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {item.product?.name || item.product}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Price: ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p>No order selected.</p>
          )}

        </div>
      </div>

    </div>
  );
};

export default OrderList;
