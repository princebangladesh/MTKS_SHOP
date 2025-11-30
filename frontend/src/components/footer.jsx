import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./shared/authContext";

const FooterSection = ({ title, links, index, activeIndex, setActiveIndex }) => {
  const isOpen = activeIndex === index;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = (link) => {
    const needsAuth = ["profile", "orders", "wishlist"].includes(link?.state?.tab);

    if (needsAuth && !isAuthenticated) {
      navigate(`/login?redirect=${link.to}`);
    } else {
      navigate(link.to, { state: link.state || null });
    }
  };

  return (
    <div className="border-b border-gray-300 dark:border-border-gray-300 py-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setActiveIndex(isOpen ? null : index)}
      >
        <h3 className="text-lg font-semibold text-brandBlue dark:text-white">{title}</h3>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </div>

      {/* MOBILE DROPDOWN */}
      <ul
        className={`mt-2 space-y-2 text-sm transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        {links.map((link, i) => (
          <li key={i}>
            <button
              onClick={() => handleClick(link)}
              className="hover:underline block text-left w-full text-brandBlue dark:text-white"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { isAuthenticated } = useAuth(); 

  const protectedLinks = [
    { label: "Your Account", to: "/user", state: { tab: "profile" } },
    { label: "Your Orders", to: "/user", state: { tab: "orders" } },
    { label: "Your Address", to: "/user", state: { tab: "profile" } },
    { label: "Your WishList", to: "/user", state: { tab: "wishlist" } },
  ];

  const sections = [
    {
      title: "Shopping With Us",
      links: protectedLinks, // these need auth
    },
    {
      title: "Quick Links",
      links: [
        { label: "Search", to: "/", state: { focusSearch: true } },
        { label: "About", to: "/about" },
        { label: "FAQS", to: "/faq" },
      ],
    },
    {
      title: "Find It Quick",
      links: [
        { label: "Upcoming Items", to: "/upcoming" },
        { label: "Most Viewed", to: "/most-viewed" },
      ],
    },
    {
      title: "Contact Us",
      links: [
        { label: "Dhaka, Narayanganj, Fatullah", to: "/contact" },
        { label: "mtkshanto@gmail.com", to: "/contact" },
        { label: "01852345222", to: "/contact" },
      ],
    },
  ];

  return (
    <footer className="bg-brandWhite border-t-2 dark:bg-black text-black dark:text-brandWhite px-5 py-10 md:px-20 md:py-16">

      {/* MOBILE */}
      <div className="md:hidden">
        {sections.map((section, index) => (
          <FooterSection
            key={index}
            title={section.title}
            links={section.links}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:grid grid-cols-4 gap-10">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-4 text-brandBlue dark:text-white">
              {section.title}
            </h3>

            <ul className="space-y-2 text-sm">
              {section.links.map((link, i) => (
                <li key={i}>
                  <Link
                    to={
                      !isAuthenticated &&
                      ["profile", "orders", "wishlist"].includes(link?.state?.tab)
                        ? `/login?redirect=${link.to}`
                        : link.to
                    }
                    state={link.state || null}
                    className="hover:underline hover:tracking-widest transition-all duration-300 ease-in-out block text-brandBlue dark:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </footer>
  );
};

export default Footer;
