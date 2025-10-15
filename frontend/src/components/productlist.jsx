import React, { useEffect, useMemo, useState } from 'react';
import { FaTh, FaList } from 'react-icons/fa';
import PlSidebar from './shared/plsidebar';
import ProductListView from './shared/productlistview';
import ProductLand from './shared/lanproduct';
import Pagination from './shared/pagination';
import {
  handleShowChange,
  handleViewChange,
  goToNextPage,
  goToPreviousPage,
  loadProducts,
} from './utils/sidebarfunction';
import ProductListSkeleton from './skeleton/productlistskeleton';

function ProductList({ products }) {
  const prices = products.map((p) => p.current_price);
  const minprice = Math.min(...prices);
  const maxprice = Math.max(...prices);

  const [minVal, setMinVal] = useState(minprice);
  const [maxVal, setMaxVal] = useState(maxprice);
  const [sortOption, setSortOption] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('list');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(products.length / showCount);
  const isGridView = view === 'list';

  const filteredProducts = useMemo(() => {
    let result = displayedProducts.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category_name);
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand_name);
      return matchesCategory && matchesBrand;
    });

    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.current_price - a.current_price);
        break;
      default:
        break;
    }

    return result;
  }, [displayedProducts, selectedCategories, selectedBrands, sortOption]);

  // Initial load and pagination
  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadProducts(products, currentPage, showCount, setDisplayedProducts, () => {});
    const timer = setTimeout(() => setLoading(false), 500); // Show skeleton for 3s
    return () => clearTimeout(timer);
  }, [products, currentPage, showCount]);

  // Handle sort change
  const handleSortChange = (e) => {
  const selected = e.target.value;
  setSortOption(selected);
  setLoading(true);
  const timer = setTimeout(() => setLoading(false), 500); // Show skeleton for 3s
  return () => clearTimeout(timer);
};
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <PlSidebar
        products={products}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        minprice={minprice}
        maxprice={maxprice}
        minVal={minVal}
        maxVal={maxVal}
        setMinVal={setMinVal}
        setMaxVal={setMaxVal}
        setDisplayedProducts={setDisplayedProducts}
      />

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Controls */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewChange('list', view, setView, setLoading)}
              className={`p-2 rounded ${view === 'list' ? 'bg-brandGreen text-white' : 'bg-gray-100 dark:bg-black dark:text-white'}`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => handleViewChange('grid', view, setView, setLoading)}
              className={`p-2 rounded ${view === 'grid' ? 'bg-brandGreen text-white' : 'bg-gray-100 dark:bg-black dark:text-white'}`}
            >
              <FaList />
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            We found <strong>{products.length}</strong> items for you!
          </p>

          <div className="flex gap-3">
            <label htmlFor="showSelect" className="dark:text-white">Show:</label>
            <select
              id="showSelect"
              value={showCount}
              onChange={(e) => handleShowChange(e, setShowCount, setCurrentPage)}
              className="border p-1 text-sm rounded dark:bg-black dark:text-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

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

        {/* Product Grid/List */}
        <div className={`${isGridView ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'space-y-6'}`}>
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

        {/* Pagination */}
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
