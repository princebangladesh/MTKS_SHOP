import React, { useEffect, useMemo, useState } from "react";
import { FaTh, FaList } from "react-icons/fa";
import PlSidebar from "./shared/plsidebar";
import ProductListView from "./shared/productlistview";
import ProductLand from "./shared/lanproduct";
import Pagination from "./shared/pagination";
import ProductListSkeleton from "./skeleton/productlistskeleton";

import {
  handleShowChange,
  handleViewChange,
  goToNextPage,
  goToPreviousPage,
  loadProducts,
} from "./utils/sidebarfunction";

function ProductList({ products }) {
  /* --------------------------------------------
     🔥 REAL PRICE EXTRACTOR FOR API FIX 
  ----------------------------------------------*/
  const prices = products.map((p) => {
    // Prefer Variant Price
    if (p.variants?.length > 0) {
      return Number(p.variants[0].price);
    }
    // Fallback — display_price
    return Number(p.display_price ?? 0);
  });

  const minprice = Math.min(...prices);
  const maxprice = Math.max(...prices);

  /* --------------------------------------------
     STATE
  ----------------------------------------------*/
  const [minVal, setMinVal] = useState(minprice);
  const [maxVal, setMaxVal] = useState(maxprice);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list"); // list = grid
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(products.length / showCount);
  const isGridView = view === "list";

  /* --------------------------------------------
     FILTER + SORT LOGIC
  ----------------------------------------------*/
  const filteredProducts = useMemo(() => {
    let result = displayedProducts.filter((product) => {
      const price =
        product.variants?.length > 0
          ? Number(product.variants[0].price)
          : Number(product.display_price);

      const matchPrice = price >= minVal && price <= maxVal;

      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category_name);

      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand?.name);

      return matchPrice && matchCategory && matchBrand;
    });

    // Sorting
    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => {
          const p1 = a.variants?.length
            ? Number(a.variants[0].price)
            : Number(a.display_price);
          const p2 = b.variants?.length
            ? Number(b.variants[0].price)
            : Number(b.display_price);
          return p1 - p2;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const p1 = a.variants?.length
            ? Number(a.variants[0].price)
            : Number(a.display_price);
          const p2 = b.variants?.length
            ? Number(b.variants[0].price)
            : Number(b.display_price);
          return p2 - p1;
        });
        break;
      default:
        break;
    }

    return result;
  }, [
    displayedProducts,
    selectedCategories,
    selectedBrands,
    sortOption,
    minVal,
    maxVal,
  ]);

  /* --------------------------------------------
     INITIAL LOAD + PAGINATION
  ----------------------------------------------*/
  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    loadProducts(
      products,
      currentPage,
      showCount,
      setDisplayedProducts,
      setLoading
    );
  }, [products, currentPage, showCount]);

  /* --------------------------------------------
     SORT CHANGE
  ----------------------------------------------*/
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  };

  /* --------------------------------------------
     UI
  ----------------------------------------------*/
  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <PlSidebar
        products={products}
        minprice={minprice}
        maxprice={maxprice}
        minVal={minVal}
        maxVal={maxVal}
        setMinVal={setMinVal}
        setMaxVal={setMaxVal}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {/* TOP CONTROL BAR */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewChange("list", view, setView, setLoading)}
              className={`p-2 rounded ${
                view === "list"
                  ? "bg-brandGreen text-white"
                  : "bg-gray-100 dark:bg-black dark:text-white"
              }`}
            >
              <FaTh />
            </button>

            <button
              onClick={() => handleViewChange("grid", view, setView, setLoading)}
              className={`p-2 rounded ${
                view === "grid"
                  ? "bg-brandGreen text-white"
                  : "bg-gray-100 dark:bg-black dark:text-white"
              }`}
            >
              <FaList />
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            We found <strong>{products.length}</strong> items for you!
          </p>

          <div className="flex gap-3">
            {/* SHOW COUNT */}
            <select
              value={showCount}
              onChange={(e) => handleShowChange(e, setShowCount, setCurrentPage)}
              className="border p-1 text-sm rounded dark:bg-black dark:text-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            {/* SORT */}
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border p-1 text-sm rounded dark:bg-black dark:text-white"
            >
              <option value="">Sort By</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
            </select>
          </div>
        </div>

        {/* PRODUCT GRID / LIST */}
        <div
          className={
            isGridView
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {loading
            ? Array.from({ length: showCount }).map((_, index) => (
                <ProductListSkeleton key={index} />
              ))
            : filteredProducts.map((item) => (
                <div key={item.id}>
                  {isGridView ? (
                    <ProductLand product={item} />
                  ) : (
                    <ProductListView product={item} />
                  )}
                </div>
              ))}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() =>
              goToNextPage(currentPage, totalPages, setCurrentPage)
            }
            onPrevious={() => goToPreviousPage(currentPage, setCurrentPage)}
          />
        )}
      </main>
    </div>
  );
}

export default ProductList;
