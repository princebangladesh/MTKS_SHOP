import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/api";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Shop() {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  React.useEffect(() => {
    fetch(`${BASE_URL}/category/`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((cat) => cat.in_shop === true);
        setCategories(filtered);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const pattern = [1, 3, 2];

  const colorSets = [
    "bg-[#2AC3D1] dark:bg-[#0C383C]",
    "bg-[#3097CF] dark:bg-[#070443]",
    "bg-[#8B41EC] dark:bg-[#0B0217]",
  ];

  return (
    <div className="w-full p-6 space-y-6 dark:bg-black dark:text-white">

      {/* ==================== SKELETON LOADER ==================== */}
      {loading && (
        <div className="space-y-6">
          {pattern.map((count, i) => (
            <div key={i} className={`grid grid-cols-${count} gap-4`}>
              {Array.from({ length: count }).map((_, idx) => (
                <div
                  key={idx}
                  className="
                    h-48 rounded-2xl 
                    bg-gray-300 dark:bg-gray-700
                    animate-pulse
                  "
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ==================== REAL CONTENT ==================== */}
      {!loading && (
        (() => {
          let index = 0;
          const rows = [];
          let delayCounter = 0;

          while (index < categories.length) {
            for (let i = 0; i < pattern.length; i++) {
              if (index >= categories.length) break;

              const count = pattern[i];
              const slice = categories.slice(index, index + count);
              const colors = colorSets[i % colorSets.length];

              const imageClass =
                count === 3
                  ? "absolute right-4 top-1/2 -translate-y-1/2 w-[55%] h-[90%] sm:w-[45%] sm:h-[85%] md:w-[40%] md:h-[80%] object-contain transition duration-300 group-hover:scale-110"
                  : "absolute right-4 top-1/2 -translate-y-1/2 w-[45%] h-[85%] sm:w-[40%] sm:h-[80%] md:w-[35%] md:h-[80%] object-contain transition duration-300 group-hover:scale-110";

              rows.push(
                <div
                  key={`row-${index}`}
                  className={`grid grid-cols-${count} gap-4`}
                >
                  {slice.map((cat) => {
                    const delay = (delayCounter++ % 10) * 100; // Smooth stagger

                    return (
                      <Link
                        to={`/category/${cat.slug}`}
                        key={cat.id}
                        data-aos="fade-up"
                        data-aos-delay={delay}
                        className={`
                          group
                          h-48 rounded-2xl shadow-lg relative overflow-hidden
                          flex items-center justify-start cursor-pointer block
                          ${colors}
                        `}
                      >
                        {/* Gradient Overlay */}
                        <div className="
                          absolute inset-0 
                          bg-gradient-to-r from-black/40 to-black/10
                          dark:from-black/50 dark:to-black/20
                          pointer-events-none
                        "></div>

                        {/* Hover Zoom Image */}
                        <img
                          src={cat.popular_image}
                          alt={cat.name}
                          className={imageClass}
                        />

                        {/* Category Name */}
                        <h2 className="relative z-10 p-3 text-xl font-semibold text-white drop-shadow-lg">
                          {cat.name}
                        </h2>
                      </Link>
                    );
                  })}
                </div>
              );

              index += count;
            }
          }

          return <>{rows}</>;
        })()
      )}

    </div>
  );
}
