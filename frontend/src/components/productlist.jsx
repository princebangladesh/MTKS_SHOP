import React, { useEffect, useMemo, useState } from "react";
import { FaTh, FaList, FaFilter } from "react-icons/fa";
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
  const prices = products.map((p) =>
    p.variants?.length ? Number(p.variants[0].price) : Number(p.display_price ?? 0)
  );

  const minprice = Math.min(...prices);
  const maxprice = Math.max(...prices);

  const [minVal, setMinVal] = useState(minprice);
  const [maxVal, setMaxVal] = useState(maxprice);

  const [sortOption, setSortOption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list"); // grid = "grid"
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [priceFilteredProducts, setPriceFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(products.length / showCount);
  const isGridView = view === "list";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMinVal(minprice);
    setMaxVal(maxprice);
  }, [minprice, maxprice]);

  useEffect(() => {
    setPriceFilteredProducts([]);
  }, [currentPage, showCount, products]);

  const filteredProducts = useMemo(() => {
    let result =
      priceFilteredProducts.length > 0
        ? [...priceFilteredProducts]
        : [...displayedProducts];

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category_name)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand?.name)
      );
    }

    // Sort Logic
    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => {
          const p1 = a.variants?.length ? Number(a.variants[0].price) : a.display_price;
          const p2 = b.variants?.length ? Number(b.variants[0].price) : b.display_price;
          return p1 - p2;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const p1 = a.variants?.length ? Number(a.variants[0].price) : a.display_price;
          const p2 = b.variants?.length ? Number(b.variants[0].price) : b.display_price;
          return p2 - p1;
        });
        break;
      default:
        break;
    }

    return result;
  }, [
    displayedProducts,
    priceFilteredProducts,
    selectedCategories,
    selectedBrands,
    sortOption,
  ]);

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

  const handlePriceFilter = () => {
    setLoading(true);

    setTimeout(() => {
      const result = displayedProducts.filter((product) => {
        const price = product.variants?.length
          ? Number(product.variants[0].price)
          : Number(product.display_price ?? 0);

        return price >= minVal && price <= maxVal;
      });

      setPriceFilteredProducts(result);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-brandGreen text-white m-3 rounded-lg shadow"
      >
        <FaFilter /> Filters
      </button>

      {/* BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-black shadow-lg
          transform transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
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
          onFilterClick={handlePriceFilter}
          isMobile={true}
          closeMobileSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* DESKTOP SIDEBAR */}
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
        onFilterClick={handlePriceFilter}
        isMobile={false}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-3 sm:p-6">

        {/* TOP CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

          {/* View Switch */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewChange("list", view, setView, setLoading)}
              className={`p-2 rounded ${
                view === "list"
                  ? "bg-brandGreen text-white"
                  : "bg-gray-200 dark:bg-black dark:text-white"
              }`}
            >
              <FaTh />
            </button>

            <button
              onClick={() => handleViewChange("grid", view, setView, setLoading)}
              className={`p-2 rounded ${
                view === "grid"
                  ? "bg-brandGreen text-white"
                  : "bg-gray-200 dark:bg-black dark:text-white"
              }`}
            >
              <FaList />
            </button>
          </div>

          {/* Count */}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {products.length} items found
          </p>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">

            <select
              value={showCount}
              onChange={(e) => handleShowChange(e, setShowCount, setCurrentPage)}
              className="border p-2 text-sm rounded dark:bg-black dark:text-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border p-2 text-sm rounded dark:bg-black dark:text-white"
            >
              <option value="">Sort By</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
            </select>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div
          className={
            isGridView
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            onNext={() => goToNextPage(currentPage, totalPages, setCurrentPage)}
            onPrevious={() => goToPreviousPage(currentPage, setCurrentPage)}
          />
        )}
      </main>
    </div>
  );
}

export default ProductList;
