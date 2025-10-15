import { useMemo } from "react";
import { useLoader } from "./loaderContext";



function PlSidebar({ products,selectedCategories,setSelectedCategories,setDisplayedProducts,selectedBrands,setSelectedBrands, step = 1,onFilter,minprice,maxprice,minVal,maxVal,setMinVal,setMaxVal }) {
  const { setLoading } = useLoader();

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(value);
  };

   const handleFilterClick = () => {
    setLoading(true);

  // Simulate async operation (remove setTimeout if not needed)
  setTimeout(() => {
    const results = products.filter((product) => {
      const matchesPrice =
        product.current_price >= minVal && product.current_price <= maxVal;

      return matchesPrice;
    });

    setDisplayedProducts(results);
    setLoading(false);
  }, 300); // Optional delay for UX
};

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(value);
  };

  // Get all unique categories
  const uniqueCategories = useMemo(() => {
    return [...new Set(products.flatMap((p) => p.category_name))];
  }, []);



    // Handle checkbox toggle
    const handleCategoryChange = (category) => {
          // Start loading
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
    // Filter products by selected categories
  const uniqueBrands = useMemo(() => {
    return [...new Set(products.flatMap((p) => p.brand_name))];
  }, []);  

  const handleBrandChange = (brand) => {
          // Start loading
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
     <aside className="w-64 bg-white dark:bg-black p-4 shadow-lg hidden md:block">
      <div className="mb-6  border-b pb-6">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Categories</h3>
        {uniqueCategories.map((cat,index) => (
          <div key={index} className='space-y-2'>
          <label key={cat} className="flex items-center space-x-2 dark:text-gray-200">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
              className="form-checkbox accent-brandGreen dark:accent-brandWhite"
            />
            <span>{cat}</span>
          </label>
          </div>
        ))}
      </div>

      <div className="mb-6 border-b pb-6">
        <h3 className="font-semibold mb-2 text-BrandGreen dark:text-brandWhite">Price Slider</h3>

        <div className="w-full max-w-md mx-auto py-2">
      <div className="mb-4 text-center text-lg font-semibold dark:text-brandWhite">
        ${minVal} - ${maxVal}
      </div>
      <div className="relative h-6">
        {/* Track background */}
        <div className="absolute inset-0 bg-gray-300 rounded-full h-1.5" />
        {/* Active track */}
        <div
          className="absolute bg-brandGreen h-2.5 rounded-full"
          style={{
            left: `${((minVal - minprice) / (maxprice - minprice)) * 100}%`,
            right: `${100 - ((maxVal - minprice) / (maxprice - minprice)) * 100}%`,
          }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={minprice}
          max={maxprice}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none"
          style={{ zIndex: minVal > maxVal - 100 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={minprice}
          max={maxprice}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none"
        />
        {/* Custom thumbs via pseudo-elements (optional) */}
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            margin-top: -12px; /* Center thumb vertically */
            height: 16px;
            width: 16px;
            background: #021e0fff;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: all;
            position: relative;
            z-index: 10;
          }

          input[type="range"]::-moz-range-thumb {
            height: 160px;
            width: 16px;
            background: #082d36ff;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: all;
            position: relative;
            z-index: 10;
          }
        `}</style>
      </div>
    </div>
        <button className="hovTransition text-sm px-4 py-1 " onClick={handleFilterClick}>Filter</button>
      </div>

      <div  className='mb-6 border-b pb-6'>
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Color</h3>
        
      </div>
      <div  className='mb-6 border-b pb-6'>
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Brand</h3>
        {uniqueBrands.map((brand,index) => (
          <div key={index} className='space-y-2'>
          <label key={brand} className="flex items-center space-x-2 dark:text-gray-200">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
              className="form-checkbox accent-brandGreen dark:accent-brandWhite"
            />
            <span>{brand}</span>
          </label>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default PlSidebar;