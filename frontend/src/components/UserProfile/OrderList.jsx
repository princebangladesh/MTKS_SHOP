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
    <div className="relative px-4 py-4 bg-white dark:bg-gray-900 transition-all">

      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        My Orders
      </h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-5 py-3 text-purple-600 cursor-pointer"
                      onClick={() => openOrderDetails(order.id)}>
                    #{order.order_id || order.id}
                  </td>

                  <td className="px-5 py-3">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-3 capitalize">
                    {order.status_display}
                  </td>

                  <td className="px-5 py-3">
                    ${order.total_price} ({order.items?.length} items)
                  </td>

                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openOrderDetails(order.id)}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* MOBILE VIEW ) */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-bold text-purple-600">
                #{order.order_id || order.id}
              </span>
              <button
                onClick={() => openOrderDetails(order.id)}
                className="text-sm px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
              >
                View
              </button>
            </div>

            <p className="text-sm">
              <span className="font-medium">Date:</span>{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </p>

            <p className="text-sm capitalize">
              <span className="font-medium">Status:</span> {order.status_display}
            </p>

            <p className="text-sm">
              <span className="font-medium">Total:</span> $
              {order.total_price} ({order.items?.length} items)
            </p>
          </div>
        ))}
      </div>

      {/* SLIDE PANEL */}
      <div
        className={`
          fixed top-0 right-0 h-full
          w-full sm:w-[80%] md:w-[420px]
          bg-white dark:bg-gray-800 shadow-2xl
          z-50 transition-transform duration-500
          ${panelOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 border-b flex justify-between text-lg font-semibold">
          Order Details
          <button onClick={closePanel}>✕</button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          {detailsLoading ? (
            <p>Loading…</p>
          ) : selectedOrder ? (
            <>
              <p>
                <strong>Order No:</strong> #{selectedOrder.order_id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
              <p className="mb-3">
                <strong>Total:</strong> ${selectedOrder.total_price}
              </p>

              <h3 className="font-semibold mb-2">Products</h3>

              {selectedOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 border rounded-lg mb-3 bg-gray-50 dark:bg-gray-700"
                >
                  <img
                    src={
                      item.image ??
                      item.variant?.image ??
                      item.product?.image ??
                      "https://placehold.co/80"
                    }
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="text-sm">Price: ${item.price}</p>
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
