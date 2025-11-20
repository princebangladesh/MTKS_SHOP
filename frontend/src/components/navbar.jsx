import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import DarkModeToggle from "./darkmode";
import {BASE_URL} from "../config/api";
import { useCart } from "./shared/cartContext";
import { useWishlist } from "./shared/wishlistcontext";
import Sidebar from "./sidebar";

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [ActiveSide, setActiveSide] = React.useState(true); // Default to false (sidebar hidden)
    const handleBar = () => {
        setActiveSide(!ActiveSide);
    };
  // Fetch search results
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      const res = await fetch(
        `${BASE_URL}/search/?q=${query}`
      );
      const data = await res.json();

      setSuggestions(data.slice(0, 4)); // ⭐ LIMIT TO 4
    }, 200);

    return () => clearTimeout(delay);
  }, [query]);

  // Close dropdown and clear query when clicking outside input field or suggestions dropdown
  useEffect(() => {
    const handler = (e) => {
      // Check if the click is outside the search input and dropdown
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setExpanded(false);
        setQuery(""); // Clear the input field when clicking outside
        setSuggestions([]); // Clear suggestions
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSelect = (item) => {
    setQuery("");
    setSuggestions([]);

    if (item.type === "product") navigate(`/product/${item.slug}`);
    if (item.type === "category") navigate(`/category/${item.slug}`);
  };

  return (
    <div className="bg-brandWhite dark:bg-brandGreen duration-200 relative z-40">
      <div className="flex justify-between items-center px-6 py-3">

        {/* LOGO */}
        <a className="text-2xl font-bold text-brandGreen dark:text-white" href="/">
          MTKS
        </a>

        {/* CENTER NAV ITEMS */}
        <ul className="hidden lg:flex gap-10 font-semibold text-brandGreen dark:text-white">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      <Sidebar ActiveSide={ActiveSide} setActiveSide={setActiveSide} handleBar={handleBar} />
        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-4 relative">

          {/* 🔍 EXPANDING SEARCH */}
          <div className="relative hidden sm:flex items-center" ref={dropdownRef}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setExpanded(true);
              }}
              placeholder="Search…"
              className={`
                transition-all duration-300 px-4 py-2 rounded-full border
                dark:bg-brandGreen dark:text-white mr-[2px]
                w-10
                ${expanded ? "w-64" : "hover:w-64 focus:w-64"}
              `}
              onFocus={() => setExpanded(true)}
            />

            {/* Search Icon Circle */}
            <button
              className="absolute right-1 bg-white p-2 rounded-full shadow pointer-events-none"
            >
              <IoMdSearch className="text-brandGreen text-xl" />
            </button>

            {/* 🔽 SEARCH SUGGESTION DROPDOWN */}
            {suggestions.length > 0 && (
              <div
                className="
                  absolute top-full left-0 right-0
                  bg-white dark:bg-brandGreen 
                  shadow-xl border-t z-[9999]
                "
              >
                <div className="max-w-screen-2xl mx-auto px-6 py-3">

                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="
                        flex items-center gap-4 py-3 
                        border-b last:border-none 
                        hover:bg-gray-100 dark:hover:bg-gray-700 
                        cursor-pointer transition
                      "
                      onClick={() => handleSelect(item)}
                    >
                      <img
                        src={item.image}
                        className="w-12 h-12 rounded border shadow-sm object-cover"
                        alt=""
                      />
                      <div>
                        <p className="font-semibold dark:text-white">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">{item.type}</p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}
          </div>

          {/* DARK MODE */}
          <DarkModeToggle />

          {/* USER */}
          <Link to="/login">
            <FaRegUser className="text-2xl text-brandGreen dark:text-white" />
          </Link>

          {/* WISHLIST */}
          <Link className="relative" to="/wishlist">
            <FaRegHeart className="text-2xl text-brandGreen dark:text-white" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {wishlist.length}
            </span>
          </Link>

          {/* CART */}
          <Link className="relative" to="/cart">
            <FaCartShopping className="text-2xl text-brandGreen dark:text-white" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {totalQuantity}
            </span>
          </Link>


          <button className="relative group lg:hidden" onClick={handleBar}>
              <div className={`relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all ring-0 ring-gray-300 hover:ring-8 ${ActiveSide ? "" : "ring-4"} ring-opacity-30 duration-200`}>
                  <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                      <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-7 transform transition-all duration-300 origin-left ${ActiveSide ? "" : "rotate-[42deg]"}`}></div>
                      <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-1/2 rounded transform transition-all duration-300 ${ActiveSide ? "" : "-translate-x-10"}`}></div>
                      <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-7 transform transition-all duration-300 origin-left ${ActiveSide ? "" : "-rotate-[42deg]"}`}></div>
                  </div>
              </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
