import { useState } from "react";
import OrderList from "./OrderList";

// Placeholder Components
const Profile = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">👤 Profile Info</div>;
const Wishlist = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">💜 Wishlist goes here</div>;
const BillingAddress = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">📍 Billing Address</div>;
const ShippingAddress = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">📦 Shipping Address</div>;
const ChangePassword = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">🔒 Change Password</div>;
const Logout = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">🚪 Logged out</div>;

// Sidebar Component
const Sidebar = ({ setActiveTab, activeTab }) => {
  const menu = [
    { key: "orders", label: "Orders" },
    { key: "wishlist", label: "Wishlist" },
    { key: "profile", label: "Profile" },
    { key: "password", label: "Change Password" },
    { key: "logout", label: "Logout" }
  ];

  return (
    <div className="hidden md:block w-64 bg-white dark:bg-gray-800 dark:text-gray-200 shadow h-full p-4 rounded">
      <h2 className="font-bold mb-4 text-lg">Dashboard</h2>
      <ul className="space-y-3">
        {menu.map(item => (
          <li
            key={item.key}
            className={`cursor-pointer p-2 rounded transition ${
              activeTab === item.key
                ? "bg-gray-200 dark:bg-gray-700"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Mobile + Desktop Cards Component
const Card = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-6 text-center hover:shadow-lg transition cursor-pointer"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-semibold text-lg">{label}</div>
  </div>
);

export default function DashboardSummary({ activeTab, setActiveTab }) {
  const [darkMode, setDarkMode] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "orders": return <OrderList />;
      case "wishlist": return <Wishlist />;
      case "billing": return <BillingAddress />;
      case "shipping": return <ShippingAddress />;
      case "password": return <ChangePassword />;
      case "profile": return <Profile />;
      case "logout": return <Logout />;

      // 🟢 Default dashboard cards — visible on ALL screens
      default:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <Card icon="📄" label="Orders" onClick={() => setActiveTab("orders")} />
            <Card icon="💜" label="Wishlist" onClick={() => setActiveTab("wishlist")} />
            <Card icon="👤" label="Profile" onClick={() => setActiveTab("profile")} />
            <Card icon="🔒" label="Change Password" onClick={() => setActiveTab("password")} />
            <Card icon="🚪" label="Logout" onClick={() => setActiveTab("logout")} />
          </div>
        );
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 py-6 bg-gray-100 dark:bg-gray-900 min-h-screen gap-6">

        {/* Right Section */}
        <div className="flex-1">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}
