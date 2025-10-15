import React from 'react';
const orders = [
  { id: 182, date: 'November 22, 2023', status: 'Completed', total: '$47.55 for 1 item' },
  { id: 181, date: 'November 22, 2023', status: 'Completed', total: '$33.90 for 1 item' },
  { id: 180, date: 'November 22, 2023', status: 'On hold', total: '$33.90 for 1 item' },
  { id: 179, date: 'November 22, 2023', status: 'On hold', total: '$33.90 for 1 item' },
  { id: 178, date: 'November 22, 2023', status: 'On hold', total: '$47.55 for 1 item' },
  { id: 177, date: 'November 22, 2023', status: 'On hold', total: '$47.55 for 1 item' },
  { id: 176, date: 'November 22, 2023', status: 'Completed', total: '$47.55 for 1 item' },
];

const OrderList = () => {
  return (
    <div className="p-6">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="px-4 py-2 border-b">Order</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Total</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 text-sm">
              <td className="px-4 py-3 border-b text-purple-600 hover:underline cursor-pointer">
                #{order.id}
              </td>
              <td className="px-4 py-3 border-b">{order.date}</td>
              <td className="px-4 py-3 border-b">{order.status}</td>
              <td className="px-4 py-3 border-b">{order.total}</td>
              <td className="px-4 py-3 border-b">
                <button className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded flex items-center gap-1">
                  View <span role="img" aria-label="eye">👁️</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
