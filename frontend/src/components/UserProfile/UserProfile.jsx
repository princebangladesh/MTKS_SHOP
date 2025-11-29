import { useState } from "react";

import OrderList from "./OrderList";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import ChangePasswordForm from "./change_password";
import Wishlist from "./WishList";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="
      min-h-screen flex 
      bg-gradient-to-br 
      from-purple-100 via-white to-blue-100 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
      text-gray-900 dark:text-gray-200
      transition-all
    ">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content */}
      <div className="flex-1 p-8">

        {activeTab === "dashboard" && (
          <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {activeTab === "orders" && (
          <OrderList />
        )}

        {activeTab === "profile" && (
          <Profile />
        )}
        {activeTab === "wishlist" && (
          <Wishlist />
        )}


        {activeTab === "password" && (
          <ChangePasswordForm setActiveTab={setActiveTab} />
        )}

      </div>
    </div>
  );
}
