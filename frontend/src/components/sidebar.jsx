import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ ActiveSide, setActiveSide, handleBar }) {
  const [Dropdown, setDropdown] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://127.0.0.1:8000/category/');
      const data = await response.json();
      setCategories(data); // Set fetched categories
    };
    fetchCategories();
  }, []);

  const DropClick = () => {
    setDropdown(!Dropdown);
  };

  const handleItemClick = () => {
    setActiveSide(true); // Close the sidebar when an item is clicked
  };

  return (
    <div>
      <div
        id="hs-sidebar-offcanvas"
        className={`${
          ActiveSide ? "" : "translate-x-0"
        } hs-overlay [--auto-close:lg] lg:end-auto lg:bottom-0 w-64
        hs-overlay-open:translate-x-0
        -translate-x-full transition-all duration-300 transform
        h-full
        lg:hidden
        fixed top-0 start-0 bottom-0 z-60
        bg-brandWhite border-e border-gray-200 dark:bg-brandGreen dark:border-neutral-700`}
        role="dialog"
        tabIndex="-1"
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-4 flex justify-between items-center gap-x-2">
            <a
              className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white"
              href="#"
              aria-label="Brand"
            >
              MTKS
            </a>

            <div className="lg:hidden -me-2">
              {/* Close Button */}
              <button
                type="button"
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                onClick={handleBar}
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          {/* Body */}
          <nav className="h-full overflow-y-auto">
            <ul className="space-y-1">
              {/* Dashboard */}
              <li>
                <Link
                  onClick={handleItemClick}
                  className="flex items-center gap-x-3.5 py-2 px-4 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-brandGreen dark:text-white"
                >
                  Dashboard
                </Link>
              </li>

              {/* Categories Dropdown */}
              <li>
                <button
                  onClick={DropClick}
                  className="flex items-center gap-x-3.5 py-2 px-4 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-brandGreen dark:text-white"
                >
                  Categories
                  {Dropdown ? (
                    <svg
                      className="ms-auto block size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg
                      className="ms-auto block size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>

                {/* Dropdown List */}
                
                <ul
                  className={` transition-all duration-500 ease-in-out max-h-0 opacity-0 overflow-hidden ${Dropdown ? "max-h-screen opacity-100" : ""}`}
                >
                  {categories
                    .filter((category) => category.show_in_dropdown)
                    .map((category) => (
                      <li key={category.id} className='ml-3'>
                        <Link
                          onClick={handleItemClick} // Close the sidebar when a category is clicked
                          to={`/category/${category.slug}`}
                          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-white"
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
                  to={`/user`}
                  className="flex items-center gap-x-3.5 py-2 px-4 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-brandGreen dark:text-white"
                >
                  Account
                </Link>
              </li>
               <li>
                <Link
                  onClick={handleItemClick}
                  to={`/contact`}
                  className="flex items-center gap-x-3.5 py-2 px-4 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-brandGreen dark:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
