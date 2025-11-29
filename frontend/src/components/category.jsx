import React from "react";
import Loader from "./shared/loader";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

function Category() {
  const navigate = useNavigate();
  const [CatData, setCatData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const NavigateClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  React.useEffect(() => {
    fetch(`${BASE_URL}/category/`)
      .then((res) => res.json())
      .then((data) => {
        setCatData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Category Grid (2 → 3 → 6 columns, NEVER 4) */}
        <div className="
            grid 
            grid-cols-2        /* mobile = 2 cols */
            sm:grid-cols-3     /* small/tablet = 3 cols */
            md:grid-cols-3     /* medium/tablet = 3 cols */
            lg:grid-cols-6     /* desktop = 6 cols */
            gap-4 sm:gap-6
        ">
          {CatData.map(
            (item, index) =>
              item.icon_in_landing_page === true && (
                <div
                  key={index}
                  onClick={() => NavigateClick(item.slug)}
                  className="
                    Caro-bg rounded-lg shadow p-5 text-center
                    group cursor-pointer transition transform 
                    active:scale-95 hover:shadow-lg
                  "
                >
                  <div
                    className="
                      text-3xl sm:text-4xl mb-4 dark:text-brandWhite
                      group-hover:scale-125 transition-all
                    "
                  >
                    <i className={`fi fi-${item.icon_landing_page} m-auto`} />
                  </div>

                  <h2
                    className="
                      text-sm sm:text-base font-semibold
                      group-hover:tracking-wide dark:text-brandWhite
                      transition-all
                    "
                  >
                    {item.name}
                  </h2>
                </div>
              )
          )}
        </div>

      </div>
    </div>
  );
}

export default Category;
