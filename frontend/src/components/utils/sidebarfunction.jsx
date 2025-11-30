// src/components/utils/sidebarfunction.jsx

import React from "react";

// ===========================
// Load products with skeleton
// ===========================
export function loadProducts(
  products,
  currentPage,
  showCount,
  setDisplayedProducts,
  setLoading
) {
  setLoading(true);

  const startIndex = (currentPage - 1) * showCount;
  const endIndex = startIndex + showCount;

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDisplayedProducts(products.slice(startIndex, endIndex));
    setLoading(false);
  }, 500);
}

// ===========================
// Items per page change
// ===========================
export function handleShowChange(e, setShowCount, setCurrentPage) {
  setShowCount(parseInt(e.target.value));
  setTimeout(() => setCurrentPage(1), 500);
}

// ===========================
// View layout switcher
// ===========================
export function handleViewChange(newView, view, setView, setLoading) {
  if (newView === view) return;
  setLoading(true);

  setTimeout(() => {
    setView(newView);
    setLoading(false);
  }, 120);
}

// ===========================
// Pagination
// ===========================
export function goToPreviousPage(currentPage, setCurrentPage) {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
}

export function goToNextPage(currentPage, totalPages, setCurrentPage) {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
}

// ===========================
// Auto Price Range Extractor
// (Final Warning-Free Version)
// ===========================
export function usePriceRangeFilter(
  products,
  setMinPrice,
  setMaxPrice,
  setSelectedMin,
  setSelectedMax
) {
  React.useEffect(() => {
    if (!products || products.length === 0) return;

    // Extract price from product or variant
    const prices = products
      .map((p) => {
        const variantPrice = p?.variants?.length
          ? Number(p.variants[0]?.price ?? 0)
          : 0;

        const fallbackPrice = Number(
          p.display_price ??
            p.current_price ??
            p.price ??
            0
        );

        return variantPrice || fallbackPrice;
      })
      .filter((value) => value > 0);

    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      // Update state
      setMinPrice(min);
      setMaxPrice(max);
      setSelectedMin(min);
      setSelectedMax(max);
    }

    // Ignore missing dependency warnings for stable setter functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);
}
