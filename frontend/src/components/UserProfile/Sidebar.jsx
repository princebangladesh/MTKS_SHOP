import { useNavigate } from "react-router-dom";
export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const menuItems = [
   { key: "dashboard", label: "Dashboard", icon: "🏠" },
   { key: "orders", label: "Orders", icon: "📄" },
   { key: "wishlist", label: "Wishlist", icon: "💜" },
   { key: "profile", label: "Profile", icon: "👤" },
    { key: "password", label: "Change Password", icon: "🔒" },
    { key: "logout", label: "Logout", icon: "🚪" },
    // Add more if needed
  ];
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      // Optional: Blacklist refresh token
      await fetch("/api/token/blacklist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }

    // Remove tokens from storage
    localStorage.removeItem("access");
    localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() =>
                item.key === "logout"
                  ? handleLogout()
                  : setActiveTab(item.key)
              }
              className={`w-full text-left px-4 py-2 rounded-md transition ${
                activeTab === item.key
                  ? "bg-purple-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
