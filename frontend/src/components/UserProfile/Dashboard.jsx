import { useState } from "react";
import OrderList from "./OrderList";

// Placeholder components
const Profile = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">👤 Profile Info</div>;
const Wishlist = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">💜 Wishlist goes here</div>;
const BillingAddress = () => (
  <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">📍 Billing Address</div>
);
const ShippingAddress = () => (
  <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">📦 Shipping Address</div>
);
const ChangePassword = () => (
  <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">🔒 Change Password</div>
);
const Logout = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">🚪 Logged out</div>;

// Reusable Card Component
const Card = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-6 text-center hover:shadow-md dark:hover:shadow-gray-700 transition cursor-pointer"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-semibold text-lg">{label}</div>
  </div>
);

export default function DashboardSummary({ activeTab, setActiveTab }) {
  const [darkMode, setDarkMode] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "orders":
        return <OrderList />;
      case "wishlist":
        return <Wishlist />;
      case "billing":
        return <BillingAddress />;
      case "shipping":
        return <ShippingAddress />;
      case "password":
        return <ChangePassword />;
      case "profile":
        return <Profile />;
      case "logout":
        return <Logout />;
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition">
        
        {/* Dark mode toggle */}

        {renderActiveTab()}
      </div>
    </div>
  );
}
