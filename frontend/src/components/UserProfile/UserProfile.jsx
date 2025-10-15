import { useState } from "react";

import OrderList from "./OrderList";
import Dashboard from "./Dashboard"; // Assuming you have this component
import Sidebar from "./Sidebar";
import Profile from "./Profile";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("dashboard"); // Default tab

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome back, Nafiul
        </h1>

        {/* Tab-based content rendering */}
        {activeTab === "dashboard" && (
          <div>
            <Dashboard activeTab={activeTab} setActiveTab={setActiveTab}/>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <OrderList />
          </div>
        )}
        {activeTab === "profile" && (
          <div>
            <Profile />
          </div>
        )}

        {/* Add more views like wishlist, profile, etc. */}
      </div>
    </div>
  );
}
