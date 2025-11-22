import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/api";

function Sidebar({ ActiveSide, setActiveSide, handleBar }) {
  const [Dropdown, setDropdown] = useState(false);
  const [categories, setCategories] = useState([]);

  // DARK MODE STATES
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  /* -------------------- Load Categories -------------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category/`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /* -------------------- Load Saved Theme on First Render -------------------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setDarkMode(savedTheme === "dark");
    setThemeLoaded(true); // Mark theme as loaded
  }, []);

  /* -------------------- Apply Theme After Loading -------------------- */
  useEffect(() => {
    if (!themeLoaded) return; // Prevent overwrite before saved theme loads

    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode, themeLoaded]);

  const handleDropdown = () => setDropdown(!Dropdown);
  const handleItemClick = () => setActiveSide(true);

  return (
    <>
      {/* Background Overlay */}
      {!ActiveSide && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={handleBar}
        />
      )}

      {/* Sidebar */}
      <div
        id="hs-sidebar-offcanvas"
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64
          transition-transform duration-300 Caro-bg
          border-r border-gray-200 dark:border-neutral-700
          ${ActiveSide ? "-translate-x-full" : "translate-x-0"}
        `}
        role="dialog"
      >
        <div className="relative flex flex-col h-full">

          {/* Header */}
          <header className="p-4 flex justify-between items-center border-b dark:border-neutral-700">
            <span className="font-semibold text-xl text-black dark:text-white">
              MTKS
            </span>

            <button
              onClick={handleBar}
              className="flex justify-center items-center size-7 rounded-full 
              bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 
              hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <svg
                className="w-4 h-4 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          {/* Body */}
          <nav className="h-full overflow-y-auto px-3 py-4">
            <ul className="space-y-2">

              {/* Home */}
              <li>
                <Link
                  onClick={handleItemClick}
                  to="/"
                  className="flex items-center gap-x-3 py-2 px-3 
                  bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white 
                  rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Home
                </Link>
              </li>

              {/* Categories */}
              <li>
                <button
                  onClick={handleDropdown}
                  className="flex items-center w-full gap-x-3 py-2 px-3 
                  bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white rounded-lg
                  hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>

                  Categories

                  <svg
                    className={`w-4 h-4 ml-auto transform transition-transform duration-300 ${
                      Dropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown List */}
                <ul
                  className={`ml-3 overflow-hidden transition-all duration-500 ease-in-out
                    ${Dropdown ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {categories
                    .filter((cat) => cat.show_in_dropdown)
                    .map((cat) => (
                      <li key={cat.id}>
                        <Link
                          onClick={handleItemClick}
                          to={`/category/${cat.slug}`}
                          className="flex items-center py-2 px-3 mt-1 
                          text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 
                          rounded-lg"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>

              {/* Account */}
              <li>
                <Link
                  onClick={handleItemClick}
                  to="/user"
                  className="flex items-center gap-x-3 py-2 px-3 
                  bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white rounded-lg 
                  hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 24 24">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 21c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
                  </svg>
                  Account
                </Link>
              </li>

              {/* Contact */}
              <li>
                <Link
                  onClick={handleItemClick}
                  to="/contact"
                  className="flex items-center gap-x-3 py-2 px-3 
                  bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white rounded-lg
                  hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 8V7l-3 2-2-1-3 2-2-1-3 2-3-2v9h18V8z" />
                  </svg>
                  Contact
                </Link>
              </li>

              {/* Dark Mode Toggle */}
              <li>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-x-3 py-2 px-3 
                  bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white rounded-lg
                  hover:bg-gray-200 dark:hover:bg-neutral-700 w-full"
                >
                  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
