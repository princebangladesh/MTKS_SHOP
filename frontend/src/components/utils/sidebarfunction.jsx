import React from 'react';

// Load products with skeleton-based delay (no spinner)
export function loadProducts(products, currentPage, showCount, setDisplayedProducts, setLoading) {
  setLoading(true);
  const startIndex = (currentPage - 1) * showCount;
  const endIndex = startIndex + showCount;

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDisplayedProducts(products.slice(startIndex, endIndex));
    setLoading(false);
  }, 500); // 2.5s skeleton duration
}

// Handle items per page change
export function handleShowChange(e, setShowCount, setCurrentPage) {
  setShowCount(parseInt(e.target.value));
  setTimeout(() => {
    setCurrentPage(1);
  }, 500);
}

// Handle view switch with skeleton animation
export function handleViewChange(newView, view, setView, setLoading) {
  if (newView === view) return;
  setLoading(true);

  setTimeout(() => {
    setView(newView);
    setLoading(false);
  }, 100); // simulate skeleton animation
}

// Pagination helpers
export function goToPreviousPage(currentPage, setCurrentPage) {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
}

export function goToNextPage(currentPage, totalPages, setCurrentPage) {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
}

// Optional: Price filter hook (used in sidebar maybe)
export function usePriceRangeFilter(products, setMinPrice, setMaxPrice, setSelectedMin, setSelectedMax) {
  React.useEffect(() => {
    const prices = products.map((p) => p.current_price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setMinPrice(min);
    setMaxPrice(max);
    setSelectedMin(min);
    setSelectedMax(max);
  }, [products]);
}
