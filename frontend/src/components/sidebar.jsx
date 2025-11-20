import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Sidebar({ ActiveSide, setActiveSide, handleBar }) {
  const [Dropdown, setDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://127.0.0.1:8000/category/");
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Enable Tailwind Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const DropClick = () => {
    setDropdown(!Dropdown);
  };

  const handleItemClick = () => {
    setActiveSide(true);
  };

  return (
    <>
      {/* 🔥 Dim & Blurred Background */}
      {!ActiveSide && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleBar}
        />
      )}

      {/* Sidebar */}
      <div
        id="hs-sidebar-offcanvas"
        className={`${
          ActiveSide ? "-translate-x-full" : "translate-x-0"
        } fixed top-0 left-0 bottom-0 z-50
          w-64 transition-transform duration-300 bg-brandWhite dark:bg-neutral-900 
          border-r border-gray-200 dark:border-neutral-700`}
        role="dialog"
        tabIndex="-1"
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full">

          {/* Header */}
          <header className="p-4 flex justify-between items-center border-b dark:border-neutral-700">
            <span className="font-semibold text-xl text-black dark:text-white">
              MTKS
            </span>

            <button
              type="button"
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

              {/* Dashboard */}
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
                  Dashboard
                </Link>
              </li>

              {/* Categories Dropdown */}
              <li>
                <button
                  onClick={DropClick}
                  className="flex items-center w-full gap-x-3 py-2 px-3 
                  bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white rounded-lg
                  hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>

                  Categories

                  <svg
                    className={`w-4 h-4 ml-auto transition-transform duration-300 ease-in-out ${
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

                {/* Smooth Animated Dropdown */}
                <ul
                  className={`
                    ml-3 overflow-hidden 
                    transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] 
                    ${Dropdown ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
                  `}
                >
                  {categories
                    .filter((category) => category.show_in_dropdown)
                    .map((category) => (
                      <li key={category.id}>
                        <Link
                          onClick={handleItemClick}
                          to={`/category/${category.slug}`}
                          className="flex items-center py-2 px-3 mt-1 
                          text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 
                          rounded-lg"
                        >
                          {category.name}
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
                  <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
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

              {/* 🌙 Dark Mode Toggle */}
              <li>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-x-3 py-2 px-3 
                  bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white rounded-lg
                  hover:bg-gray-200 dark:hover:bg-neutral-700 w-full transition"
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
