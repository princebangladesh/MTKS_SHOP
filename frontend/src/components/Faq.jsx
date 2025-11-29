import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/* ------------------ FAQ DATA ------------------ */
const faqSections = [
  {
    category: "Shopping & Orders",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept major cards, PayPal, mobile wallets, and Cash on Delivery (where available).",
      },
      {
        q: "How long does shipping take?",
        a: "Delivery usually takes 3–7 business days depending on your location.",
      },
    ],
  },
  {
    category: "Returns & Tracking",
    items: [
      {
        q: "Can I return or exchange a product?",
        a: "Yes! We offer a 30-day return and exchange policy for eligible products.",
      },
      {
        q: "How do I track my order?",
        a: "Once shipped, you will receive a tracking link via email or SMS.",
      },
    ],
  },
  {
    category: "Account & Security",
    items: [
      {
        q: "Are my personal details secure?",
        a: "Absolutely. Your data is encrypted and protected using SSL & secure payment gateways.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "No, you can checkout as a guest. Creating an account unlocks more features.",
      },
    ],
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState("");

  const handleToggle = (i) => {
    setOpen(open === i ? null : i);
  };

  /* ------------------ FILTERING ------------------ */
  const filteredSections = faqSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.q.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div
      className="
      min-h-screen 
      bg-gradient-to-b from-[#eef1f6] to-white 
      dark:from-[#0d0d0d] dark:to-[#1a1a1a]
      py-12 px-4 sm:px-8
    "
    >
      <div
        className="
        max-w-5xl mx-auto p-6 sm:p-10 
        rounded-3xl shadow-md 
        bg-white dark:bg-[#111] 
        border border-gray-200 dark:border-neutral-800
      "
      >
        {/* PAGE TITLE */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">
          Frequently Asked Questions
        </h2>

        {/* SEARCH BAR */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search a question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full p-3 rounded-xl border 
              bg-white dark:bg-[#1a1a1a] 
              border-gray-300 dark:border-neutral-700
              text-gray-900 dark:text-gray-200 
              focus:ring-2 focus:ring-brandGreen
              transition-all
            "
          />
        </div>

        {/* MULTI-COLUMN FAQ SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSections.map((section, sectionIndex) => (
            section.items.length > 0 && (
              <div key={sectionIndex}>
                {/* SECTION HEADING */}
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  {section.category}
                </h3>

                {/* SECTION ITEMS */}
                <div className="divide-y divide-gray-300 dark:divide-neutral-700">
                  {section.items.map((item, i) => {
                    const indexKey = `${sectionIndex}-${i}`;
                    return (
                      <div key={indexKey} className="py-4">
                        {/* QUESTION BUTTON */}
                        <button
                          onClick={() => handleToggle(indexKey)}
                          className="
                            w-full flex justify-between items-center
                            text-left text-lg font-semibold 
                            text-gray-900 dark:text-white
                            transition-all
                          "
                        >
                          {item.q}

                          {/* ROTATING CHEVRON */}
                          <FiChevronDown
                            className={`
                              text-2xl transition-transform
                              text-gray-700 dark:text-gray-300
                              ${open === indexKey ? "rotate-180" : ""}
                            `}
                          />
                        </button>

                        {/* ANSWER */}
                        <div
                          className={`
                            overflow-hidden transition-all duration-300
                            text-gray-700 dark:text-gray-300
                            ${open === indexKey ? "max-h-40 mt-3" : "max-h-0"}
                          `}
                        >
                          <p className="text-sm leading-relaxed">{item.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
