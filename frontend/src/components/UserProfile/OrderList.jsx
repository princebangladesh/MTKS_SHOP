import React, { useEffect, useState } from "react";
import api from "../UserProfile/api";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // =======================
  // Fetch All Orders
  // =======================
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

  // =======================
  // Open Order Details
  // =======================
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

  // =======================
  // Close Panel
  // =======================
  const closePanel = () => {
    setPanelOpen(false);

    // Fade-out before clearing
    setTimeout(() => {
      setSelectedOrder(null);
    }, 400);
  };

  // =======================
  // Loading
  // =======================
  if (loading)
    return (
      <div className="p-10 text-center text-gray-600">
        Loading orders...
      </div>
    );

  return (
    <div className="relative flex p-6 gap-6 min-h-screen">

      {/* LEFT — ORDER LIST */}
      <div className="w-full max-w-4xl bg-white border shadow-md rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3 border-b">Order</th>
              <th className="px-4 py-3 border-b">Date</th>
              <th className="px-4 py-3 border-b">Status</th>
              <th className="px-4 py-3 border-b">Total</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 text-sm">

                {/* ORDER ID */}
                <td
                  onClick={() => openOrderDetails(order.id)}
                  className="px-4 py-3 border-b text-purple-600 hover:underline cursor-pointer"
                >
                  #{order.order_id || order.id}
                </td>

                {/* DATE */}
                <td className="px-4 py-3 border-b">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>

                {/* STATUS */}
                <td className="px-4 py-3 border-b capitalize">
                  {order.status_display || order.status}
                </td>

                {/* TOTAL */}
                <td className="px-4 py-3 border-b">
                  ${Number(order.total_price).toFixed(2)} for{" "}
                  {order.items?.length} items
                </td>

                {/* ACTION BUTTON */}
                <td className="px-4 py-3 border-b">
                  <button
                    onClick={() => openOrderDetails(order.id)}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded flex items-center gap-1"
                  >
                    View <span role="img" aria-label="eye">👁️</span>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT — SLIDE-IN DETAILS PANEL */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl border-l z-50
          transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]
          ${panelOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
      >

        {/* PANEL HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={closePanel}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* PANEL CONTENT */}
        <div className="p-4 overflow-y-auto h-full">

          {detailsLoading ? (
            <p className="text-gray-600">Loading order details…</p>
          ) : selectedOrder ? (
            <>
              {/* Summary */}
              <p className="text-gray-700 mb-3">
                <span className="font-medium">Order No:</span>{" "}
                #{selectedOrder.order_id || selectedOrder.id}
              </p>

              <p className="text-gray-700 mb-3">
                <span className="font-medium">Total:</span>{" "}
                ${Number(selectedOrder.total_price).toFixed(2)}
              </p>

              <p className="text-gray-700 mb-3">
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedOrder.created_at).toLocaleString()}
              </p>

              <p className="text-gray-700 mb-6">
                <span className="font-medium">Status:</span>{" "}
                {selectedOrder.status_display}
              </p>

              <h3 className="text-lg font-semibold mb-3">Products</h3>

              {/* PRODUCT LIST WITH IMAGE THUMBNAILS */}
              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="border p-3 rounded-lg mb-3 bg-gray-50 flex gap-3 items-start"
                >
                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.product}
                    className="w-16 h-16 object-cover rounded border"
                  />

                  {/* DETAILS */}
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
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
