import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrderList from "./OrderList";

// Placeholder Components
const Profile = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">👤 Profile Info</div>;
const Wishlist = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">💜 Wishlist goes here</div>;
const BillingAddress = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">📍 Billing Address</div>;
const ShippingAddress = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">📦 Shipping Address</div>;
const ChangePassword = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">🔒 Change Password</div>;
const Logout = () => <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-4">🚪 Logged out</div>;


const Card = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded p-6 text-center hover:shadow-lg transition cursor-pointer"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-semibold text-lg">{label}</div>
  </div>
);

export default function Dashboard({ activeTab, setActiveTab }) {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state, setActiveTab]);


  // LOGOUT HANDLER
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      await fetch("/api/token/blacklist/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }

    localStorage.removeItem("access");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "orders": return <OrderList />;
      case "wishlist": return <Wishlist />;
      case "billing": return <BillingAddress />;
      case "shipping": return <ShippingAddress />;
      case "password": return <ChangePassword />;
      case "profile": return <Profile />;
      case "logout": return <Logout />;

      default:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <Card icon="📄" label="Orders" onClick={() => setActiveTab("orders")} />
            <Card icon="💜" label="Wishlist" onClick={() => setActiveTab("wishlist")} />
            <Card icon="👤" label="Profile" onClick={() => setActiveTab("profile")} />
            <Card icon="🔒" label="Change Password" onClick={() => setActiveTab("password")} />
            <Card icon="🚪" label="Logout" onClick={handleLogout} />
          </div>
        );
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 py-6 bg-gray-100 dark:bg-gray-900 min-h-screen gap-6">

        {/* CONTENT */}
        <div className="flex-1">
          {renderActiveTab()}
        </div>

      </div>
    </div>
  );
}
