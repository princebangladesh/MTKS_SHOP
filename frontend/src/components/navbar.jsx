import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import DarkModeToggle from "./darkmode";
import { BASE_URL } from "../config/api";
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const [ActiveSide, setActiveSide] = useState(true);
  const handleBar = () => setActiveSide(!ActiveSide);


  useEffect(() => {
  if (location.state?.focusSearch) {


    setExpanded(true);
    setMobileSearchOpen(true);


    setTimeout(() => inputRef.current?.focus(), 300);


    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state]);


  /* 🔍 FETCH SEARCH RESULTS */
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      const res = await fetch(`${BASE_URL}/search/?q=${query}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 4));
    }, 200);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setExpanded(false);
        setQuery("");
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* SELECTED SEARCH RESULT */
  const handleSelect = (item) => {
    setQuery("");
    setSuggestions([]);
    setExpanded(false);
    setMobileSearchOpen(false);

    if (item.type === "product") navigate(`/product/${item.slug}`);
    if (item.type === "category") navigate(`/category/${item.slug}`);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="bg-brandWhite dark:bg-brandGreen duration-200 relative z-40">
        <div className="flex justify-between items-center px-6 py-3">

          {/* LOGO */}
          <Link className="text-2xl font-bold text-brandGreen dark:text-white" to="/">
            MTKS
          </Link>

          {/* NAVIGATION CENTER */}
          <ul className="hidden lg:flex gap-10 font-semibold text-brandGreen dark:text-white">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          {/* SIDEBAR */}
          <Sidebar ActiveSide={ActiveSide} handleBar={handleBar} />

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-4 relative">

            {/* 🔍 MOBILE SEARCH BUTTON */}
            <button className="sm:hidden" onClick={() => setMobileSearchOpen(true)}>
              <IoMdSearch className="text-3xl text-brandGreen dark:text-white" />
            </button>

            {/* 🔍 DESKTOP SEARCH */}
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
                  transition-[width] duration-300 px-4 py-2 rounded-full border
                  dark:bg-brandGreen dark:text-white mr-[2px] mt-[1px] mb-[1px]
                  w-10
                  ${expanded ? "w-64" : "focus:w-64"}
                `}
                onFocus={() => setExpanded(true)}
              />

              {/* Search Icon */}
              <button className="absolute right-1 bg-white p-2 rounded-full shadow pointer-events-none">
                <IoMdSearch className="text-brandGreen text-xl" />
              </button>

              {/* Desktop Dropdown */}
              {suggestions.length > 0 && expanded && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-brandGreen shadow-xl border-t z-[9999]">
                  <div className="px-6 py-3">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 py-3 border-b last:border-none 
                                   hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleSelect(item)}
                      >
                        <img src={item.image} className="w-12 h-12 rounded border shadow-sm" alt="" />
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

            {/* USER ICON */}
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

            {/* HAMBURGER MENU */}
            <button className="relative group lg:hidden" onClick={handleBar}>
              <div className={`relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transition-all ${ActiveSide ? "" : "ring-4"} ring-gray-300 ring-opacity-30 hover:ring-8`}>
                <div className="flex flex-col justify-between w-[20px] h-[20px] transition-all origin-center">
                  <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-7 transition-all origin-left ${ActiveSide ? "" : "rotate-[42deg]"}`}></div>
                  <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-1/2 transition-all ${ActiveSide ? "" : "-translate-x-10"}`}></div>
                  <div className={`bg-brandGreen dark:bg-brandWhite h-[2px] w-7 transition-all origin-left ${ActiveSide ? "" : "-rotate-[42deg]"}`}></div>
                </div>
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-white dark:bg-brandGreen z-[9999] p-6 animate-fadeIn">

          {/* Close Icon */}
          <div className="flex justify-end">
            <button onClick={() => setMobileSearchOpen(false)}>
              <IoMdClose className="text-4xl text-brandGreen dark:text-white" />
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="mt-10 relative">

            <IoMdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-500 dark:text-gray-200" />

            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="
                w-full pl-14 pr-14 py-4 
                rounded-full text-lg 
                bg-gray-100 dark:bg-brandGreen 
                border border-gray-300 dark:border-white/20
                text-gray-800 dark:text-white
                focus:outline-none
              "
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                <IoMdClose className="text-3xl text-gray-600 dark:text-white" />
              </button>
            )}
          </div>

          {/* Mobile Suggestions */}
          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className="flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <img src={item.image} className="w-14 h-14 rounded border" alt="" />
                <div>
                  <p className="font-semibold dark:text-white">{item.name}</p>
                  <small className="text-gray-600 dark:text-gray-300">{item.type}</small>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}

export default Navbar;
