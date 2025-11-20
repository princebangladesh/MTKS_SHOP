import React, { useState, useMemo } from 'react';



function CategoryFilter() {


  const [selectedCategories, setSelectedCategories] = useState([]);

  // Get all unique categories
  const uniqueCategories = useMemo(() => {
    return [...new Set(products.flatMap((p) => p.categories))];
  }, []);

  // Handle checkbox toggle
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Filter products by selected categories
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;

    // Keep product if any of its categories match selected ones
    return products.filter((product) =>
      product.categories.some((cat) => selectedCategories.includes(cat))
    );
  }, [selectedCategories]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Filter by Category</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        {uniqueCategories.map((cat) => (
          <label key={cat} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="capitalize">{cat}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Products:</h3>
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredProducts.map((product) => (
              <li key={product.id} className="p-2 border rounded">
                <strong>{product.title}</strong> — Categories: {product.categories.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default CategoryFilter;