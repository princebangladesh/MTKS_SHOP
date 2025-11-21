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
  ];

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

  return (
    <div
      className="
        hidden md:block          /* 👈 Hides sidebar in mobile */
        w-64 p-6 shadow-md 
        bg-white dark:bg-gray-900 
        text-gray-900 dark:text-gray-200 
        border-r border-gray-200 dark:border-gray-700
        transition-all
      "
    >
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
              className={`
                w-full text-left px-4 py-2 rounded-md flex items-center
                transition-all
                ${
                  activeTab === item.key
                    ? "bg-purple-200 dark:bg-purple-700 dark:text-white font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <span className="mr-2 text-lg">{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
