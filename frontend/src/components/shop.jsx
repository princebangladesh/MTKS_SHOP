import React from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/api";

export default function Shop() {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  return (
    <div className="w-full p-6 space-y-6 dark:bg-black dark:text-white">

      {/* ================= SKELETON ================= */}
      {loading && (
        <>
          <div className="grid grid-cols-1 gap-4 animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
          </div>

          <div className="grid grid-cols-3 gap-4 animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
          </div>

          <div className="grid grid-cols-2 gap-4 animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
          </div>
        </>
      )}

      {/* ================ REAL CONTENT ================ */}
      {!loading && (
        (() => {
          const pattern = [1, 3, 2];
          const colorSets = [
            "bg-[#2AC3D1] dark:bg-[#0C383C]",
            "bg-[#3097CF] dark:bg-[#070443]",
            "bg-[#8B41EC] dark:bg-[#0B0217]",
          ];

          let index = 0;
          let rows = [];

          patternLoop: while (index < categories.length) {
            for (let i = 0; i < pattern.length; i++) {
              if (index >= categories.length) break patternLoop;

              const count = pattern[i];
              const slice = categories.slice(index, index + count);
              const colors = colorSets[i % colorSets.length];

              rows.push(
                <div key={`row-${index}`} className={`grid grid-cols-${count} gap-4`}>
                  {slice.map((cat) => (
                    <Link
                      to={`/category/${cat.slug}`}
                      key={cat.id}
                      className={`h-48 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-start cursor-pointer block ${colors}`}
                    >
                      <img
                        src={cat.popular_image}
                        alt={cat.name}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-[35%] h-[80%] object-contain transition duration-300"
                      />
                      <h2 className="relative z-10 p-3 text-xl font-semibold text-white">
                        {cat.name}
                      </h2>
                    </Link>
                  ))}
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