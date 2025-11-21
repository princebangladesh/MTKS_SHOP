import { useMemo } from "react";
import { useLoader } from "./loaderContext";

function PlSidebar({
  products,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  minprice,
  maxprice,
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
  step = 1,
  onFilterClick,
  isMobile = false,
  closeMobileSidebar = null,
}) {
  const { setLoading } = useLoader();

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(value);
  };

  const handleFilterClick = () => {
    setLoading(true);
    onFilterClick && onFilterClick();
    setTimeout(() => setLoading(false), 300);
  };

  const uniqueCategories = useMemo(() => {
    return [...new Set(products.map((p) => p.category_name))];
  }, [products]);

  const handleCategoryChange = (category) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
      setLoading(false);
    }, 200);
  };

  const uniqueBrands = useMemo(() => {
    return [
      ...new Set(
        products
          .map((p) => p.brand?.name)
          .filter((b) => b && b.trim() !== "")
      ),
    ];
  }, [products]);

  const handleBrandChange = (brand) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedBrands((prev) =>
        prev.includes(brand)
          ? prev.filter((b) => b !== brand)
          : [...prev, brand]
      );
      setLoading(false);
    }, 200);
  };

  return (
    <aside
      className={`
        w-64 bg-white dark:bg-black p-4 shadow-lg 
        h-full overflow-y-auto z-50

        ${isMobile ? "block" : "hidden md:block"}
      `}
    >
      {/* Close button for mobile */}
      {isMobile && closeMobileSidebar && (
        <button
          onClick={closeMobileSidebar}
          className="w-full bg-red-600 text-white py-2 rounded-lg mb-4 font-bold"
        >
          ✕ Close Filters
        </button>
      )}

      {/* Categories */}
      <div className="mb-6 border-b pb-6">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Categories
        </h3>

        {uniqueCategories.map((cat, index) => (
          <label
            key={index}
            className="flex items-center space-x-2 mb-2 dark:text-gray-200"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
              className="form-checkbox accent-brandGreen"
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      {/* Price Slider */}
      <div className="mb-6 border-b pb-6">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Price Range
        </h3>

        <p className="text-sm font-semibold dark:text-white mb-2">
          ${minVal} – ${maxVal}
        </p>

        <div className="relative h-6 my-4">
          <div className="absolute inset-0 h-1.5 bg-gray-300 rounded-full"></div>

          <div
            className="absolute h-2 bg-brandGreen rounded-full"
            style={{
              left: `${((minVal - minprice) / (maxprice - minprice)) * 100}%`,
              right: `${
                100 - ((maxVal - minprice) / (maxprice - minprice)) * 100
              }%`,
            }}
          ></div>

          {/* Min */}
          <input
            type="range"
            min={minprice}
            max={maxprice}
            value={minVal}
            step={step}
            onChange={handleMinChange}
            className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none"
            style={{ zIndex: 10 }}
          />

          {/* Max */}
          <input
            type="range"
            min={minprice}
            max={maxprice}
            value={maxVal}
            step={step}
            onChange={handleMaxChange}
            className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none"
          />

          <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 18px;
            width: 18px;
            background: #062c30;
            border-radius: 50%;
            margin-top: -12px;
            cursor: pointer;
            pointer-events: all;
          }
        `}</style>
        </div>

        <button
          onClick={handleFilterClick}
          className="bg-brandGreen text-white w-full py-2 rounded-lg font-semibold"
        >
          Apply Filters
        </button>
      </div>

      {/* Brands */}
      <div className="mb-6 pb-6">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Brands
        </h3>

        {uniqueBrands.map((brand, index) => (
          <label
            key={index}
            className="flex items-center space-x-2 mb-2 dark:text-gray-200"
          >
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
              className="form-checkbox accent-brandGreen"
            />
            <span>{brand}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}

export default PlSidebar;
