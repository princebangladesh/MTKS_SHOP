import React, { useState } from 'react';

const FooterSection = ({ title, links, index, activeIndex, setActiveIndex }) => {
  const isOpen = activeIndex === index;

  return (
    <div className="border-b border-gray-300 dark:border-border-gray-300 py-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setActiveIndex(isOpen ? null : index)}
      >
        <h3 className="text-lg font-semibold text-brandBlue dark:text-white">{title}</h3>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </div>
      <ul className={`mt-2 space-y-2 text-sm transition-all duration-500 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"}`}>
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:underline block text-brandBlue dark:text-white">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const sections = [
    {
      title: "Shopping With Us",
      links: ["Your Account", "Your Orders", "Your Address", "Your List"],
    },
    {
      title: "Quick Links",
      links: ["Search", "About", "FAQS"],
    },
    {
      title: "Find It Quick",
      links: ["Upcoming Items", "Most Viewed"],
    },
    {
      title: "Contact Us",
      links: ["Dhaka, Narayanganj, Fatullah", "example@gmail.com", "018XXXXXXXX"],
    },
  ];

  return (
    <footer className="bg-brandWhite border-t-2 dark:bg-black text-black dark:text-brandWhite px-5 py-10 md:px-20 md:py-16 ">
      <div className="md:hidden ">
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

        {/* App store buttons (visible on all screen sizes) */}
        <div className="mt-6 flex space-x-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Google Play"
            className="w-28"
          />
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="App Store"
            className="w-28"
          />
        </div>
      </div>

      {/* Desktop version (if needed) */}
      <div className="hidden md:grid grid-cols-4 gap-10">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-4 text-brandBlue dark:text-white">{section.title}</h3>
            <ul className="space-y-2 text-sm">
              {section.links.map((link, i) => (
                <li key={i}><a href="#" className="hover:underline hover:tracking-widest transition-all duration-300 ease-in-out block text-brandBlue dark:text-white">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;